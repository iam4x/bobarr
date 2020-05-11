import React from 'react';
import {
  useOmdbSearchQuery,
  TmdbSearchResult,
  EnrichedMovie,
} from '../../utils/graphql';
import { RatingDetailsStyles } from './rating-details.styles';
export const RatingDetailComponent = ({
  movie,
}: {
  movie: TmdbSearchResult | EnrichedMovie;
}) => {
  const { data } = useOmdbSearchQuery({
    variables: { title: movie.title },
  });

  const ratings = data?.result.ratings;

  const allRatings = {
    TMDB: `${movie.voteAverage * 10}%`,
    IMDB: ratings?.IMDB,
    rottenTomatoes: ratings?.rottenTomatoes,
    metaCritic: ratings?.metaCritic,
  };

  return (
    <RatingDetailsStyles>
      {Object.entries(allRatings)?.map(([key, value]) => {
        const rate = value?.split(/(?=[%, /])/);

        if (!rate) return null;

        return (
          <li>
            <img src={`/assets/rating/${key}.png`} />
            <span className="rating-details--rate">{rate?.[0]}</span>
            <span className="rating-details--rate-suffix">{rate?.[1]}</span>
          </li>
        );
      })}
    </RatingDetailsStyles>
  );
};
