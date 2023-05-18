import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          rel="preload"
          href="/fonts/DarumadropOne-Regular.ttf" 
          as="font"
          crossOrigin='anonymous'
        />
        <link
          rel="preload"
          href="/fonts/Dosis-VariableFont_wght.ttf" 
          as="font"
          crossOrigin='anonymous'
        />
        <link
          rel="preload"
          href="/fonts/Kanit-Regular.ttf" 
          as="font"
          crossOrigin='anonymous'
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
