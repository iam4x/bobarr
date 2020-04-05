import React from 'react';
import { Skeleton } from 'antd';

import { useGetLibraryMoviesQuery } from '../../utils/graphql';

import { TMDBCardComponent } from '../tmdb-card/tmdb-card.component';
import { DownloadingComponent } from '../downloading/downloading.component';

import { MoviesComponentStyles } from './movies.styles';

export function MoviesComponent() {
  const { data, loading } = useGetLibraryMoviesQuery();

  return (
    <>
      <DownloadingComponent types={['movie']} />
      <MoviesComponentStyles>
        <div className="wrapper">
          <Skeleton active={true} loading={loading}>
            <div className="flex">
              {data?.movies?.map((movie) => (
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
