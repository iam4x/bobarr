import React from 'react';
import { Modal, notification } from 'antd';

import {
  TmdbSearchResult,
  EnrichedMovie,
  GetLibraryMoviesDocument,
  useRemoveMovieMutation,
  GetDownloadingDocument,
  GetMissingDocument,
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
      { query: GetMissingDocument },
    ],
    onError: ({ message }) =>
      notification.error({
        message: message.replace('GraphQL error: ', ''),
        placement: 'bottomRight',
      }),
    onCompleted: () =>
      notification.success({
        message: 'Movie removed from library',
        placement: 'bottomRight',
      }),
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
