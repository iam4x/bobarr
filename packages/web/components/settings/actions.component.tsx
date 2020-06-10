import React from 'react';
import { Button, Card, notification, Modal, Checkbox, Alert } from 'antd';

import {
  useStartScanLibraryMutation,
  useStartFindNewEpisodesMutation,
  useStartDownloadMissingMutation,
  useResetLibraryMutation,
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

  const [resetLibrary] = useResetLibraryMutation({
    onCompleted: () => {
      Modal.info({
        title: 'Reset succesfull!',
        content: 'The page will now reload',
        onOk: () => window.location.reload(),
      });
    },
  });

  function handleResetClick() {
    const mutableState = { deleteFiles: false, resetSettings: false };
    Modal.confirm({
      title: '⚠️ Warning',
      content: (
        <>
          <Alert
            type="warning"
            message="This will remove everything from bobarr database and it will re-scan your library folder."
            style={{ marginBottom: 24 }}
          />
          <div>
            <Checkbox
              onChange={({ target: { checked } }) =>
                (mutableState.deleteFiles = checked)
              }
            >
              Delete files downloaded from disk with bobarr (permanent)
            </Checkbox>
          </div>
          <div>
            <Checkbox
              onChange={({ target: { checked } }) =>
                (mutableState.resetSettings = checked)
              }
            >
              Reset settings
            </Checkbox>
          </div>
        </>
      ),
      onOk: () => resetLibrary({ variables: mutableState }),
      width: 480,
    });
  }

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
      <Button size="large" type="danger" onClick={handleResetClick}>
        Reset bobarr
      </Button>
    </Card>
  );
}
