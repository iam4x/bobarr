import React from 'react';
import dayjs from 'dayjs';
import prettySize from 'prettysize';
import { truncate, pick } from 'lodash';
import { PureQueryOptions } from 'apollo-client';

import { Table, Popover, Tag, notification } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { DownloadOutlined, LoadingOutlined } from '@ant-design/icons';

import {
  JackettFormattedResult,
  useDownloadMovieMutation,
  GetLibraryMoviesDocument,
  GetDownloadingDocument,
  GetMissingDocument,
  useDownloadTvEpisodeMutation,
  GetLibraryTvShowsDocument,
} from '../../utils/graphql';

import { Media } from './manual-search.helpers';

interface JackettResultTableProps {
  refetchQueries?: PureQueryOptions[];
  results: JackettFormattedResult[];
  media: Media;
}

export function JackettResultsTable(props: JackettResultTableProps) {
  const columns: ColumnsType<JackettFormattedResult> = [
    {
      title: 'Age',
      width: 75,
      sorter: (a, b) =>
        Number(dayjs(a.publishDate).toDate()) -
        Number(dayjs(b.publishDate).toDate()),
      render: (row: JackettFormattedResult) => {
        const diff = Math.abs(dayjs(row.publishDate).diff(new Date(), 'day'));
        return `${diff} days`;
      },
    },
    {
      title: 'Name',
      render: (row: JackettFormattedResult) =>
        truncate(row.title, { length: 70 }),
    },
    {
      title: 'Size',
      width: 80,
      sorter: (a, b) => a.size - b.size,
      render: (row: JackettFormattedResult) => prettySize(row.size),
    },
    {
      title: 'Peers',
      width: 100,
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.seeders - b.seeders,
      render: (row: JackettFormattedResult) => (
        <Popover content={`${row.seeders} seeders, ${row.peers} leechers`}>
          <Tag color={row.seeders > row.peers ? 'green' : 'orange'}>
            {row.seeders} / {row.peers}
          </Tag>
        </Popover>
      ),
    },
    {
      title: 'Quality',
      width: 80,
      sorter: (a, b) => a.qualityScore - b.qualityScore,
      render: (row: JackettFormattedResult) => <Tag>{row.quality}</Tag>,
    },
    {
      title: <DownloadOutlined />,
      width: 35,
      render: (row: JackettFormattedResult) => (
        <ManualDownloadMedia
          jackettResult={row}
          // eslint-disable-next-line react/prop-types
          media={props.media}
          // eslint-disable-next-line react/prop-types
          refetchQueries={props.refetchQueries || []}
        />
      ),
    },
  ];

  return (
    <Table<JackettFormattedResult>
      rowKey="id"
      size="small"
      dataSource={props.results}
      columns={columns}
    />
  );
}

function ManualDownloadMedia({
  media,
  jackettResult,
  refetchQueries,
}: {
  media: Media;
  jackettResult: JackettFormattedResult;
  refetchQueries: PureQueryOptions[];
}) {
  const jackettInput = pick(jackettResult, [
    'title',
    'downloadLink',
    'quality',
    'tag',
  ]);

  const [downloadMovie, { loading: loading1 }] = useDownloadMovieMutation({
    awaitRefetchQueries: true,
    refetchQueries: [
      { query: GetLibraryMoviesDocument },
      { query: GetDownloadingDocument },
      { query: GetMissingDocument },
      ...refetchQueries,
    ],
    onError: ({ message }) =>
      notification.error({
        message: message.replace('GraphQL error: ', ''),
        placement: 'bottomRight',
      }),
    onCompleted: () =>
      notification.success({
        message: 'Download movie started',
        placement: 'bottomRight',
      }),
  });

  const [
    downloadTVEpisode,
    { loading: loading2 },
  ] = useDownloadTvEpisodeMutation({
    awaitRefetchQueries: true,
    refetchQueries: [
      { query: GetLibraryTvShowsDocument },
      { query: GetDownloadingDocument },
      { query: GetMissingDocument },
      ...refetchQueries,
    ],
    onError: ({ message }) =>
      notification.error({
        message: message.replace('GraphQL error: ', ''),
        placement: 'bottomRight',
      }),
    onCompleted: () =>
      notification.success({
        message: 'Download episode started',
        placement: 'bottomRight',
      }),
  });

  const handleClick = () => {
    if (media.__typename === 'EnrichedMovie') {
      downloadMovie({
        variables: {
          movieId: media.id!,
          jackettResult: jackettInput,
        },
      });
    }

    if (media.__typename === 'EnrichedTVEpisode') {
      downloadTVEpisode({
        variables: {
          episodeId: media.id!,
          jackettResult: jackettInput,
        },
      });
    }
  };

  return loading1 || loading2 ? (
    <LoadingOutlined />
  ) : (
    <DownloadOutlined style={{ cursor: 'pointer' }} onClick={handleClick} />
  );
}
