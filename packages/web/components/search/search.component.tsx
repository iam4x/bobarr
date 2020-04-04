import React, { useState } from 'react';
import { Skeleton } from 'antd';
import useAsyncEffect from 'use-async-effect';

import {
  FaSearch,
  FaChevronCircleLeft,
  FaChevronCircleRight,
  FaCircleNotch,
} from 'react-icons/fa';

import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
} from 'pure-react-carousel';

import { tmdb } from '../../utils/tmdb-client';

import { SearchResultCardComponent } from './search-result-card.component';
import { SearchStyles, Wrapper } from './search.styles';

export function SearchComponent() {
  const [searchQuery, setSearchQuery] = useState('');

  const [popularLoading, setPopularLoading] = useState(true);
  const [popularMovies, setPopularMovies] = useState<any[]>([]);
  const [popularTVShows, setPopularTVShows] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [lastSearchQuery, setLastSearchQuery] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<{
    movies: any[];
    tvShows: any[];
  }>({ movies: [], tvShows: [] });

  const displayMovieSearchResults =
    searchQuery &&
    lastSearchQuery === searchQuery &&
    searchResults.movies.length > 0;

  const displayTVSearchResults =
    searchQuery &&
    lastSearchQuery === searchQuery &&
    searchResults.tvShows.length > 0;

  const SearchIcon = loading ? FaCircleNotch : FaSearch;
  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !loading &&
      searchQuery &&
      searchQuery.trim() &&
      lastSearchQuery !== searchQuery
    ) {
      setLoading(true);

      try {
        const results = await tmdb.search(searchQuery);
        setSearchResults(results);
        setLastSearchQuery(searchQuery);
      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    }
  };

  useAsyncEffect(async () => {
    setPopularLoading(true);
    await Promise.all([
      tmdb.popularMovies().then(({ data }) => setPopularMovies(data.results)),
      tmdb.popularTVShows().then(({ data }) => setPopularTVShows(data.results)),
    ]);
    setPopularLoading(false);
  }, []);

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
                <SearchIcon style={{ marginRight: 8 }} /> Search
              </button>
            </div>
          </form>
        </Wrapper>
      </div>

      <Wrapper>
        <div className="search-results--container">
          <Skeleton active={true} loading={popularLoading}>
            <div className="search-results--category">
              {displayMovieSearchResults ? 'Found Movies' : 'Popular Movies'}
            </div>
            <ResultsCarousel
              results={
                displayMovieSearchResults ? searchResults.movies : popularMovies
              }
            />
            <div className="spacer" />
            <div className="search-results--category">
              {displayTVSearchResults ? 'Found TV Shows' : 'Popular TV Shows'}
            </div>
            <ResultsCarousel
              results={
                displayTVSearchResults ? searchResults.tvShows : popularTVShows
              }
            />
          </Skeleton>
        </div>
      </Wrapper>
    </SearchStyles>
  );
}

function ResultsCarousel({ results }: { results: any[] }) {
  return (
    <div className="carrousel--container">
      <CarouselProvider
        naturalSlideHeight={420}
        naturalSlideWidth={220}
        totalSlides={results.length}
        visibleSlides={5}
      >
        <ButtonBack className="arrow-left">
          <FaChevronCircleLeft size={16} />
        </ButtonBack>
        <Slider>
          {results.map((result, index) => (
            <Slide key={result.id} index={index}>
              <SearchResultCardComponent key={result.id} {...result} />
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
