import React from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { Tag } from 'antd';
import { orderBy } from 'lodash';

import { formatNumber } from '../../utils/format-number';
import { useGetMissingQuery } from '../../utils/graphql';

const MissingComponentStyles = styled.div`
  background: #a7dbd8;
  padding-top: 48px;
  padding-bottom: 48px;

  .wrapper {
    max-width: 1200px;
    margin: 0 auto;
  }

  .episode-row {
    background: #fff;
    border-radius: 4px;
    align-items: center;
    padding: 5px 8px;
    font-size: 0.8em;
    margin-bottom: 8px;
    display: flex;
    width: 100%;
  }

  .tvshow-title {
    font-weight: bold;
    margin-right: 4px;
  }

  .ant-tag {
    margin-left: auto;
  }
`;

export function MissingComponent() {
  const { data } = useGetMissingQuery();

  if (data && data.tvEpisodes.length > 0) {
    const rows = orderBy(
      data.tvEpisodes.map((row) => ({ ...row, date: dayjs(row.releaseDate) })),
      ['date'],
      ['asc']
    );

    return (
      <>
        <MissingComponentStyles>
          <div className="wrapper">
            {rows.map((episode) => (
              <div key={episode.id} className="episode-row">
                <div className="title">
                  <span className="tvshow-title">{episode.tvShow.title}</span>
                  <span className="episode-number">
                    S{formatNumber(episode.seasonNumber)}E
                    {formatNumber(episode.episodeNumber)}
                  </span>
                </div>
                <Tag>
                  {episode.date.isAfter(new Date())
                    ? `not aired yet`
                    : 'missing'}
                </Tag>
              </div>
            ))}
          </div>
        </MissingComponentStyles>
      </>
    );
  }

  return <noscript />;
}
