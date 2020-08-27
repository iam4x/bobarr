import React from 'react';
import Head from 'next/head';

import { LayoutComponent } from '../components/layout/layout.component';
import { withApollo } from '../components/with-apollo';
import { DiscoverComponent } from '../components/discover/discover.component';

function DiscoverPage() {
  return (
    <>
      <Head>
        <title>Bobarr - Discover</title>
      </Head>
      <LayoutComponent>
        <DiscoverComponent />
      </LayoutComponent>
    </>
  );
}

export default withApollo(DiscoverPage);
