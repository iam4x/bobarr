import { orderBy } from 'lodash';
import { notification } from 'antd';

import {
  useGetTvShowSeasonsQuery,
  useTrackTvShowMutation,
  useRemoveTvShowMutation,
  GetLibraryTvShowsDocument,
  GetTvShowSeasonsDocument,
  GetDownloadingDocument,
} from '../../utils/graphql';

export function useGetSeasons({ tmdbId }: { tmdbId: number }) {
  const { data, loading } = useGetTvShowSeasonsQuery({
    variables: { tvShowTMDBId: tmdbId },
  });

  const [trackTVShow, { loading: mutationLoading }] = useTrackTvShowMutation({
    awaitRefetchQueries: true,
    refetchQueries: [
      { query: GetDownloadingDocument },
      { query: GetLibraryTvShowsDocument },
      {
        query: GetTvShowSeasonsDocument,
        variables: { tvShowTMDBId: tmdbId },
      },
    ],
    onError: ({ message }) =>
      notification.error({
        message: message.replace('GraphQL error: ', ''),
        placement: 'bottomRight',
      }),
    onCompleted: () =>
      notification.success({
        message: 'Episodes sent to download',
        placement: 'bottomRight',
      }),
  });

  const [removeTVShow] = useRemoveTvShowMutation({
    awaitRefetchQueries: true,
    refetchQueries: [
      { query: GetDownloadingDocument },
      { query: GetLibraryTvShowsDocument },
      {
        query: GetTvShowSeasonsDocument,
        variables: { tvShowTMDBId: tmdbId },
      },
    ],
    onError: ({ message }) =>
      notification.error({
        message: message.replace('GraphQL error: ', ''),
        placement: 'bottomRight',
      }),
    onCompleted: () =>
      notification.success({
        message: 'TVShow removed from library',
        placement: 'bottomRight',
      }),
  });

  const seasons = orderBy(data?.seasons, ['seasonNumber'], ['desc']).filter(
    (season) => season.seasonNumber !== 0
  );

  return { seasons, loading, trackTVShow, mutationLoading, removeTVShow };
}
