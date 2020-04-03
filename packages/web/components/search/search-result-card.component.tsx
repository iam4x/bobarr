import React from 'react';
import dayjs from 'dayjs';

import { SearchResultCardStyles } from './search-result-card.styles';

interface SearchResultCardProps {
  name?: string;
  original_name?: string;
  title?: string;
  original_title?: string;
  poster_path: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
}

export function SearchResultCardComponent(props: SearchResultCardProps) {
  return (
    <SearchResultCardStyles
      posterPath={`https://image.tmdb.org/t/p/w220_and_h330_face${props.poster_path}`}
      vote={props.vote_average * 10}
    >
      <div className="poster" />
      <div className="vote--container">
        <div className="vote" />
        <div className="percent">{props.vote_average * 10}%</div>
      </div>
      <div className="name">{props.title || props.name}</div>
      <div className="date">
        {dayjs(props.release_date || props.first_air_date).format(
          'DD MMM YYYY'
        )}
      </div>
    </SearchResultCardStyles>
  );
}
