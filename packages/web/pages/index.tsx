import React from 'react';

import { withApollo } from '../components/with-apollo';
import { LayoutComponent } from '../components/layout/layout.component';
import { HomeComponent } from '../components/home/home.component';

function IndexPage() {
  return (
    <LayoutComponent>
      <HomeComponent />
    </LayoutComponent>
  );
}

export default withApollo({ ssr: false })(IndexPage);
