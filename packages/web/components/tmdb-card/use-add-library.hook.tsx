import React from 'react';
import { Modal } from 'antd';

import {
  useTrackMovieMutation,
  TmdbSearchResult,
  EnrichedMovie,
  GetLibraryMoviesDocument,
} from '../../utils/graphql';

export function useAddLibrary({
  type,
  result,
}: {
  type: 'movie' | 'tvshow';
  result: TmdbSearchResult | EnrichedMovie;
}) {
  const [trackMovie] = useTrackMovieMutation({
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GetLibraryMoviesDocument }],
  });

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

  return handleClick;
}
