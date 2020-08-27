import React from 'react';
import Head from 'next/head';

import { withApollo } from '../../components/with-apollo';
import { LayoutComponent } from '../../components/layout/layout.component';
import { MoviesComponent } from '../../components/movies/movies.component';

function MoviesPage() {
  return (
    <>
      <Head>
        <title>Bobarr - Movies</title>
      </Head>
      <LayoutComponent>
        <MoviesComponent />
      </LayoutComponent>
    </>
  );
}

export default withApollo(MoviesPage);
