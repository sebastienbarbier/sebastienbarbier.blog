import Head from 'next/head';
import PropTypes from 'prop-types';
import { CacheProvider } from '@emotion/react';

import CssBaseline from '@mui/material/CssBaseline';

import theme from '../components/theme';
import { ThemeProvider } from '@mui/material/styles';
import createEmotionCache from '../components/createEmotionCache';

import '../styles/global.scss'

const clientSideEmotionCache = createEmotionCache();

export default function App(props) {
  const { Component, emotionCache = 
        clientSideEmotionCache, pageProps } = props;

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" 
              content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </CacheProvider>
  )
}

App.propTypes = {
    Component: PropTypes.elementType.isRequired,
    emotionCache: PropTypes.object,
    pageProps: PropTypes.object.isRequired,
};