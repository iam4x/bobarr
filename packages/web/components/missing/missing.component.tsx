import React from 'react';
import dayjs from 'dayjs';
import { Tag } from 'antd';
import { orderBy } from 'lodash';
import { useRouter } from 'next/router';

import { formatNumber } from '../../utils/format-number';

import {
  useGetMissingQuery,
  EnrichedMovie,
  EnrichedTvEpisode,
} from '../../utils/graphql';

import { MissingComponentStyles } from './missing.styles';

export function MissingComponent() {
  const { pathname } = useRouter();
  const { data } = useGetMissingQuery();

  const isMovies = pathname.includes('movies');
  const rows: Array<Partial<EnrichedMovie> | Partial<EnrichedTvEpisode>> =
    (isMovies ? data?.movies : data?.tvEpisodes) || [];

  if (rows.length > 0) {
    const withDate = orderBy(
      rows.map((row) => ({ ...row, date: dayjs(row.releaseDate) })),
      ['date'],
      ['asc']
    );

    return (
      <MissingComponentStyles>
        <div className="wrapper">
          {withDate.map((row) => (
            <div key={row.id} className="row">
              {/* missing movie */}
              {row.__typename === 'EnrichedMovie' && (
                <div>
                  <span className="title">{row.title}</span>
                  <span className="date">({row.date.format('YYYY')})</span>
                </div>
              )}

              {/* missing tv episode */}
              {row.__typename === 'EnrichedTVEpisode' && (
                <div>
                  <span className="title">{row.tvShow?.title}</span>
                  <span className="episode-number">
                    S{formatNumber(row.seasonNumber!)}E
                    {formatNumber(row.episodeNumber!)}
                  </span>
                </div>
              )}

              <Tag>
                {row.date.isAfter(new Date()) ? `not aired yet` : 'missing'}
              </Tag>
            </div>
          ))}
        </div>
      </MissingComponentStyles>
    );
  }

  return <noscript />;
}
