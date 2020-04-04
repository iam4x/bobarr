import React from 'react';
import dayjs from 'dayjs';
import { Modal } from 'antd';

import { useTrackMovieMutation } from '../../utils/graphql';
import { SearchResultCardStyles } from './search-result-card.styles';

interface SearchResultCardProps {
  id: number;
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
  const [trackMovie] = useTrackMovieMutation();
  const isMovie = typeof props.title !== undefined;

  const title = props.title! || props.name!;
  const date = props.release_date! || props.first_air_date!;

  const handleClick = () =>
    Modal.confirm({
      title: <strong>{title}</strong>,
      content: `Add and download to your library ?`,
      okText: 'Yes',
      cancelText: 'No',
      onOk: () => {
        if (isMovie) {
          return trackMovie({ variables: { title, tmdbId: props.id } });
        }
        return Promise.resolve();
      },
    });

  return (
    <SearchResultCardStyles
      posterPath={`https://image.tmdb.org/t/p/w220_and_h330_face${props.poster_path}`}
      vote={props.vote_average * 10}
    >
      <div className="poster" onClick={handleClick} />
      <div className="vote--container">
        <div className="vote" />
        <div className="percent">{props.vote_average * 10}%</div>
      </div>
      <div className="name">{title}</div>
      <div className="date">{dayjs(date).format('DD MMM YYYY')}</div>
    </SearchResultCardStyles>
  );
}
