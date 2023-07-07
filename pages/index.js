import Head from 'next/head'
import Link from 'next/link'

import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
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
import utilStyles from '../styles/utils.module.css'

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
          <Grid item xs={12} sm={10} md={6}>
            <section className={utilStyles.headingMd}>
            </section>
            <h2>Latest articles</h2>
            <List>
             {allPostsData.map(({ id, date, title }) => (
              <ListItemButton key={id} divider={true} component={Link} href={`/posts/${id}`} alignItems="flex-start">

                  <ListItemText
                    primary={title}
                    secondary={<Date dateString={date} />}
                  />
              </ListItemButton>
              ))}
            </List>
          </Grid>
        </Grid>
        </Container>
    </Layout>
  )
}
