import React from 'react';
import Mansonry from 'react-masonry-component';
import styled from 'styled-components';
import { Skeleton, Empty } from 'antd';

import { useGetLibraryTvShowsQuery, EnrichedTvShow } from '../../utils/graphql';

import { LibraryHeaderComponent } from '../library-header/library-header.component';
import { TMDBCardComponent } from '../tmdb-card/tmdb-card.component';

import { MoviesComponentStyles } from '../movies/movies.styles';
import { useSortable } from '../sortable/sortable.component';

const TVShowsComponentStyles = styled(MoviesComponentStyles)``;

const sortAttributes = [
  { label: 'Name', key: 'title' },
  { label: 'First aired', key: 'releaseDate' },
  { label: 'Score', key: 'voteAverage' },
  { label: 'Added at', key: 'createdAt' },
];

export function TVShowsComponent() {
  const { data, loading } = useGetLibraryTvShowsQuery();
  const { renderSortable, results } = useSortable<EnrichedTvShow>({
    sortAttributes,
    searchableAttributes: ['title', 'originalTitle', 'releaseDate'],
    rows: data?.tvShows,
  });

  return (
    <>
      <LibraryHeaderComponent types={['season', 'episode']} />
      <TVShowsComponentStyles>
        <div className="wrapper">
          <Skeleton active={true} loading={loading}>
            {data?.tvShows.length === 0 ? (
              <Empty />
            ) : (
              <>
                {renderSortable()}
                <Mansonry className="flex">
                  {results.map((tvShow) => (
                    <div className="tvshow-card" key={tvShow.id}>
                      <TMDBCardComponent
                        type="tvshow"
                        result={tvShow}
                        inLibrary={true}
                      />
                    </div>
                  ))}
                </Mansonry>
              </>
            )}
          </Skeleton>
        </div>
      </TVShowsComponentStyles>
    </>
  );
}
