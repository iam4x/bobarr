import React, { useState } from 'react';
import { FolderOpenOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import {
  TmdbSearchResult,
  EnrichedMovie,
  EnrichedTvShow,
} from '../../utils/graphql';

import { getImageURL } from '../../utils/get-cached-image-url';

import { TVShowSeasonsModalComponent } from '../tvshow-details/tvshow-details.component';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';
import { RatingComponent } from '../rating/rating.component';

import { TMDBCardStyles } from './tmdb-card.styles';

interface TMDBCardComponentProps {
  type: 'tvshow' | 'movie';
  result: TmdbSearchResult | EnrichedMovie | EnrichedTvShow;
  inLibrary?: boolean;
}

export function TMDBCardComponent(props: TMDBCardComponentProps) {
  const { result, type, inLibrary } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <TMDBCardStyles>
      {/* display season picker modal when it's tvshow */}
      {type === 'tvshow' && isModalOpen && (
        <TVShowSeasonsModalComponent
          tvShow={result as TmdbSearchResult}
          visible={isModalOpen}
          inLibrary={inLibrary}
          onRequestClose={() => setIsModalOpen(false)}
        />
      )}

      {/* display movie details */}
      {type === 'movie' && isModalOpen && (
        <MovieDetailsComponent
          movie={result as TmdbSearchResult}
          visible={isModalOpen}
          inLibrary={inLibrary}
          onRequestClose={() => setIsModalOpen(false)}
        />
      )}

      <div className="poster--container" onClick={() => setIsModalOpen(true)}>
        <div
          className="poster"
          style={{
            backgroundImage: `url(${getImageURL(
              `w220_and_h330_face${result.posterPath})`
            )}`,
          }}
        />
        <div className="overlay">
          <>
            <FolderOpenOutlined />
            <div className="action-label">See details</div>
          </>
        </div>
      </div>

      <RatingComponent rating={result.voteAverage * 10} />

      <div className="name">{result.title}</div>
      {result.releaseDate && (
        <div className="date">
          {dayjs(result.releaseDate).format('DD MMM YYYY')}
        </div>
      )}
    </TMDBCardStyles>
  );
}
