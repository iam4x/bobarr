import React from 'react';
import { Tag } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import { SearchingMedia, FileType } from '../../utils/graphql';

export function SearchingRowsComponent({ rows }: { rows: SearchingMedia[] }) {
  const searching = rows.reduce((merged: SearchingMedia[], curr) => {
    if (curr.resourceType === FileType.Episode) {
      const match = merged.find((row) =>
        row.title
          .toUpperCase()
          .includes(curr.title.toUpperCase().replace(/ - EPISODE.+/, ''))
      );

      if (match) {
        const [, episode] =
          /EPISODE (\d+)/.exec(curr.title.toUpperCase()) || [];

        return merged.map((row) =>
          row.id === match.id
            ? { ...row, title: `${match.title}, ${episode}` }
            : row
        );
      }
    }
    return [...merged, curr];
  }, []);

  return (
    <div className="wrapper">
      {searching.map((row) => (
        <div key={row.id} className="download-row">
          <div className="status">
            <Tag color="purple">
              Searching <LoadingOutlined style={{ marginLeft: 10 }} />
            </Tag>
          </div>
          <div className="name">{row.title}</div>
        </div>
      ))}
    </div>
  );
}
