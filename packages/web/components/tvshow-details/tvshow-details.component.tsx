import React, { useState } from 'react';
import cx from 'classnames';
import dayjs from 'dayjs';
import { noop } from 'lodash';
import { Modal } from 'antd';
import { FaRegWindowClose, FaPlay } from 'react-icons/fa';

import {
  DeleteOutlined,
  CloudDownloadOutlined,
  LoadingOutlined,
} from '@ant-design/icons';

import { TmdbSearchResult, useGetParamsQuery } from '../../utils/graphql';
import { getImageURL } from '../../utils/get-cached-image-url';

import { useGetSeasons } from './use-get-seasons.hook';
import { TVShowSeasonsModalComponentStyles } from './tvshow-details.styles';
import { RatingDetailComponent } from '../movie-details/rating-details.component';
import { TVSeasonDetailsComponent } from './tvseason-details.component';

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

  const { data } = useGetParamsQuery();

  const {
    seasons,
    loading,
    trackTVShow,
    mutationLoading,
    removeTVShow,
  } = useGetSeasons({
    tmdbId: tvShow.tmdbId,
  });

  const handleClose = () => {
    setSelectedSeasons([]);
    onRequestClose();
  };

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
    setSelectedSeasons([]);
  };

  const youtubeSearchURL = `//youtube.com/results?search_query=trailer+season+1+${tvShow.title}+${data?.params?.language}`;

  const isDownloadButtonDisabled =
    selectedSeasons.length === 0 || loading || mutationLoading;
  const isDeleteButtonDisabled = !inLibrary || loading || mutationLoading;

  return (
    <Modal
      visible={visible}
      centered={true}
      onCancel={handleClose}
      closable={false}
      destroyOnClose={true}
      footer={null}
      width="80vw"
      style={{ maxWidth: 1280 }}
      bodyStyle={{ padding: 3, borderRadius: 4 }}
    >
      <TVShowSeasonsModalComponentStyles>
        <div className="close-icon" onClick={onRequestClose}>
          <FaRegWindowClose />
        </div>
        <div className="header-container">
          <div className="header-background-overlay" />
          <div
            className="header-background"
            style={{
              backgroundImage: `url(${getImageURL(
                `w1920_and_h800_multi_faces${tvShow.posterPath}`
              )})`,
            }}
          />
          <div className="header-content">
            <div className="poster-container">
              <img
                src={getImageURL(`w300_and_h450_bestv2${tvShow.posterPath}`)}
                className="poster-image"
              />
            </div>
            <div className="movie-details">
              <div className="title">
                {tvShow.title}
                {tvShow.releaseDate && (
                  <span className="year">
                    ({dayjs(tvShow.releaseDate).format('YYYY')})
                  </span>
                )}
              </div>
              <div className="information-row">
                <RatingDetailComponent entertainment={tvShow} />
                <a
                  className="play-trailer btn"
                  href={youtubeSearchURL}
                  target="_default"
                >
                  <FaPlay />
                  <div>Watch trailer on youtube</div>
                </a>
              </div>
              <div className="overview">{tvShow.overview}</div>
              <div className="seasons-details">
                {seasons
                  .filter((season) => season.inLibrary)
                  .map((season) => (
                    <TVSeasonDetailsComponent
                      key={season.id}
                      season={season}
                      tvShowTMDBId={tvShow.tmdbId}
                      tvShowTitle={tvShow.title}
                    />
                  ))}
              </div>
              <div className="buttons">
                <div className="seasons">
                  {seasons.map((season) => (
                    <div
                      key={season.id}
                      onClick={
                        season.inLibrary
                          ? noop
                          : () => handleSeasonClick(season.seasonNumber)
                      }
                      className={cx('btn season-row', {
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
              </div>
              <div className="buttons">
                {inLibrary && (
                  <div
                    className={cx('btn', { disabled: isDeleteButtonDisabled })}
                    onClick={
                      isDeleteButtonDisabled
                        ? undefined
                        : () =>
                            Modal.confirm({
                              title: <strong>{tvShow.title}</strong>,
                              content: `Remove from library and delete files?`,
                              centered: true,
                              okText: 'Yes',
                              cancelText: 'No',
                              okType: 'danger',
                              onOk: () =>
                                removeTVShow({
                                  variables: { tmdbId: tvShow.tmdbId },
                                }),
                            })
                    }
                  >
                    <DeleteOutlined />
                    <div>Delete TV Show</div>
                  </div>
                )}
                <div
                  className={cx('btn', {
                    disabled: isDownloadButtonDisabled,
                  })}
                  onClick={isDownloadButtonDisabled ? undefined : handleTrack}
                >
                  {mutationLoading ? (
                    <LoadingOutlined />
                  ) : (
                    <CloudDownloadOutlined />
                  )}
                  <div>
                    {selectedSeasons.length > 0
                      ? `Download ${selectedSeasons.length} seasons`
                      : 'Download'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TVShowSeasonsModalComponentStyles>
    </Modal>
  );
}
