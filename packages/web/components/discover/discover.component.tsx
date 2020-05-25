import React, { useEffect, useState, useCallback } from 'react';
import { SearchStyles, Wrapper } from '../search/search.styles';
import { Card, Skeleton, Empty, Pagination, Badge } from 'antd';
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
  const { data: defaultUserParams } = useGetParamsQuery();
  const [filterParams, setFilterParams] = useState<GetDiscoverQueryVariables>({
    originLanguage: defaultUserParams?.params.language,
    score: 70,
    entertainment: Entertainment.Movie,
  });

  const { data: moviesLibrary } = useGetLibraryMoviesQuery();
  const { data: tvShowsLibrary } = useGetLibraryMoviesQuery();

  const tmdbIds =
    filterParams.entertainment === Entertainment.Movie
      ? moviesLibrary?.movies?.map(({ tmdbId }) => tmdbId) || []
      : tvShowsLibrary?.movies?.map(({ tmdbId }) => tmdbId) || [];

  const TMDBResults = data?.TMDBResults;
  const hasNoSearchResults = TMDBResults?.totalResults === 0;

  const onFinish = (formParams: GetDiscoverQueryVariables) => {
    const { primaryReleaseYear, ...rest } = formParams;
    setFilterParams({
      ...(primaryReleaseYear && {
        primaryReleaseYear: dayjs(primaryReleaseYear).format('YYYY'),
      }),
      ...rest,
    });
  };

  useEffect(() => {
    discover({
      variables: filterParams,
    });
  }, [filterParams, discover]);

  const onPagination = useCallback(
    (page: number) =>
      discover({
        variables: { ...filterParams, page },
      }),
    [filterParams, discover]
  );

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
              <Badge
                count={TMDBResults?.totalResults}
                overflowCount={9999}
                style={{ marginLeft: 15 }}
              />
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
                  <Card
                    size="small"
                    style={{
                      minHeight: '794px',
                      maxHeight: '794px',
                      overflowY: 'scroll',
                    }}
                  >
                    <Skeleton active={true} loading={!data || loading}>
                      {data && hasNoSearchResults && (
                        <Empty description="No results... 😔" />
                      )}
                      <div className="discover--result-cards-container">
                        {!hasNoSearchResults &&
                          TMDBResults?.results
                            ?.filter((item) => !tmdbIds.includes(item.tmdbId))
                            ?.map((res) => (
                              <TMDBCardComponent
                                key={res.id}
                                type={Entertainment.Movie ? 'movie' : 'tvshow'}
                                result={res}
                              />
                            ))}
                      </div>
                    </Skeleton>
                  </Card>
                  <Pagination
                    defaultCurrent={6}
                    total={TMDBResults?.totalResults}
                    onChange={onPagination}
                    showSizeChanger={false}
                    pageSize={20}
                    hideOnSinglePage
                    className="discover--pagination"
                  />
                </div>
              </div>
            </div>
          </div>
        </DiscoverStyles>
      </Wrapper>
    </SearchStyles>
  );
}
