import React from 'react';
import { Skeleton, Empty } from 'antd';

import { useGetLibraryMoviesQuery } from '../../utils/graphql';

import { LibraryHeaderComponent } from '../library-header/library-header.component';
import { TMDBCardComponent } from '../tmdb-card/tmdb-card.component';

import { MoviesComponentStyles } from './movies.styles';

export function MoviesComponent() {
  const { data, loading } = useGetLibraryMoviesQuery();

  return (
    <>
      <LibraryHeaderComponent types={['movie']} />
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
