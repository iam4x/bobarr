import React from 'react';
import prettySize from 'prettysize';

import { useGetMovieFileDetailsQuery } from '../../utils/graphql';

export function MovieFileDetailsComponent({ tmdbId }: { tmdbId: number }) {
  const { data } = useGetMovieFileDetailsQuery({ variables: { tmdbId } });
  return (
    <ul className="file-details">
      <li>
        <strong>Library path:</strong>
        <em>{data?.details?.libraryPath}</em>
      </li>
      {data?.details?.torrentFileName && (
        <>
          <li>
            <strong>Torrent name:</strong>
            <em>{data?.details?.torrentFileName}</em>
          </li>
          <li>
            <strong>Torrent size:</strong>
            <em>{prettySize(data?.details?.libraryFileSize)}</em>
          </li>
        </>
      )}
    </ul>
  );
}
