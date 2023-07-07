import * as React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import createEmotionServer from '@emotion/server/create-instance';
import theme from '../components/theme';
import createEmotionCache from '../components/createEmotionCache';
import CssBaseline from '@mui/material/CssBaseline'
  
const name = 'SebastienBarbier'
export const siteTitle = 'SebastienBarbier - Blog'

export default class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                    <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
                    <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
                    <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
                    <link rel="manifest" href="/favicon/site.webmanifest" />
                    <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#5bbad5" />
                    <link rel="shortcut icon" href="/favicon/favicon.ico" />
                    <meta name="msapplication-TileColor" content="#2b5797" />
                    <meta name="msapplication-config" content="/favicon/browserconfig.xml" />
                    <meta name="theme-color" content="#ffffff" /> 
                    <meta
                      name="description"
                      content="Sebastien Barbier's personal blog"
                    />
                    <meta
                      property="og:image"
                      content={`/favicon/apple-touch-icon.png`}
                    />
                    <meta name="og:title" content={siteTitle} />
                    <meta name="twitter:card" content="summary_large_image" />
                    {/* PWA primary color */}
                    {/* Inject MUI styles first to match with the prepend: true configuration. */}
                    { this.props.emotionStyleTags }
                    <style jsx global>{``}</style>
                </Head>
                <Main />
                <NextScript />
            </Html>
        );
    }
}
  
// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with static-site generation (SSG).
MyDocument.getInitialProps = async (ctx) => {
    const originalRenderPage = ctx.renderPage;
  
    // You can consider sharing the same emotion cache between 
    // all the SSR requests to speed up performance.
    // However, be aware that it can have global side effects.
     
   const cache = createEmotionCache();
    const { extractCriticalToChunks } = createEmotionServer(cache);
  
    ctx.renderPage = () =>
        originalRenderPage({
            enhanceApp: (App) => props => <App emotionCache={cache} {...props} />
        });
  
    const initialProps = await Document.getInitialProps(ctx);
  
    // This is important. It prevents emotion to render invalid HTML.
    // See https://github.com/mui-org/material-ui/issues/26561#issuecomment-855286153
      
    const emotionStyles = extractCriticalToChunks(initialProps.html);
    const emotionStyleTags = emotionStyles.styles.map((style) => (
        <style
            data-emotion={`${style.key} ${style.ids.join(' ')}`}
            key={style.key}
  
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: style.css }}
        />
    ));
  
    return {
        ...initialProps,
        emotionStyleTags
    };
};