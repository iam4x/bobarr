import React from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { Modal } from 'antd';

import { TmdbSearchResult } from '../../utils/graphql';

interface MovieDetailsProps {
  movie: TmdbSearchResult;
  visible: boolean;
  inLibrary?: boolean;
  onRequestClose: () => void;
}

export const MovieDetailsStyles = styled.div`
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  max-height: 80vh;

  .header-container {
    border-radius: 4px;
    overflow: hidden;
    position: relative;
    min-height: 300px;
    width: 100%;
  }

  .header-background {
    background-size: cover;
    background-repeat: no-repeat;
    height: 100%;
    width: 100%;
  }

  .header-background-overlay {
    background-image: linear-gradient(
      to right,
      rgba(12.94%, 14.9%, 22.75%, 1) 150px,
      rgba(20.39%, 22.35%, 29.02%, 0.84) 100%
    );
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }

  .header-content {
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    padding-top: 24px;
    padding-bottom: 24px;
    padding-left: 36px;
    padding-right: 36px;
    height: 100%;
    width: 100%;
  }

  .poster-container {
    overflow: hidden;
    border-radius: 4px;
    height: auto;
    width: 200px;

    .poster-image {
      height: auto;
      width: 200px;
    }
  }

  .movie-details {
    flex: 1;
    margin-left: 36px;
    color: #fff;
  }

  .title {
    font-size: 2.2em;
    font-weight: 700;

    .year {
      font-size: 0.8em;
      font-weight: 300;
      margin-left: 4px;
    }
  }

  .overview {
    font-size: 1.2em;
  }
`;

export function MovieDetailsComponent(props: MovieDetailsProps) {
  const { movie, visible, onRequestClose } = props;

  return (
    <Modal
      centered={true}
      closable={false}
      destroyOnClose={true}
      visible={visible}
      onCancel={onRequestClose}
      width="80vw"
    >
      <MovieDetailsStyles>
        <div className="header-container">
          <div className="header-background-overlay" />
          <div
            className="header-background"
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${movie.posterPath})`,
            }}
          />
          <div className="header-content">
            <div className="poster-container">
              <img
                src={`https://image.tmdb.org/t/p/w300_and_h450_bestv2${movie.posterPath}`}
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
              <div className="overview">{movie.overview}</div>
            </div>
          </div>
        </div>
      </MovieDetailsStyles>
    </Modal>
  );
}
