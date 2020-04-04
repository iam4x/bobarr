import React from 'react';
import dayjs from 'dayjs';
import { PlusSquareOutlined, CloseSquareOutlined } from '@ant-design/icons';

import { TmdbSearchResult, EnrichedMovie } from '../../utils/graphql';

import { TMDBCardStyles } from './tmdb-card.styles';
import { useAddLibrary } from './use-add-library.hook';
import { useRemoveLibrary } from './use-remove-library.hook';

interface TMDBCardComponentProps {
  type: 'tvshow' | 'movie';
  result: TmdbSearchResult | EnrichedMovie;
  inLibrary?: boolean;
}

export function TMDBCardComponent(props: TMDBCardComponentProps) {
  const { result, type, inLibrary } = props;

  const handleAddLibrary = useAddLibrary({ result, type });
  const handleRemoveLibrary = useRemoveLibrary({ result, type });

  return (
    <TMDBCardStyles
      posterPath={`https://image.tmdb.org/t/p/w220_and_h330_face${result.posterPath}`}
      vote={result.voteAverage * 10}
    >
      <div
        className="poster--container"
        onClick={inLibrary ? handleRemoveLibrary : handleAddLibrary}
      >
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
