Title: Monitoring
Date: 2020-12-18
Category: Minotring
Tags: blog
Slug: monitoring
Status: draft
Authors: Sébastien Barbier
Summary: First post of a series regarding my implementation to solve the monitoring of my services

My personal website broke couple weeks ago without me noticing. I did not put in place any monitoring, and now realise that was a bad idea. There is many services offerint such service like [hyperping](https://hyperping.io/), [UptimeRobot](https://uptimerobot.com/), or [status.io](https://status.io/), but even if pricing can be really cheap I feld limited regarding my will to implement some sorts of fancy dashboarding.

If I first quickly subscribe one of those to fix this, here is my experiment regarding implementing a home made open source solution.

My first step is going to be a docker-compose with static config files to monitor current infra. Instead of building everything by myself, I will be using existing libraries and especially [https://prometheus.io/](prometheus.io) and the [black explorer plugin](https://github.com/prometheus/blackbox_exporter) which can generate metrics for a public http url. First version will also provide a dashboard with [Grafana](https://grafana.com/) so I don't have to implement anything. Also will be using [node-explorer](https://prometheus.io/docs/guides/node-exporter/) to keep an eye on the CPU/memory load. When done, next step will be to make it as a Saas to eventually generate income.

## Infrastructure

I know how easy it is to spend money on new side projects, no more I said. My first idea was to go fully local using  araspberrypi but finally out of commodity decided to go with a cheap [virtual private server instance at OVH](https://www.ovhcloud.com/fr/vps/) which cost as low as 5.52€ ttc / month.

Prometheus can store data locally, but having in mind to go public as a service and scale may be horizontally a centrallized Postgresql instance might come soon.

## Target implementation

Prometheuse, Black explorer, and Grafana all come with ready to use docker image. My goal will be to build a single command install protocol to easily deploy and reuse it. I will also try to make it open source and easy to reuse by others.

## Node Explorer

Keeping an eye on each server ressource, [node-explorer](https://prometheus.io/docs/guides/node-exporter/) can be used to generate prometheus metrics.

Node-exporter can run on background but need to restart with server. TODO

## Prometheus

Using docker image, prometheus can run locally really easiy


## INSTALLATION

sudo adduser sbarbier
sudo deluser ubuntu

install docker : https://docs.docker.com/engine/install/ubuntu/

Use [from/edwin monitor](https://github.com/fromedwin/monitor) repository.

## LOKI

https://medium.com/@moeenz/dockerized-django-logging-via-grafana-loki-48464d13f8cb
