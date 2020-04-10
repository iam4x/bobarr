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
                    <ResultsCarousel
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
                    <ResultsCarousel
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
        <ResetCarouselSlideAndGoBack watch={results} />
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
        {results.length > 5 && (
          <ButtonNext className="arrow-right">
            <FaChevronCircleRight size={16} />
          </ButtonNext>
        )}
      </CarouselProvider>
    </div>
  );
}

function ResetCarouselSlideAndGoBack({ watch }: { watch: any }) {
  const carouselContext = useContext(CarouselContext);
  const [currentSlide, setCurrentSlide] = useState(
    carouselContext.state.currentSlide
  );

  useEffect(() => {
    function onChange() {
      setCurrentSlide(carouselContext.state.currentSlide);
    }
    carouselContext.subscribe(onChange);
    return () => carouselContext.unsubscribe(onChange);
  }, [carouselContext]);

  useEffect(() => {
    if (carouselContext.state.currentSlide !== 0) {
      carouselContext.setStoreState({ currentSlide: 0 });
    }
  }, [carouselContext, watch]);

  if (currentSlide === 0) {
    return <noscript />;
  }

  return (
    <ButtonBack className="arrow-left">
      <FaChevronCircleLeft size={16} />
    </ButtonBack>
  );
}
