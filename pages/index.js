import Head from 'next/head'
import Link from 'next/link'

import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';

import Layout, { siteTitle } from '../components/layout'
import Date from '../components/date'

import { getSortedPostsData } from '../lib/posts'

export async function getStaticProps() {
  const allPostsData = getSortedPostsData()
  return {
    props: {
      allPostsData
    }
  }
}

export default function Home({ allPostsData }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>

      <Container>
      
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={12} md={12}>
            <section>
            <h1 class="centered">Blog posts</h1>
            </section>
            <List>
             {allPostsData.map(({ id, date, title, description }) => (
              <ListItemButton key={id} divider={true} component={Link} href={`/posts/${id}`} alignItems="flex-start">
                <Stack direction={{xs: 'column', sm: 'row' }} sx={{ paddingTop: 2, paddingBottom: 2 }}>
                  <Box sx={{ textTransform: 'uppercase', fontSize: '1em', marginRight: 8, marginBottom: 1, width: 150, marginTop: 1, fontWeight: 500 }}><Date dateString={date} formatString={`LLL dd yyyy`} /></Box>
                  <Box sx={{ width: '100%'}}>
                    <Typography variant="h3" sx={{ fontSize: '2.4rem', fontWeight: 'bold', paddingBottom: '0.4em' }}>{title}</Typography>
                    <Typography sx={{ fontSize: '1rem' }}>{ description }</Typography>
                  </Box>
                </Stack>
              </ListItemButton>
              ))}
            </List>
          </Grid>
        </Grid>
        </Container>
    </Layout>
  )
}
