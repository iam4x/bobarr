import React from 'react';

import { withApollo } from '../../components/with-apollo';
import { LayoutComponent } from '../../components/layout/layout.component';
import { TVShowsComponent } from '../../components/tvshows/tvshows.component';

function TVShowsPage() {
  return (
    <LayoutComponent>
      <TVShowsComponent />
    </LayoutComponent>
  );
}

export default withApollo({ ssr: false })(TVShowsPage);
