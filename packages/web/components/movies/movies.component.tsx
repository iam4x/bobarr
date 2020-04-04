import React from 'react';
import styled from 'styled-components';
import { Skeleton } from 'antd';

import { useGetLibraryMoviesQuery } from '../../utils/graphql';

const MoviesComponentStyles = styled.div``;

export function MoviesComponent() {
  const { data, loading } = useGetLibraryMoviesQuery();

  return (
    <MoviesComponentStyles>
      <Skeleton active={true} loading={loading}>
        <pre>{JSON.stringify(data, null, 4)}</pre>
      </Skeleton>
    </MoviesComponentStyles>
  );
}
