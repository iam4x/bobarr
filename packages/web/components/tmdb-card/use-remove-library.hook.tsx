import React from 'react';
import { Modal } from 'antd';

import {
  TmdbSearchResult,
  EnrichedMovie,
  GetLibraryMoviesDocument,
  useRemoveMovieMutation,
  GetDownloadingDocument,
} from '../../utils/graphql';

export function useRemoveLibrary({
  type,
  result,
}: {
  type: 'movie' | 'tvshow';
  result: TmdbSearchResult | EnrichedMovie;
}) {
  const [removeMovie] = useRemoveMovieMutation({
    awaitRefetchQueries: true,
    refetchQueries: [
      { query: GetLibraryMoviesDocument },
      { query: GetDownloadingDocument },
    ],
  });

  const handleClick = () =>
    Modal.confirm({
      title: <strong>{result.title}</strong>,
      content: `Remove from library and delete files ?`,
      centered: true,
      okText: 'Yes',
      cancelText: 'No',
      onOk: () => {
        if (type === 'movie') {
          return removeMovie({ variables: { tmdbId: result.tmdbId } });
        }
        return Promise.resolve();
      },
    });

  return handleClick;
}
