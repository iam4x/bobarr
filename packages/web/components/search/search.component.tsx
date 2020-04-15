import React, { useState, useEffect, useRef } from 'react';
import { Skeleton, Empty } from 'antd';
import { LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import { debounce, throttle } from 'throttle-debounce';

import { useGetPopularQuery, useSearchLazyQuery } from '../../utils/graphql';

import { CarouselComponent } from './carousel.component';
import { SearchStyles, Wrapper } from './search.styles';

export function SearchComponent() {
  const [searchQuery, setSearchQuery] = useState('');

  const popularQuery = useGetPopularQuery();
  const [search, { data, loading }] = useSearchLazyQuery();

  const { current: debouncedSearch } = useRef(debounce(500, search));
  const { current: throttledSearch } = useRef(throttle(500, search));

  const displaySearchResults = searchQuery && searchQuery.trim();
  const moviesSearchResults = data?.results?.movies || [];
  const tvShowSearchResults = data?.results?.tvShows || [];
  const hasNoSearchResults =
    moviesSearchResults.length === 0 && tvShowSearchResults.length === 0;

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    search({ variables: { query: searchQuery } });
  };

  useEffect(() => {
    if (searchQuery && searchQuery.trim()) {
      if (searchQuery.length < 5) {
        throttledSearch({ variables: { query: searchQuery } });
      } else {
        debouncedSearch({ variables: { query: searchQuery } });
      }
    }
  }, [debouncedSearch, searchQuery, throttledSearch]);

  return (
    <SearchStyles>
      <div className="search-bar--container">
        <Wrapper>
          <div className="search-bar--title">What are we watching next?</div>
          <div className="search-bar--subtitle">Search anything...</div>
          <form onSubmit={handleSearch}>
            <div className="search-bar--input-container">
              <input
                type="text"
                className="search-bar--input"
                value={searchQuery}
                onChange={({ target }) => setSearchQuery(target.value)}
              />
              <button type="submit" className="search-bar--input-submit">
                <span style={{ marginRight: 8 }}>
                  {loading ? <LoadingOutlined /> : <SearchOutlined />}
                </span>
                Search
              </button>
            </div>
          </form>
        </Wrapper>
      </div>

      <Wrapper>
        <div className="search-results--container">
          <Skeleton
            active={true}
            loading={popularQuery.loading || (hasNoSearchResults && loading)}
          >
            {displaySearchResults && hasNoSearchResults ? (
              <Empty description="No results... 😔" />
            ) : (
              <>
                {(displaySearchResults
                  ? moviesSearchResults.length > 0
                  : true) && (
                  <>
                    <div className="search-results--category">
                      {displaySearchResults ? 'Found Movies' : 'Popular Movies'}
                    </div>
                    <CarouselComponent
                      type="movie"
                      results={
                        displaySearchResults
                          ? moviesSearchResults
                          : popularQuery.data?.results?.movies || []
                      }
                    />
                  </>
                )}
                {(displaySearchResults
                  ? tvShowSearchResults.length > 0
                  : true) && (
                  <>
                    <div className="search-results--category">
                      {displaySearchResults
                        ? 'Found TV Shows'
                        : 'Popular TV Shows'}
                    </div>
                    <CarouselComponent
                      type="tvshow"
                      results={
                        displaySearchResults
                          ? tvShowSearchResults
                          : popularQuery.data?.results?.tvShows || []
                      }
                    />
                  </>
                )}
              </>
            )}
          </Skeleton>
        </div>
      </Wrapper>
    </SearchStyles>
  );
}
