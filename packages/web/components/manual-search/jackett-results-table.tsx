import React from 'react';
import dayjs from 'dayjs';
import prettySize from 'prettysize';
import { truncate } from 'lodash';

import { Table, Popover, Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { DownloadOutlined } from '@ant-design/icons';

import { JackettFormattedResult } from '../../utils/graphql';

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
      defaultSortOrder: 'ascend',
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
      width: 100,
      sorter: (a, b) => a.qualityScore - b.qualityScore,
      render: (row: JackettFormattedResult) => <Tag>{row.quality}</Tag>,
    },
    {
      title: <DownloadOutlined />,
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
  return <DownloadOutlined style={{ cursor: 'pointer' }} />;
}
