import React, { useEffect, useState } from 'react';
import { SearchStyles, Wrapper } from '../../search/search.styles';
import { Card, Skeleton, Empty } from 'antd';
import { FilterDiscoveryStyles } from './discover-filter.styles';
import { TMDBCardComponent } from '../../tmdb-card/tmdb-card.component';
import {
  useGetDiscoverLazyQuery,
  GetDiscoverQueryVariables,
  useGetLibraryMoviesQuery,
} from '../../../utils/graphql';
import { DiscoverFilterFormComponent } from './discover-filter-from.component';
import { isNumber } from 'util';

export function DiscoverFilterComponent() {
  const [discover, { data, loading }] = useGetDiscoverLazyQuery();
  const { data: moviesLibrary } = useGetLibraryMoviesQuery();
  const tmdbIds = moviesLibrary?.movies?.map(({ tmdbId }) => tmdbId) || [];
  const [params, setParams] = useState<GetDiscoverQueryVariables>({
    originLanguage: 'ja',
    score: 80,
    genres: [28],
  });

  const moviesSearchResults = data?.movies || [];
  const hasNoSearchResults = moviesSearchResults.length === 0;

  const onFinish = (formParams: GetDiscoverQueryVariables) => {
    const { year, ...rest } = formParams;
    setParams({ year: isNumber(year) ? year : undefined, ...rest });
  };

  useEffect(() => {
    discover({
      variables: params,
    });
  }, [params, discover]);

  return (
    <SearchStyles>
      <Wrapper>
        <FilterDiscoveryStyles>
          <div className="search-results--container">
            <div className="search-results--category">Discover by filter</div>
            <div className="wrapper">
              <div className="flex">
                <div className="discover--filter">
                  <Card title="Filters" size="small">
                    <DiscoverFilterFormComponent
                      params={params}
                      onFinish={onFinish}
                    />
                  </Card>
                </div>
                <div className="discover--result">
                  <Card size="small">
                    <Skeleton active={true} loading={!data || loading}>
                      {data && hasNoSearchResults && (
                        <Empty description="No results... 😔" />
                      )}
                      <div className="discover--result-cards-container">
                        {!hasNoSearchResults &&
                          moviesSearchResults.map((res) => (
                            <TMDBCardComponent
                              key={res.id}
                              type="movie"
                              result={res}
                              inLibrary={tmdbIds.includes(res.tmdbId)}
                            />
                          ))}
                      </div>
                    </Skeleton>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </FilterDiscoveryStyles>
      </Wrapper>
    </SearchStyles>
  );
}
