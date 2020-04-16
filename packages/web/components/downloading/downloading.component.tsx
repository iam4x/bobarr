import React from 'react';

import { useGetDownloadingQuery } from '../../utils/graphql';

import { DownloadingComponentStyles } from './downloading.styles';
import { SearchingRowsComponent } from './searching-rows.component';
import { DownloadingRowsComponent } from './downloading-rows.component';

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
        <SearchingRowsComponent rows={searching || []} />
        {/* dont mount downloading rows when it's not needed */}
        {/* this component does request polling */}
        {downloading && downloading.length && (
          <DownloadingRowsComponent rows={downloading || []} />
        )}
      </div>
    </DownloadingComponentStyles>
  );
}
