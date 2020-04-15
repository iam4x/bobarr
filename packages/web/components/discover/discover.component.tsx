import React from 'react';
import { Skeleton, Empty } from 'antd';

import { CarouselComponent } from '../search/carousel.component';
import { SearchStyles, Wrapper } from '../search/search.styles';

import { useGetRecommendedQuery } from '../../utils/graphql';

export function DiscoverComponent() {
  const { data, loading } = useGetRecommendedQuery({
    fetchPolicy: 'cache-and-network',
  });

  const hasRecommendations = Boolean(
    data?.movies?.length || data?.tvShows?.length
  );

  const isLoading = !hasRecommendations && loading;

  return (
    <SearchStyles>
      <div className="search-bar--container">
        <Wrapper>
          <div className="search-bar--title">What are we watching next?</div>
          <div className="search-bar--subtitle" style={{ marginBottom: 0 }}>
            Discover recommendations based on your library...
          </div>
        </Wrapper>
      </div>

      <Wrapper>
        {isLoading && <Skeleton active={true} loading={true} />}
        {!hasRecommendations && !isLoading && <Empty />}
        {hasRecommendations && !isLoading && (
          <>
            {Boolean(data?.movies?.length) && (
              <div className="search-results--container">
                <div className="search-results--category">
                  Recommended Movies
                </div>
                {data?.movies && data.movies.length === 0 && <Empty />}
                <CarouselComponent type="movie" results={data?.movies || []} />
              </div>
            )}
            {Boolean(data?.tvShows?.length) && (
              <div className="search-results--container">
                <div className="search-results--category">
                  Recommended TV Shows
                </div>
                <CarouselComponent type="movie" results={data?.tvShows || []} />
              </div>
            )}
          </>
        )}
      </Wrapper>
    </SearchStyles>
  );
}
