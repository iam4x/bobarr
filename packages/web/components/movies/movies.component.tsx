import React from 'react';
import Mansonry from 'react-masonry-component';
import { Skeleton, Empty } from 'antd';

import { useGetLibraryMoviesQuery, EnrichedMovie } from '../../utils/graphql';

import { LibraryHeaderComponent } from '../library-header/library-header.component';
import { TMDBCardComponent } from '../tmdb-card/tmdb-card.component';

import { MoviesComponentStyles } from './movies.styles';
import { useSortable } from '../sortable/sortable.component';

const sortAttributes = [
  { label: 'Name', key: 'title' },
  { label: 'Release date', key: 'releaseDate' },
  { label: 'Score', key: 'voteAverage' },
  { label: 'Added at', key: 'createdAt' },
];

export function MoviesComponent() {
  const { data, loading } = useGetLibraryMoviesQuery();
  const { renderSortable, results } = useSortable<EnrichedMovie>({
    sortAttributes,
    searchableAttributes: ['title', 'originalTitle', 'releaseDate'],
    rows: data?.movies,
  });

  return (
    <>
      <LibraryHeaderComponent types={['movie']} />
      <MoviesComponentStyles>
        <div className="wrapper">
          <Skeleton active={true} loading={loading}>
            {renderSortable()}
            {results.length === 0 ? (
              <Empty />
            ) : (
              <Mansonry className="flex">
                {results.map((movie) => (
                  <div className="movie-card" key={movie.id}>
                    <TMDBCardComponent
                      type="movie"
                      result={movie}
                      inLibrary={true}
                    />
                  </div>
                ))}
              </Mansonry>
            )}
          </Skeleton>
        </div>
      </MoviesComponentStyles>
    </>
  );
}
