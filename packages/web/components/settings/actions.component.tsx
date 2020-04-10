import React from 'react';
import { Button, Card, notification } from 'antd';

import {
  useStartScanLibraryMutation,
  useStartFindNewEpisodesMutation,
  useStartDownloadMissingMutation,
} from '../../utils/graphql';

export function ActionsComponents() {
  const [findEpisodes, { loading: loading1 }] = useStartFindNewEpisodesMutation(
    {
      onCompleted: () =>
        notification.success({
          message: 'Find new episodes job started',
          placement: 'bottomRight',
        }),
    }
  );

  const [scanLibrary, { loading: loading2 }] = useStartScanLibraryMutation({
    onCompleted: () =>
      notification.success({
        message: 'Scan library folder started',
        placement: 'bottomRight',
      }),
  });

  const [
    downloadMissing,
    { loading: loading3 },
  ] = useStartDownloadMissingMutation({
    onCompleted: () =>
      notification.success({
        message: 'Download missing files started',
        placement: 'bottomRight',
      }),
  });

  return (
    <Card title="Actions" className="actions">
      <Button
        size="large"
        type="default"
        onClick={() => scanLibrary()}
        loading={loading1 || loading2 || loading3}
      >
        Scan library folder
      </Button>
      <Button
        size="large"
        type="default"
        onClick={() => findEpisodes()}
        loading={loading1 || loading2 || loading3}
      >
        Find new episodes
      </Button>
      <Button
        size="large"
        type="default"
        onClick={() => downloadMissing()}
        loading={loading1 || loading2 || loading3}
      >
        Download missing files
      </Button>
    </Card>
  );
}
