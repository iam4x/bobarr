import React from 'react';
import Head from 'next/head';

import { LayoutComponent } from '../components/layout/layout.component';
import { SearchComponent } from '../components/search/search.component';
import { withApollo } from '../components/with-apollo';

function SearchPage() {
  return (
    <>
      <Head>
        <title>Bobarr - Search</title>
      </Head>
      <LayoutComponent>
        <SearchComponent />
      </LayoutComponent>
    </>
  );
}

export default withApollo(SearchPage);
