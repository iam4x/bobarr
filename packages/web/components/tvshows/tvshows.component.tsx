import React from 'react';
import styled from 'styled-components';
import { Skeleton } from 'antd';

import { MoviesComponentStyles } from '../movies/movies.styles';
import { DownloadingComponent } from '../downloading/downloading.component';
import { useGetLibraryTvShowsQuery } from '../../utils/graphql';
import { TMDBCardComponent } from '../tmdb-card/tmdb-card.component';

const TVShowsComponentStyles = styled(MoviesComponentStyles)``;

export function TVShowsComponent() {
  const { data, loading } = useGetLibraryTvShowsQuery();

  return (
    <>
      <DownloadingComponent types={['season', 'episode']} />
      <TVShowsComponentStyles>
        <div className="wrapper">
          <Skeleton active={true} loading={loading}>
            <div className="flex">
              {data?.tvShows?.map((tvShow) => (
                <div className="tvshow-card" key={tvShow.id}>
                  <TMDBCardComponent
                    type="tvshow"
                    result={tvShow}
                    inLibrary={true}
                  />
                </div>
              ))}
            </div>
          </Skeleton>
        </div>
      </TVShowsComponentStyles>
    </>
  );
}
