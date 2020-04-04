import 'pure-react-carousel/dist/react-carousel.es.css';
import 'antd/dist/antd.css';

import App from 'next/app';
import React from 'react';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import { Reset } from 'styled-reset';

import { theme } from '../components/theme';

const GlobalStyles = createGlobalStyle`
  html {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      Helvetica, Arial, sans-serif, 'Apple Color Emoji',
      'Segoe UI Emoji', 'Segoe UI Symbol';
  }

  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }

  .icon-spin {
    -webkit-animation: icon-spin 2s infinite linear;
    animation: icon-spin 2s infinite linear;
  }

  @-webkit-keyframes icon-spin {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(359deg);
      transform: rotate(359deg);
    }
  }

  @keyframes icon-spin {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(359deg);
      transform: rotate(359deg);
    }
  }
`;

export default class MyApp extends App {
  public render() {
    const { Component, pageProps } = this.props;
    return (
      <ThemeProvider theme={theme}>
        <>
          <Reset />
          <GlobalStyles />
          <Component {...pageProps} />
        </>
      </ThemeProvider>
    );
  }
}
