import React from 'react';
import dayjs from 'dayjs';
import { Modal } from 'antd';
import { FaPlay } from 'react-icons/fa';

import { TmdbSearchResult } from '../../utils/graphql';
import { getImageURL } from '../../utils/get-cached-image-url';

import { MovieDetailsStyles } from './movie-details.styles';
import { RatingComponent } from '../rating/rating.component';

interface MovieDetailsProps {
  movie: TmdbSearchResult;
  visible: boolean;
  inLibrary?: boolean;
  onRequestClose: () => void;
}

export function MovieDetailsComponent(props: MovieDetailsProps) {
  const { movie, visible, onRequestClose } = props;

  return (
    <Modal
      centered={true}
      closable={false}
      destroyOnClose={true}
      visible={visible}
      onCancel={onRequestClose}
      footer={null}
      width="80vw"
      style={{ maxWidth: 1280 }}
    >
      <MovieDetailsStyles>
        <div className="header-container">
          <div className="header-background-overlay" />
          <div
            className="header-background"
            style={{
              backgroundImage: `url(${getImageURL(
                `w1920_and_h800_multi_faces${movie.posterPath}`
              )})`,
            }}
          />
          <div className="header-content">
            <div className="poster-container">
              <img
                src={getImageURL(`w300_and_h450_bestv2${movie.posterPath}`)}
                className="poster-image"
              />
            </div>
            <div className="movie-details">
              <div className="title">
                {movie.title}
                {movie.releaseDate && (
                  <span className="year">
                    ({dayjs(movie.releaseDate).format('YYYY')})
                  </span>
                )}
              </div>
              <div className="informations-row">
                <RatingComponent rating={movie.voteAverage * 10} />
                <div className="play-trailer">
                  <FaPlay />
                  <div>Play trailer</div>
                </div>
              </div>
              <div className="overview">{movie.overview}</div>
            </div>
          </div>
        </div>
      </MovieDetailsStyles>
    </Modal>
  );
}
