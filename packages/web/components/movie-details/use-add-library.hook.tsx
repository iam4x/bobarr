import React from 'react';
import { Modal, notification } from 'antd';

import {
  useTrackMovieMutation,
  TmdbSearchResult,
  GetLibraryMoviesDocument,
  GetDownloadingDocument,
  GetMissingDocument,
  EnrichedMovie,
} from '../../utils/graphql';

export function useAddLibrary({
  result,
}: {
  result: TmdbSearchResult | EnrichedMovie;
}) {
  const [trackMovie] = useTrackMovieMutation({
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
        message: 'Movie sent to download',
        placement: 'bottomRight',
      }),
  });

  const handleClick = () =>
    Modal.confirm({
      title: <strong>{result.title}</strong>,
      content: `Search torrent and start download ?`,
      centered: true,
      okText: 'Yes',
      cancelText: 'No',
      onOk: () =>
        trackMovie({
          variables: { title: result.title, tmdbId: result.tmdbId },
        }),
    });

  return handleClick;
}
