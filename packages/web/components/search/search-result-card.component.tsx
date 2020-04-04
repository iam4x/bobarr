import React from 'react';
import dayjs from 'dayjs';
import { Modal } from 'antd';
import { PlusSquareOutlined } from '@ant-design/icons';

import { useTrackMovieMutation, TmdbSearchResult } from '../../utils/graphql';
import { SearchResultCardStyles } from './search-result-card.styles';

export function SearchResultCardComponent({
  result,
  type,
}: {
  result: TmdbSearchResult;
  type: 'tvshow' | 'movie';
}) {
  const [trackMovie] = useTrackMovieMutation();

  const handleClick = () =>
    Modal.confirm({
      title: <strong>{result.title}</strong>,
      content: `Search torrent and start download ?`,
      centered: true,
      okText: 'Yes',
      cancelText: 'No',
      onOk: () => {
        if (type === 'movie') {
          return trackMovie({
            variables: { title: result.title, tmdbId: result.id },
          });
        }
        return Promise.resolve();
      },
    });

  return (
    <SearchResultCardStyles
      posterPath={`https://image.tmdb.org/t/p/w220_and_h330_face${result.posterPath}`}
      vote={result.voteAverage * 10}
    >
      <div className="poster--container" onClick={handleClick}>
        <div className="poster" />
        <div className="overlay">
          <PlusSquareOutlined />
          <div className="action-label">add to library</div>
        </div>
      </div>

      <div className="vote--container">
        <div className="vote" />
        <div className="percent">{result.voteAverage * 10}%</div>
      </div>

      <div className="name">{result.title}</div>
      <div className="date">
        {dayjs(result.releaseDate).format('DD MMM YYYY')}
      </div>
    </SearchResultCardStyles>
  );
}
