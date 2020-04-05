import React, { useState } from 'react';
import { Modal, Skeleton, Tag } from 'antd';
import { orderBy } from 'lodash';
import cx from 'classnames';

import {
  TmdbSearchResult,
  useGetTvShowSeasonsQuery,
} from '../../utils/graphql';

import { TVShowSeasonsModalComponentStyles } from './tvshow-seasons-modal.styles';
import dayjs from 'dayjs';

interface TVShowSeasonsModalComponentProps {
  visible: boolean;
  tvShow: TmdbSearchResult;
  onRequestClose: () => void;
}

export function TVShowSeasonsModalComponent(
  props: TVShowSeasonsModalComponentProps
) {
  const { tvShow, visible, onRequestClose } = props;

  const [selectedSeasons, setSelectedSeasons] = useState<number[]>([]);
  const { data, loading } = useGetTvShowSeasonsQuery({
    variables: { tvShowTMDBId: tvShow.tmdbId },
  });

  const seasons = orderBy(data?.seasons, ['seasonNumber'], ['desc']).filter(
    (season) => season.seasonNumber !== 0
  );

  const handleSeasonClick = (seasonNumber: number) => {
    setSelectedSeasons(
      selectedSeasons.includes(seasonNumber)
        ? selectedSeasons.filter((_) => _ !== seasonNumber)
        : [...selectedSeasons, seasonNumber]
    );
  };

  return (
    <Modal
      visible={visible}
      centered={true}
      onCancel={onRequestClose}
      destroyOnClose={true}
      okText={
        selectedSeasons.length > 0
          ? `Download ${selectedSeasons.length} seasons`
          : 'Download'
      }
      okButtonProps={{ disabled: selectedSeasons.length === 0 || loading }}
      closable={false}
    >
      <TVShowSeasonsModalComponentStyles>
        <Skeleton active={true} loading={loading}>
          <div className="tv-show">
            <div className="title">{tvShow.title}</div>
            <div className="status">
              <Tag>Not in library</Tag>
            </div>
          </div>
          <div className="seasons">
            {seasons.map((season) => (
              <div
                key={season.id}
                onClick={() => handleSeasonClick(season.seasonNumber)}
                className={cx('season-row', {
                  selected: selectedSeasons.includes(season.seasonNumber),
                })}
              >
                <div>
                  <div className="season-number">{season.name}</div>
                  <div className="season-episodes-count">
                    {season.airDate && (
                      <>{dayjs(season.airDate).format('YYYY')} | </>
                    )}
                    {season.episodeCount} Episodes
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Skeleton>
      </TVShowSeasonsModalComponentStyles>
    </Modal>
  );
}
