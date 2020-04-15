import React, { useContext, useState, useEffect } from 'react';
import { useTheme } from 'styled-components';
import { FaChevronCircleRight, FaChevronCircleLeft } from 'react-icons/fa';

import {
  CarouselProvider,
  Slide,
  Slider,
  ButtonNext,
  CarouselContext,
  ButtonBack,
} from 'pure-react-carousel';

import {
  TmdbSearchResult,
  useGetLibraryMoviesQuery,
  useGetLibraryTvShowsQuery,
} from '../../utils/graphql';

import { TMDBCardComponent } from '../tmdb-card/tmdb-card.component';

export function CarouselComponent({
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
