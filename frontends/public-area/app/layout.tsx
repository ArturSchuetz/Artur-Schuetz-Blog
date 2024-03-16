import "./globals.css";

import { Metadata } from 'next'
import Head from 'next/head';
import Script from 'next/script'

import Header from "./_components/layout/header";
import Footer from "./_components/layout/footer";

import { getConfig } from "@/config";

import siteConfig from "@/app/siteConfig.json";
const site_description = 'Experienced C++ game developer and software engineer shares insights into 3D programming, Unreal Engine 5, machine learning, and modern web development. Discover unique projects, code snippets, and professional solutions from real-world experience.'
const canonical_site_url = '/';

export const metadata: Metadata = {
  title: siteConfig.site.title,
  description: site_description,
  applicationName: siteConfig.site.title,
  authors: { url: getConfig().baseUrl + '/about-me', name: siteConfig.author.name },
  generator: 'Next.js 13.5.2',
  keywords: 'game development, 3D programming, 3d rendering, machine learning, unreal engine 5, web development',
  referrer: 'strict-origin-when-cross-origin',
  themeColor: { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  colorScheme: 'light',
  viewport: { width: "device-width", initialScale: 1 },
  creator: siteConfig.author.name,
  publisher: siteConfig.author.name,
  robots: 'index, follow',
  metadataBase: new URL(getConfig().baseUrl),
  alternates: { canonical: canonical_site_url },
  icons: { icon: "/favicon-32x32.png", apple: "/apple-touch-icon.png" }, // TODO: Need some rework and also constider other icons
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    determiner: 'auto',
    title: siteConfig.site.title,
    description: site_description,
    siteName: siteConfig.site.title,
    locale: 'en_US',
    url: canonical_site_url,
  },
  twitter: {
    card: "summary_large_image",
    site: siteConfig.site.twitter_site,
    creator: siteConfig.site.twitter_creator,
    title: siteConfig.site.title,
    description: site_description,
  },
  verification: { google: "0eHI7xbAWV6QAHW4nSFPIcGoQ7bN7Ga2UWt6FO6l2hA" },
  appleWebApp: { capable: true, title: siteConfig.site.title, statusBarStyle: "black-translucent" },
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
    url: false
  },
  category: 'Developer Blog',
  classification: 'Software Engineering'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
  <html lang="en">
    <Head>
      <title key="title">Artur Schütz Developer Blog</title>
      <meta name="author" content="Artur Schütz" />
      <meta name="robots" content="index,follow" />
      <meta name="msapplication-TileColor" content="#da532c" />
      <meta name="theme-color" content="#ffffff"></meta>
      <link rel="manifest" href="/site.webmanifest" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link
        rel="preload"
        as="font"
        href="/fonts/lato-v20-latin-ext_latin-regular.woff2"
        type="font/woff2"
      />
      <link
        rel="preload"
        as="font"
        href="/fonts/lato-v20-latin-ext_latin-700.woff2"
        type="font/woff2"
      />
      <link
        rel="preload"
        as="font"
        href="/fonts/lato-v20-latin-ext_latin-900.woff2"
        type="font/woff2"
      />
      <link
        rel="preload"
        as="font"
        href="/fonts/merriweather-v27-latin-ext_latin-regular.woff2"
        type="font/woff2"
      />
      <link
        rel="preload"
        as="font"
        href="/fonts/merriweather-v27-latin-ext_latin-700.woff2"
        type="font/woff2"
      />
      <link
        rel="preload"
        as="font"
        href="/fonts/merriweather-v27-latin-ext_latin-900.woff2"
        type="font/woff2"
      />
      <link
        rel="preload"
        as="font"
        href="/fonts/pe-icon-7-stroke/fonts/Pe-icon-7-stroke.woff"
        type="font/woff"
      />
      <link
        rel="stylesheet"
        href="/css/all.css"
        integrity="sha384-DyZ88mC6Up2uqS4h/KRgHuoeGwBcD4Ng9SiP4dIRy0EXTlnuz47vAwmeGwVChigm"
        crossOrigin="anonymous"
      />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orestbida/cookieconsent@v3.0.0-rc.17/dist/cookieconsent.css"></link>
    </Head>
    <Script
      type="text/javascript"
      async
      src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_CHTML"
    />
    <body>
      <Header />
      <div>{children}</div>
      <Footer />
    </body>
  </html>
  );
}
