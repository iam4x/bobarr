import React, { useState } from 'react';
import Mansonry from 'react-masonry-component';
import { orderBy } from 'lodash';
import { Skeleton, Empty, Button, Input } from 'antd';

import {
  SortDescendingOutlined,
  SortAscendingOutlined,
} from '@ant-design/icons';

import { useGetLibraryMoviesQuery } from '../../utils/graphql';
import { createSearchFunction } from '../../utils/create-search-function';

import { LibraryHeaderComponent } from '../library-header/library-header.component';
import { TMDBCardComponent } from '../tmdb-card/tmdb-card.component';

import { MoviesComponentStyles } from './movies.styles';

const sortAttributes = [
  { label: 'Name', key: 'title' },
  { label: 'Added at', key: 'createdAt' },
  { label: 'Release date', key: 'releaseDate' },
  { label: 'Score', key: 'voteAverage' },
] as const;

export function MoviesComponent() {
  const { data, loading } = useGetLibraryMoviesQuery();

  const [orderByAttribute, setOderByAttribute] = useState('title:asc');
  const [searchQuery, setSearchQuery] = useState('');

  const searchFn = createSearchFunction(['title', 'releaseDate'], searchQuery);

  const [key, order] = orderByAttribute.split(':') as [string, 'desc' | 'asc'];
  const rows = orderBy(data?.movies, [key], [order]).filter((row) =>
    searchQuery.trim() && searchQuery.trim().length >= 3 ? searchFn(row) : true
  );

  const handleSort = (newSort: { label: string; key: string }) => {
    if (newSort.key === key) {
      return setOderByAttribute(
        order === 'asc' ? `${newSort.key}:desc` : `${newSort.key}:asc`
      );
    }
    return setOderByAttribute(`${newSort.key}:desc`);
  };

  return (
    <>
      <LibraryHeaderComponent types={['movie']} />
      <MoviesComponentStyles>
        <div className="wrapper">
          <Skeleton active={true} loading={loading}>
            <div className="header">
              <div className="sort-buttons">
                {sortAttributes.map((sortAttr) => (
                  <Button
                    key={sortAttr.key}
                    type={sortAttr.key === key ? 'default' : 'dashed'}
                    onClick={() => handleSort(sortAttr)}
                    icon={
                      sortAttr.key === key
                        ? (order === 'asc' && <SortDescendingOutlined />) || (
                            <SortAscendingOutlined />
                          )
                        : undefined
                    }
                  >
                    {sortAttr.label}
                  </Button>
                ))}
              </div>
              <div className="search-input">
                <Input.Search
                  value={searchQuery}
                  onChange={({ target }) => setSearchQuery(target.value)}
                />
              </div>
            </div>

            {rows.length === 0 ? (
              <Empty />
            ) : (
              <Mansonry className="flex">
                {rows.map((movie) => (
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
