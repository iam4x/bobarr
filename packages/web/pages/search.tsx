import React from 'react';

import { LayoutComponent } from '../components/layout/layout.component';
import { SearchComponent } from '../components/search/search.component';
import { withApollo } from '../components/with-apollo';

function SearchPage() {
  return (
    <LayoutComponent>
      <SearchComponent />
    </LayoutComponent>
  );
}

export default withApollo({ ssr: false })(SearchPage);
