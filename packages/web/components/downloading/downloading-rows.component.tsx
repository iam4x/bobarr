import React from 'react';
import prettySize from 'prettysize';
import { add, reduce, map } from 'lodash';
import { Tag, Progress } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import {
  DownloadingMedia,
  useGetTorrentStatusQuery,
  FileType,
  TorrentStatus,
} from '../../utils/graphql';

interface DownloadingRow extends DownloadingMedia {
  torrentStatus: TorrentStatus[];
}

export function DownloadingRowsComponent({
  rows,
}: {
  rows: DownloadingMedia[];
}) {
  const { data } = useGetTorrentStatusQuery({
    variables: {
      torrents: rows.map(({ resourceId, resourceType }) => ({
        resourceId,
        resourceType,
      })),
    },
  });

  const displayedRows = rows
    // add torrent status to rows
    .map((row) => {
      const match = data?.torrents.find(
        ({ resourceId }) => row.resourceId === resourceId
      );
      return { ...row, torrentStatus: match ? [match] : [] };
    })
    // regroup episodes of same tv episodes
    // and merge their status in an array
    .reduce((results: DownloadingRow[], curr) => {
      const isStopped =
        typeof curr.torrentStatus[0]?.status === 'number' &&
        curr.torrentStatus[0]?.status === 0;

      if (curr.resourceType === FileType.Episode && !isStopped) {
        const match = results.find((row) =>
          row.title
            .toUpperCase()
            .includes(curr.title.toUpperCase().replace(/ - EPISODE.+/, ''))
        );

        if (match) {
          const [, episode] =
            /EPISODE (\d+)/.exec(curr.title.toUpperCase()) || [];

          return results.map((row) =>
            row.id === match.id
              ? {
                  ...row,
                  torrentStatus: [...row.torrentStatus, ...curr.torrentStatus],
                  title: `${match.title}, ${episode}`,
                }
              : row
          );
        }
      }
      return [...results, curr];
    }, [])
    // compute displayed data on the component
    // from multiple torrent statuses
    .map((row) => {
      const totalPercent =
        reduce(map(row.torrentStatus, 'percentDone'), add, 0) /
        row.torrentStatus.length;

      const percent = Math.round(totalPercent * 10000) / 100;
      const downloadSpeed = reduce(
        map(row.torrentStatus, 'rateDownload'),
        add,
        0
      );

      const isStopped =
        typeof row.torrentStatus[0]?.status === 'number' &&
        row.torrentStatus[0]?.status === 0;

      return {
        ...row,
        torrentStatus: { percent, downloadSpeed, isStopped },
      };
    });

  return (
    <div className="wrapper">
      {displayedRows.map((row) => (
        <div key={row.id} className="download-row">
          <div className="status">
            {row.torrentStatus.isStopped ? (
              <Tag color="orange">Download paused</Tag>
            ) : (
              <Tag color="blue">
                Downloading <LoadingOutlined style={{ marginLeft: 10 }} />
              </Tag>
            )}
          </div>
          <div className="name">{row.title}</div>
          {/* <div className="torrent-name">({media.torrent})</div> */}
          <div className="speed">
            ({row.torrentStatus.percent}%
            {row.torrentStatus.downloadSpeed ? (
              <> - {prettySize(row.torrentStatus.downloadSpeed)}/s</>
            ) : null}
            )
          </div>
          <div className="progress">
            <Progress
              size="small"
              percent={row.torrentStatus.percent}
              status={row.torrentStatus.isStopped ? 'exception' : 'active'}
              showInfo={false}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
