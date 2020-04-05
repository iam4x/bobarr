import React, { useState } from 'react';
import dayjs from 'dayjs';
import { PlusSquareOutlined, CloseSquareOutlined } from '@ant-design/icons';

import { TmdbSearchResult, EnrichedMovie } from '../../utils/graphql';

import { TMDBCardStyles } from './tmdb-card.styles';
import { useAddLibrary } from './use-add-library.hook';
import { useRemoveLibrary } from './use-remove-library.hook';
import { TVShowSeasonsModalComponent } from '../tvshow-seasons-modal/tvshow-seasons-modal.component';

interface TMDBCardComponentProps {
  type: 'tvshow' | 'movie';
  result: TmdbSearchResult | EnrichedMovie;
  inLibrary?: boolean;
}

export function TMDBCardComponent(props: TMDBCardComponentProps) {
  const { result, type, inLibrary } = props;
  const [tvSeasonModalActive, setTVSeasonModalActive] = useState(
    result.tmdbId === 1399
  );

  const handleMovieAddLibrary = useAddLibrary({ result, type });
  const handleMovieRemoveLibrary = useRemoveLibrary({ result, type });

  const movieHandler = inLibrary
    ? handleMovieRemoveLibrary
    : handleMovieAddLibrary;

  const onPosterClickHandler =
    type === 'movie' ? movieHandler : () => setTVSeasonModalActive(true);

  return (
    <TMDBCardStyles
      posterPath={`https://image.tmdb.org/t/p/w220_and_h330_face${result.posterPath}`}
      vote={result.voteAverage * 10}
    >
      {/* display season picker modal when it's tvshow */}
      {type === 'tvshow' && (
        <TVShowSeasonsModalComponent
          tvShow={result as TmdbSearchResult}
          visible={tvSeasonModalActive}
          onRequestClose={() => setTVSeasonModalActive(false)}
        />
      )}

      <div className="poster--container" onClick={onPosterClickHandler}>
        <div className="poster" />
        <div className="overlay">
          {inLibrary ? (
            <>
              <CloseSquareOutlined />
              <div className="action-label">remove from library</div>
            </>
          ) : (
            <>
              <PlusSquareOutlined />
              <div className="action-label">add to library</div>
            </>
          )}
        </div>
      </div>

      <div className="vote--container">
        <div className="vote" />
        <div className="percent">{result.voteAverage * 10}%</div>
      </div>

      <div className="name">{result.title}</div>
      {result.releaseDate && (
        <div className="date">
          {dayjs(result.releaseDate).format('DD MMM YYYY')}
        </div>
      )}
    </TMDBCardStyles>
  );
}
