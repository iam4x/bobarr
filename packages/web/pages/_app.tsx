import 'pure-react-carousel/dist/react-carousel.es.css';

import App from 'next/app';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { Reset } from 'styled-reset';

import { theme } from '../components/theme';

export default class MyApp extends App {
  public render() {
    const { Component, pageProps } = this.props;
    return (
      <ThemeProvider theme={theme}>
        <Reset />
        <Component {...pageProps} />
      </ThemeProvider>
    );
  }
}
