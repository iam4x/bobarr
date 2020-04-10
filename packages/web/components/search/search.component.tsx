import React, { useState, useContext, useEffect, useRef } from 'react';
import { Skeleton, Empty } from 'antd';
import { useTheme } from 'styled-components';
import { LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import { debounce, throttle } from 'throttle-debounce';

import { FaChevronCircleLeft, FaChevronCircleRight } from 'react-icons/fa';

import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
  CarouselContext,
} from 'pure-react-carousel';

import {
  useGetPopularQuery,
  useSearchLazyQuery,
  TmdbSearchResult,
  useGetLibraryMoviesQuery,
  useGetLibraryTvShowsQuery,
} from '../../utils/graphql';

import { TMDBCardComponent } from '../tmdb-card/tmdb-card.component';
import { SearchStyles, Wrapper } from './search.styles';

export function SearchComponent() {
  const [searchQuery, setSearchQuery] = useState('');

  const popularQuery = useGetPopularQuery();
  const [search, { data, loading }] = useSearchLazyQuery();

  const { current: debouncedSearch } = useRef(debounce(500, search));
  const { current: throttledSearch } = useRef(throttle(500, search));

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
          <Skeleton active={true} loading={popularQuery.loading}>
            {searchQuery &&
            data?.results.tvShows?.length === 0 &&
            data?.results.movies?.length === 0 ? (
              <Empty description="No results... 😔" />
            ) : (
              <>
                <div className="search-results--category">
                  {searchQuery && data ? 'Found Movies' : 'Popular Movies'}
                </div>
                <ResultsCarousel
                  type="movie"
                  results={
                    searchQuery && data
                      ? data?.results?.movies || []
                      : popularQuery.data?.results?.movies || []
                  }
                />
                <div className="spacer" />
                <div className="search-results--category">
                  {searchQuery && data ? 'Found TV Shows' : 'Popular TV Shows'}
                </div>
                <ResultsCarousel
                  type="tvshow"
                  results={
                    searchQuery && data
                      ? data?.results?.tvShows || []
                      : popularQuery.data?.results?.tvShows || []
                  }
                />
              </>
            )}
          </Skeleton>
        </div>
      </Wrapper>
    </SearchStyles>
  );
}

function ResultsCarousel({
  results,
  type,
}: {
  results: TmdbSearchResult[];
  type: 'movie' | 'tvshow';
}) {
  const theme = useTheme();
  const { data: moviesLibrary } = useGetLibraryMoviesQuery();
  const { data: tvShowsLibrary } = useGetLibraryTvShowsQuery();

  const tmdbIds = [
    ...(moviesLibrary?.movies?.map(({ tmdbId }) => tmdbId) || []),
    ...(tvShowsLibrary?.tvShows?.map(({ tmdbId }) => tmdbId) || []),
  ];

  return (
    <div className="carrousel--container">
      <CarouselProvider
        naturalSlideHeight={theme.tmdbCardHeight}
        naturalSlideWidth={220}
        totalSlides={results.length}
        dragEnabled={false}
        visibleSlides={5}
        step={5}
      >
        <ResetCarouselSlide watch={results} />
        <ButtonBack className="arrow-left">
          <FaChevronCircleLeft size={16} />
        </ButtonBack>
        <Slider>
          {results.map((result, index) => (
            <Slide
              key={result.id}
              index={index}
              innerClassName="carrousel--slide"
            >
              <TMDBCardComponent
                key={result.id}
                type={type}
                result={result}
                inLibrary={tmdbIds.includes(result.tmdbId)}
              />
            </Slide>
          ))}
        </Slider>
        <ButtonNext className="arrow-right">
          <FaChevronCircleRight size={16} />
        </ButtonNext>
      </CarouselProvider>
    </div>
  );
}

function ResetCarouselSlide({ watch }: { watch: any }) {
  const carouselContext = useContext(CarouselContext);

  useEffect(() => {
    if (carouselContext.state.currentSlide !== 0) {
      carouselContext.setStoreState({ currentSlide: 0 });
    }
  }, [carouselContext, watch]);

  return <noscript />;
}
