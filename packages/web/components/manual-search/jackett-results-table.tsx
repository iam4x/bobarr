import React from 'react';
import dayjs from 'dayjs';
import prettySize from 'prettysize';
import { truncate, pick } from 'lodash';

import { Table, Popover, Tag, notification } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { DownloadOutlined, LoadingOutlined } from '@ant-design/icons';

import {
  JackettFormattedResult,
  useDownloadMovieMutation,
  GetLibraryMoviesDocument,
  GetDownloadingDocument,
  GetMissingDocument,
} from '../../utils/graphql';

import { Media } from './manual-search.helpers';

interface JackettResultTableProps {
  results: JackettFormattedResult[];
  media: Media;
}

export function JackettResultsTable(props: JackettResultTableProps) {
  const columns: ColumnsType<JackettFormattedResult> = [
    {
      title: 'Age',
      width: 75,
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
        // eslint-disable-next-line react/prop-types
        <ManualDownloadMedia media={props.media} jackettResult={row} />
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
}: {
  media: Media;
  jackettResult: JackettFormattedResult;
}) {
  const jackettInput = pick(jackettResult, [
    'title',
    'downloadLink',
    'quality',
    'tag',
  ]);

  const [downloadMovie, { loading }] = useDownloadMovieMutation({
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
        message: 'Download movie started',
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
  };

  return loading ? (
    <LoadingOutlined />
  ) : (
    <DownloadOutlined style={{ cursor: 'pointer' }} onClick={handleClick} />
  );
}
