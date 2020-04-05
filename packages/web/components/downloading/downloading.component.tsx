import React from 'react';
import styled from 'styled-components';
import prettySize from 'prettysize';
import { Progress, Tag } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import { EnrichedMovie, useGetTorrentStatusQuery } from '../../utils/graphql';

const DownloadingComponentStyles = styled.div`
  background: #a7dbd8;
  padding-top: 64px;
  padding-bottom: 64px;

  .wrapper {
    margin: 0 auto;
    max-width: 1200px;
  }

  .download-row {
    background: #fff;
    border-radius: 4px;
    align-items: center;
    padding: 5px 8px;
    font-size: 0.8em;
    margin-bottom: 8px;
    display: flex;
    width: 100%;

    &:last-child {
      margin-bottom: 0;
    }

    .speed {
      font-size: 0.7em;
      margin-left: auto;
      margin-right: 12px;
    }

    .progress {
      width: 400px;
    }

    .name {
      text-transform: uppercase;
      font-weight: 600;
    }
  }
`;

export function DownloadingComponent({ data }: { data: EnrichedMovie[] }) {
  if (data.length > 0) {
    return (
      <DownloadingComponentStyles>
        <div className="wrapper">
          {data.map((row) => (
            <DownloadRow key={row.id} {...row} />
          ))}
        </div>
      </DownloadingComponentStyles>
    );
  }

  return <noscript />;
}

function DownloadRow(props: EnrichedMovie) {
  const { data } = useGetTorrentStatusQuery({
    pollInterval: 1000,
    variables: { resourceId: props.id, resourceType: 'movie' },
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
