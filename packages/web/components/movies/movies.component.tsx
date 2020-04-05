import React from 'react';
import styled from 'styled-components';
import { Skeleton } from 'antd';

import { useGetLibraryMoviesQuery } from '../../utils/graphql';

import { TMDBCardComponent } from '../tmdb-card/tmdb-card.component';
import { DownloadingComponent } from '../downloading/downloading.component';

const MoviesComponentStyles = styled.div`
  padding-top: 64px;

  .wrapper {
    max-width: 1200px;
    margin: 0 auto;
  }

  .flex {
    display: flex;
    flex-wrap: wrap;
    margin-left: -12px;
    margin-right: -12px;
  }

  .movie-card {
    margin-left: 12px;
    margin-right: 12px;
    height: ${({ theme }) => theme.tmdbCardHeight}px;
  }
`;

export function MoviesComponent() {
  const { data, loading } = useGetLibraryMoviesQuery();

  const downloading =
    data?.movies?.filter(
      (movie) => movie.state === 'DOWNLOADING' || movie.state === 'MISSING'
    ) || [];

  return (
    <>
      <DownloadingComponent data={downloading} />
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
