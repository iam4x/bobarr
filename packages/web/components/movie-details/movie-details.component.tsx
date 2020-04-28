import React, { useState } from 'react';
import dayjs from 'dayjs';
import { Modal } from 'antd';

import {
  FaPlay,
  FaPlus,
  FaMinus,
  FaRegWindowClose,
  FaRecycle,
} from 'react-icons/fa';

import {
  TmdbSearchResult,
  useGetParamsQuery,
  EnrichedMovie,
} from '../../utils/graphql';

import { getImageURL } from '../../utils/get-cached-image-url';

import { RatingComponent } from '../rating/rating.component';
import { ManualSearchComponent } from '../manual-search/manual-search.component';

import { useAddLibrary } from './use-add-library.hook';
import { useRemoveLibrary } from './use-remove-library.hook';

import { MovieDetailsStyles } from './movie-details.styles';

interface MovieDetailsProps {
  movie: TmdbSearchResult | EnrichedMovie;
  visible: boolean;
  inLibrary?: boolean;
  onRequestClose: () => void;
}

export function MovieDetailsComponent(props: MovieDetailsProps) {
  const { inLibrary, movie, visible, onRequestClose } = props;

  const [isSearchModalOpen, setSearchModalOpen] = useState(false);

  const { data } = useGetParamsQuery();
  const handleAdd = useAddLibrary({ result: movie });
  const handleRemove = useRemoveLibrary({ result: movie });

  const youtubeSearchURL = `//youtube.com/results?search_query=trailer+${movie.title}+${data?.params?.language}`;

  return (
    <>
      {/* display replace ssearch modal only if we are in library pages */}
      {isSearchModalOpen && movie.__typename === 'EnrichedMovie' && (
        <ManualSearchComponent
          media={movie}
          onRequestClose={() => setSearchModalOpen(false)}
        />
      )}

      <Modal
        centered={true}
        closable={false}
        destroyOnClose={true}
        visible={visible}
        onCancel={onRequestClose}
        footer={null}
        width="80vw"
        style={{ maxWidth: 1280 }}
        bodyStyle={{ padding: 3, borderRadius: 4 }}
      >
        <MovieDetailsStyles>
          <div className="close-icon" onClick={onRequestClose}>
            <FaRegWindowClose />
          </div>
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
                  <a
                    className="play-trailer btn"
                    href={youtubeSearchURL}
                    target="_default"
                  >
                    <FaPlay />
                    <div>Watch trailer on youtube</div>
                  </a>
                </div>
                <div className="overview">{movie.overview}</div>
                <div className="buttons">
                  {inLibrary ? (
                    <>
                      {movie.__typename === 'EnrichedMovie' && (
                        <div
                          className="btn"
                          onClick={() => setSearchModalOpen(true)}
                        >
                          <FaRecycle />
                          <div>Replace</div>
                        </div>
                      )}
                      <div className="btn" onClick={handleRemove}>
                        <FaMinus />
                        <div>Remove from library</div>
                      </div>
                    </>
                  ) : (
                    <div className="btn" onClick={handleAdd}>
                      <FaPlus />
                      <div>Add to library</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </MovieDetailsStyles>
      </Modal>
    </>
  );
}
