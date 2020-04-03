import React, { useState } from 'react';
import useAsyncEffect from 'use-async-effect';

import {
  FaSearch,
  FaChevronCircleLeft,
  FaChevronCircleRight,
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
  const [searchQuery, setSearchQuery] = useState('fight club');
  const [popularMovies, setPopularMovies] = useState<any[]>([]);
  const [popularTVShows, setPopularTVShows] = useState<any[]>([]);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  useAsyncEffect(async () => {
    await Promise.all([
      tmdb.popularMovies().then(({ data }) => setPopularMovies(data.results)),
      tmdb.popularTVShows().then(({ data }) => setPopularTVShows(data.results)),
    ]);
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
                <FaSearch style={{ marginRight: 8 }} /> Search
              </button>
            </div>
          </form>
        </Wrapper>
      </div>

      <Wrapper>
        <div className="search-results--container">
          <div className="search-results--category">Popular Movies</div>
          <ResultsCarousel results={popularMovies} />

          <div className="spacer" />

          <div className="search-results--category">Popular TV Shows</div>
          <ResultsCarousel results={popularTVShows} />
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
