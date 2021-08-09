Title: Self hosted VPN with pihole
Date: 2021-08-06
Category: self-hosting
Tags: blog
Slug: self-hosted-vpn-with-pihole
Authors: Sébastien Barbier
Summary: Secure your internet with a self hosted vpn

Travelling involve the need to rely on public wifi which can often be insecure. A VPN offer protection by encrypting all communications, but needs full trust within its provider. One solution consist of installing a self-hosted VPN on a virtual private server. This article is how I did it.

*Prerequirement: this article assume basic knowledge in unix commands, and docker.*

## Virtual private server

Any server with a public IP can host your VPN, but online companies offer chear dedicated virtual private server (VPS) on linux. I personnaly went for a **5,52 euros/month** at [OVH](https://www.ovh.com) (🇫🇷) with *1 vCore, 2 Go RAM, 40 Go SSD NVMe, 250 Mbit/s unlimited*. Alternatives work, as [scaleway](ttps://www.scaleway.com)(🇫🇷), or [exoscale](https://www.exoscale.com/) (🇨🇭), but would go for a local provider near your location for better performances. This will also have an impact on geolocalised content within most website.

Also, most website identify your IP as from a server and often disable some content (one example being subscribing to Netflix with a foreign pricing). For such case I personnaly use my mobile phone on roaming which provide a perfectly valid IP address from my home country and a legitimate way to avoid such issue.

Please be aware a self hosted server require maintenance and updates to garanty its full security.

## Docker and docker-compose

Full setup is composed of 4 docker image describe in a single [docker-compose](https://docs.docker.com/compose/) file to deploy:

- **[kylemanna/openvpn](https://github.com/kylemanna/docker-openvpn)** for VPN
- **[pihole/pihole:latest](https://github.com/pi-hole/docker-pi-hole/#running-pi-hole-docker)** for DNS blocking
- **[nginx](https://hub.docker.com/_/nginx/)** to handle http requests
- **[certbot](https://hub.docker.com/r/certbot/certbot)** to provide https certificate using lets encrypt

``` yaml
version: '3'
services:
  nginx:
    image: "nginx:latest"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/:/etc/nginx/conf.d/
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
      - /var/log:/var/log
    links:
      - openvpn
      - pihole
    command: "/bin/sh -c 'while :; do sleep 6h & wait $${!}; nginx -s reload; done & nginx -g \"daemon off;\"'"
  certbot:
    image: certbot/certbot
    volumes:  
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"    
  openvpn:
    cap_add:
     - NET_ADMIN
    image: kylemanna/openvpn
    container_name: openvpn
    ports:
     - "1194:1194/udp"
    links:
      - pihole
    restart: always
    volumes:
     - ./openvpn-data/conf:/etc/openvpn
  pihole:
    container_name: pihole
    image: pihole/pihole:latest
    environment:
      TZ: '   Europe/Zurich'
      VIRTUAL_HOST: pihole.example.com
    volumes:
      - './pihole/etc-pihole/:/etc/pihole/'
      - './pihole/etc-dnsmasq.d/:/etc/dnsmasq.d/'
    # Recommended but not required (DHCP needs NET_ADMIN)
    #   https://github.com/pi-hole/docker-pi-hole#note-on-capabilities
    cap_add:
      - NET_ADMIN
    restart: unless-stopped
```

## Openvpn

Using SSH to run our docker-compose file, the [kylemanna/docker-openvpn](https://github.com/kylemanna/docker-openvpn) image will run a plug and play openvpn (ovpn) instance runningon **port 1194**. 

It is requried to initialise ovpn, then generate a client certificate for each device you with to connect.

Initialize the configuration files and certificates
``` bash
docker-compose run --rm openvpn ovpn_genconfig -u udp://VPN.SERVERNAME.COM
docker-compose run --rm openvpn ovpn_initpki
```

Fix ownership (depending on how to handle your backups, this may not be needed)
``` bash
sudo chown -R $(whoami): ./openvpn-data
```

Start OpenVPN server process
``` bash
docker-compose up -d openvpn
```

You can access the container logs with
``` bash
docker-compose logs -f
```

Generate a client certificate
``` bash
export CLIENTNAME="your_client_name"
# with a passphrase (recommended)
docker-compose run --rm openvpn easyrsa build-client-full $CLIENTNAME
# without a passphrase (not recommended)
docker-compose run --rm openvpn easyrsa build-client-full $CLIENTNAME nopass
```

Retrieve the client configuration with embedded certificates
``` bash
docker-compose run --rm openvpn ovpn_getclient $CLIENTNAME > $CLIENTNAME.ovpn
```
Revoke a client certificate
``` bash
# Keep the corresponding crt, key and req files.
docker-compose run --rm openvpn ovpn_revokeclient $CLIENTNAME
# Remove the corresponding crt, key and req files.
docker-compose run --rm openvpn ovpn_revokeclient $CLIENTNAME remove
```

You should now be able to get the .ovpn file on your machine using `scp username@vpn.example.com:my-folder/client-name.ovpn .` then login with any [openvpn client](https://openvpn.net/vpn-client/).

## Pihole

Pi-hole is a Linux network-level advertisement and Internet tracker blocking application which acts as a DNS sinkhole. It ships as a [docker image](https://github.com/pi-hole/docker-pi-hole/#running-pi-hole-docker) and will run next to openvpn

VPN service is linked to pihole so it can call DNS APIs

``` yaml
links:
  - pihole

```

Block lists are available all around the internet. Those seams well recommanded:

- [https://github.com/mhhakim/pihole-blocklist](https://github.com/mhhakim/pihole-blocklist)
- [https://avoidthehack.com/best-pihole-blocklists](https://avoidthehack.com/best-pihole-blocklists)
- [https://github.com/lightswitch05/hosts](https://github.com/lightswitch05/hosts)

Password can be reset using

```bash
docker exec -it pihole_container_name pihole -a -p
```

### Set default DNS within opvn

To set default DNS ip wihtin open vpn do the following :

```bash
docker ps
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' pi_hole_container_id
```

Then add within `/openvpn-data/confopenvpn.conf`

```bash
# push "dhcp-option DNS 8.8.8.8"
# push "dhcp-option DNS 8.8.4.4"
push "dhcp-option DNS 172.22.0.2"
```

Best would be to have docker providing static ip for this container by defining it within docker-compose. 

## Nginx with https access to pi-hole admin panel

nginx require a .conf file to know 

``` bash
server {
    listen 80;
    server_name dns.example.com;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

# # https://medium.com/@pentacent/nginx-and-lets-encrypt-with-docker-in-less-than-5-minutes-b4b8a60d3a71
server {
    listen 443 ssl http2;
    server_name dns.example.com;
    try_files $uri/ $uri;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        proxy_set_header   X-Real-IP        $remote_addr;
        proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
        proxy_set_header   Host             $host;
        proxy_pass http://pihole:80/;
    }
}
```

### Generate SSL certificates

[studentenhuisDS4/ds4reboot](https://github.com/studentenhuisDS4/ds4reboot/wiki/Docker-and-production-info) provide a script to generate certificates. 

It will first generate self certified script to enable nginx with 443 port open, then have letsencrypt challenge running to validate certificates. It will also restart nginx using docker-compose to be prod ready without further action required.

``` bash
#!/bin/bash

if ! [ -x "$(command -v docker-compose)" ]; then
  echo 'Error: docker-compose is not installed.' >&2
  exit 1
fi

domains=(my-domain-1.com my-domain-2.com)
rsa_key_size=4096
data_path="./certbot"
email="admin@example.com" # Adding a valid address is strongly recommended
staging=0 # Set to 1 if you're testing your setup to avoid hitting request limits

if [ -d "$data_path" ]; then
  read -p "Existing data found for $domains. Continue and replace existing certificate? (y/N) " decision
  if [ "$decision" != "Y" ] && [ "$decision" != "y" ]; then
    exit
  fi
fi


if [ ! -e "$data_path/conf/options-ssl-nginx.conf" ] || [ ! -e "$data_path/conf/ssl-dhparams.pem" ]; then
  echo "### Downloading recommended TLS parameters ..."
  mkdir -p "$data_path/conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > "$data_path/conf/options-ssl-nginx.conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "$data_path/conf/ssl-dhparams.pem"
  echo
fi

echo "### Creating dummy certificate for $domains ..."
path="/etc/letsencrypt/live/$domains"
mkdir -p "$data_path/conf/live/$domains"
docker-compose run --rm --entrypoint "\
  openssl req -x509 -nodes -newkey rsa:2048 -days 1\
    -keyout '$path/privkey.pem' \
    -out '$path/fullchain.pem' \
    -subj '/CN=localhost'" certbot
echo


echo "### Starting nginx ..."
docker-compose up --force-recreate -d nginx
echo

echo "### Deleting dummy certificate for $domains ..."
docker-compose run --rm --entrypoint "\
  rm -Rf /etc/letsencrypt/live/$domains && \
  rm -Rf /etc/letsencrypt/archive/$domains && \
  rm -Rf /etc/letsencrypt/renewal/$domains.conf" certbot
echo


echo "### Requesting Let's Encrypt certificate for $domains ..."
#Join $domains to -d args
domain_args=""
for domain in "${domains[@]}"; do
  domain_args="$domain_args -d $domain"
done

# Select appropriate email arg
case "$email" in
  "") email_arg="--register-unsafely-without-email" ;;
  *) email_arg="--email $email" ;;
esac

# Enable staging mode if needed
if [ $staging != "0" ]; then staging_arg="--staging"; fi

docker-compose run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    $staging_arg \
    $email_arg \
    $domain_args \
    --rsa-key-size $rsa_key_size \
    --agree-tos \
    --force-renewal" certbot
echo

echo "### Reloading nginx ..."
docker-compose exec nginx nginx -s reload
```

## and more ...

My personnal setup is currently save within a github repo publicly available at [https://github.com/sebastienbarbier/config-proxy](https://github.com/sebastienbarbier/config-proxy)

You should now be able to run your VPN with all traffic redirected through it, use pihole to block DNS requests, and then access pihole dashboard using https.

Next step for me was to connect my Synology NAS direclty to the VPN providing so access from my home without configuring any router or routing.

Hope this was helpful.