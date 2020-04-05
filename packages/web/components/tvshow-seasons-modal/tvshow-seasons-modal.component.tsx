import React, { useState } from 'react';
import cx from 'classnames';
import dayjs from 'dayjs';
import { noop } from 'lodash';
import { Modal, Skeleton, Tag, Button } from 'antd';

import {
  DeleteOutlined,
  CloudDownloadOutlined,
  CloseOutlined,
} from '@ant-design/icons';

import { TmdbSearchResult } from '../../utils/graphql';

import { TVShowSeasonsModalComponentStyles } from './tvshow-seasons-modal.styles';
import { useGetSeasons } from './use-get-seasons.hook';

interface TVShowSeasonsModalComponentProps {
  visible: boolean;
  tvShow: TmdbSearchResult;
  inLibrary?: boolean;
  onRequestClose: () => void;
}

export function TVShowSeasonsModalComponent(
  props: TVShowSeasonsModalComponentProps
) {
  const { tvShow, visible, inLibrary, onRequestClose } = props;
  const [selectedSeasons, setSelectedSeasons] = useState<number[]>([]);

  const {
    seasons,
    loading,
    trackTVShow,
    mutationLoading,
    removeTVShow,
  } = useGetSeasons({
    tmdbId: tvShow.tmdbId,
  });

  const handleSeasonClick = (seasonNumber: number) => {
    setSelectedSeasons(
      selectedSeasons.includes(seasonNumber)
        ? selectedSeasons.filter((_) => _ !== seasonNumber)
        : [...selectedSeasons, seasonNumber]
    );
  };

  const handleTrack = async () => {
    await trackTVShow({
      variables: {
        tmdbId: tvShow.tmdbId,
        seasonNumbers: selectedSeasons,
      },
    });
    onRequestClose();
  };

  const footer = [
    <Button key="cancel" icon={<CloseOutlined />} onClick={onRequestClose}>
      Close
    </Button>,
  ];

  if (inLibrary) {
    footer.push(
      <Button
        key="delete"
        icon={<DeleteOutlined />}
        onClick={() =>
          Modal.confirm({
            title: 'Are you sure?',
            centered: true,
            okText: 'Yes',
            okType: 'danger',
            onOk: () => removeTVShow({ variables: { tmdbId: tvShow.tmdbId } }),
          })
        }
      >
        Delete TV Show
      </Button>
    );
  }

  footer.push(
    <Button
      key="submit"
      onClick={handleTrack}
      loading={mutationLoading}
      disabled={selectedSeasons.length === 0 || loading || mutationLoading}
      icon={<CloudDownloadOutlined />}
    >
      {selectedSeasons.length > 0
        ? `Download ${selectedSeasons.length} seasons`
        : 'Download'}
    </Button>
  );

  return (
    <Modal
      visible={visible}
      centered={true}
      onCancel={onRequestClose}
      closable={false}
      destroyOnClose={true}
      footer={footer}
      width={720}
    >
      <TVShowSeasonsModalComponentStyles>
        <Skeleton active={true} loading={loading}>
          <div className="tv-show">
            <div className="title">{tvShow.title}</div>
            <div className="status">
              {inLibrary ? (
                <Tag color="green">in library</Tag>
              ) : (
                <Tag>not in library</Tag>
              )}
            </div>
          </div>
          <div className="seasons">
            {seasons.map((season) => (
              <div
                key={season.id}
                onClick={
                  season.inLibrary
                    ? noop
                    : () => handleSeasonClick(season.seasonNumber)
                }
                className={cx('season-row', {
                  selected: selectedSeasons.includes(season.seasonNumber),
                  'in-library': season.inLibrary,
                })}
              >
                <div>
                  <div className="season-number">
                    Season {season.seasonNumber}
                  </div>
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
