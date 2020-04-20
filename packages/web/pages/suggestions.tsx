import React from 'react';
import Head from 'next/head';

import { LayoutComponent } from '../components/layout/layout.component';
import { withApollo } from '../components/with-apollo';
import { SuggestionsComponent } from '../components/suggestions/suggestions.component';

function SuggestionsPage() {
  return (
    <>
      <Head>
        <title>Bobarr - Suggestions</title>
      </Head>
      <LayoutComponent>
        <SuggestionsComponent />
      </LayoutComponent>
    </>
  );
}

export default withApollo({ ssr: false })(SuggestionsPage);
