import React from 'react';
import Head from 'next/head';

import { withApollo } from '../../components/with-apollo';
import { LayoutComponent } from '../../components/layout/layout.component';
import { TVShowsComponent } from '../../components/tvshows/tvshows.component';

function TVShowsPage() {
  return (
    <>
      <Head>
        <title>Bobarr - TV Shows</title>
      </Head>
      <LayoutComponent>
        <TVShowsComponent />
      </LayoutComponent>
    </>
  );
}

export default withApollo({ ssr: false })(TVShowsPage);
