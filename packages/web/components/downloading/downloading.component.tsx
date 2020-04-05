import React from 'react';
import prettySize from 'prettysize';
import { Progress, Tag } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import {
  DownloadingMedia,
  useGetTorrentStatusQuery,
  useGetDownloadingQuery,
} from '../../utils/graphql';

import { DownloadingComponentStyles } from './downloading.styles';

export function DownloadingComponent({ types }: { types: string[] }) {
  const { data } = useGetDownloadingQuery({
    fetchPolicy: 'cache-and-network',
    pollInterval: 2500,
  });

  const rows = data?.rows?.filter((row) => types.includes(row.resourceType));

  if (rows && rows.length > 0) {
    return (
      <DownloadingComponentStyles>
        <div className="wrapper">
          {rows.map((row) => (
            <DownloadRow key={row.resourceType + row.resourceId} {...row} />
          ))}
        </div>
      </DownloadingComponentStyles>
    );
  }

  return <noscript />;
}

function DownloadRow(props: DownloadingMedia) {
  const { data } = useGetTorrentStatusQuery({
    pollInterval: 5000,
    variables: {
      resourceId: props.resourceId,
      resourceType: props.resourceType,
    },
  });

  const downloadSpeed = data?.torrent?.rateDownload || null;
  const percent = data?.torrent?.percentDone
    ? Math.round(data?.torrent?.percentDone * 10000) / 100
    : 0;

  const isStopped =
    typeof data?.torrent?.status === 'number' && data?.torrent.status === 0;

  return (
    <>
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
        <div className="name">{props.title}</div>
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
    </>
  );
}
