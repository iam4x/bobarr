import React from 'react';
import { Skeleton, Empty } from 'antd';

import { useGetLibraryMoviesQuery } from '../../utils/graphql';

import { DownloadingComponent } from '../downloading/downloading.component';
import { MissingComponent } from '../missing/missing.component';
import { TMDBCardComponent } from '../tmdb-card/tmdb-card.component';

import { MoviesComponentStyles } from './movies.styles';

export function MoviesComponent() {
  const { data, loading } = useGetLibraryMoviesQuery();

  return (
    <>
      <div style={{ background: '#A4BCC2', padding: '24px 0' }}>
        <DownloadingComponent types={['movie']} />
        <MissingComponent />
      </div>
      <MoviesComponentStyles>
        <div className="wrapper">
          <Skeleton active={true} loading={loading}>
            {data?.movies?.length === 0 && <Empty />}
            <div className="flex">
              {data?.movies.map((movie) => (
                <div className="movie-card" key={movie.id}>
                  <TMDBCardComponent
                    type="movie"
                    result={movie}
                    inLibrary={true}
                  />
                </div>
              ))}
            </div>
          </Skeleton>
        </div>
      </MoviesComponentStyles>
    </>
  );
}
