import React from 'react';
import { Calendar, Tag, Skeleton } from 'antd';

import { useGetCalendarQuery } from '../../utils/graphql';
import { formatNumber } from '../../utils/format-number';

import { CalendarStyles } from './calendar.styles';

export function CalendarComponent() {
  const { data, loading } = useGetCalendarQuery();

  return (
    <CalendarStyles>
      <div className="wrapper">
        <Skeleton active={true} loading={loading}>
          <Calendar
            dateCellRender={(date) => {
              const formattedDate = date.format('YYYY-MM-DD');

              const movies =
                data?.calendar?.movies?.filter(
                  (movie) => formattedDate === movie.releaseDate
                ) || [];

              const tvEpisodes =
                data?.calendar?.tvEpisodes.filter(
                  (tvEpisode) => formattedDate === tvEpisode.releaseDate
                ) || [];

              return (
                <div>
                  {[...movies, ...tvEpisodes].map((media) => (
                    <Tag
                      key={(media.__typename || '') + media.id}
                      style={{ fontSize: '0.75em' }}
                    >
                      {media.__typename === 'EnrichedMovie' && media.title}
                      {media.__typename === 'EnrichedTVEpisode' &&
                        `${media.tvShow.title} - S${formatNumber(
                          media.seasonNumber
                        )}E${formatNumber(media.episodeNumber)}`}
                    </Tag>
                  ))}
                </div>
              );
            }}
          />
        </Skeleton>
      </div>
    </CalendarStyles>
  );
}
