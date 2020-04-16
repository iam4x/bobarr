import React from 'react';
import prettySize from 'prettysize';
import { Progress, Tag } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import {
  DownloadingMedia,
  useGetTorrentStatusQuery,
  useGetDownloadingQuery,
  SearchingMedia,
} from '../../utils/graphql';

import { DownloadingComponentStyles } from './downloading.styles';

export function DownloadingComponent({ types }: { types: string[] }) {
  const { data } = useGetDownloadingQuery({
    fetchPolicy: 'cache-and-network',
    pollInterval: 2500,
  });

  const searching = data?.searching?.filter((row) =>
    types.includes(row.resourceType.toLowerCase())
  );

  const downloading = data?.downloading?.filter((row) =>
    types.includes(row.resourceType.toLowerCase())
  );

  return (
    <DownloadingComponentStyles>
      <div className="wrapper">
        {searching?.map((row) => (
          <SearchingRow key={row.id} media={row} />
        ))}
        {downloading?.map((row) => (
          <DownloadRow key={row.id} media={row} />
        ))}
      </div>
    </DownloadingComponentStyles>
  );
}

function SearchingRow({ media }: { media: SearchingMedia }) {
  return (
    <div className="download-row">
      <div className="status">
        <Tag color="purple">
          Searching <LoadingOutlined style={{ marginLeft: 10 }} />
        </Tag>
      </div>
      <div className="name">{media.title}</div>
    </div>
  );
}

function DownloadRow({ media }: { media: DownloadingMedia }) {
  const { data } = useGetTorrentStatusQuery({
    pollInterval: 5000,
    variables: {
      resourceId: media.resourceId,
      resourceType: media.resourceType,
    },
  });

  const downloadSpeed = data?.torrent?.rateDownload || null;
  const percent = data?.torrent?.percentDone
    ? Math.round(data?.torrent?.percentDone * 10000) / 100
    : 0;

  const isStopped =
    typeof data?.torrent?.status === 'number' && data?.torrent.status === 0;

  return (
    <div className="download-row">
      <div className="status">
        {isStopped ? (
          <Tag color="orange">Download paused</Tag>
        ) : (
          <Tag color="blue">
            Downloading <LoadingOutlined style={{ marginLeft: 10 }} />
          </Tag>
        )}
      </div>
      <div className="name">{media.title}</div>
      <div className="torrent-name">({media.torrent})</div>
      <div className="speed">
        ({percent}%
        {downloadSpeed ? <> - {prettySize(downloadSpeed)}/s</> : null})
      </div>
      <div className="progress">
        <Progress
          size="small"
          percent={percent}
          status={isStopped ? 'exception' : 'active'}
          showInfo={false}
        />
      </div>
    </div>
  );
}
