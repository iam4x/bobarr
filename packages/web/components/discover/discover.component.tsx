import React, { useEffect, useState } from 'react';
import { SearchStyles, Wrapper } from '../search/search.styles';
import { Card, Skeleton, Empty } from 'antd';
import { DiscoverStyles } from './discover.styles';
import { TMDBCardComponent } from '../tmdb-card/tmdb-card.component';
import {
  useGetDiscoverLazyQuery,
  GetDiscoverQueryVariables,
  useGetLibraryMoviesQuery,
  useGetParamsQuery,
  Entertainment,
} from '../../utils/graphql';
import { DiscoverFilterFormComponent } from './discover-filter-from.component';
import dayjs from 'dayjs';

export function DiscoverComponent() {
  const [discover, { data, loading }] = useGetDiscoverLazyQuery();
  const { data: moviesLibrary } = useGetLibraryMoviesQuery();
  const { data: defaultUserParams } = useGetParamsQuery();

  const [filterParams, setFilterParams] = useState<GetDiscoverQueryVariables>({
    originLanguage: defaultUserParams?.params.language,
    score: 70,
    entertainment: Entertainment.Movie,
  });

  const tmdbIds = moviesLibrary?.movies?.map(({ tmdbId }) => tmdbId) || [];
  const results = data?.results || [];
  const hasNoSearchResults = results.length === 0;

  const onFinish = (formParams: GetDiscoverQueryVariables) => {
    const { year, ...rest } = formParams;
    setFilterParams({
      ...(year && { year: dayjs(year).format('YYYY') }),
      ...rest,
    });
  };

  useEffect(() => {
    discover({
      variables: filterParams,
    });
  }, [filterParams, discover]);

  return (
    <SearchStyles>
      <div className="search-bar--container">
        <Wrapper>
          <div className="search-bar--title">What are we watching next?</div>
          <div className="search-bar--subtitle" style={{ marginBottom: 0 }}>
            Dive deeper to discover next entertainment
          </div>
        </Wrapper>
      </div>
      <Wrapper>
        <DiscoverStyles>
          <div className="search-results--container">
            <div className="search-results--category" style={{ marginLeft: 0 }}>
              Discover by filter
            </div>
            <div className="wrapper">
              <div className="flex">
                <div className="discover--filter">
                  <Card title="Filters" size="small">
                    <DiscoverFilterFormComponent
                      params={filterParams}
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
                          results.map((res) => (
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
        </DiscoverStyles>
      </Wrapper>
    </SearchStyles>
  );
}
