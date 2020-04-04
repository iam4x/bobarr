import React from 'react';

import { withApollo } from '../../components/with-apollo';
import { LayoutComponent } from '../../components/layout/layout.component';
import { MoviesComponent } from '../../components/movies/movies.component';

function MoviesPage() {
  return (
    <LayoutComponent>
      <MoviesComponent />
    </LayoutComponent>
  );
}

export default withApollo({ ssr: false })(MoviesPage);
