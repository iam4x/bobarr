import React, { useState, useEffect, useRef } from 'react';
import { PureQueryOptions } from '@apollo/client';
import { Modal, Button, Skeleton, Input, notification } from 'antd';

import {
  useSearchTorrentLazyQuery,
  useDownloadOwnTorrentMutation,
  FileType,
  GetLibraryTvShowsDocument,
  GetDownloadingDocument,
  GetMissingDocument,
} from '../../utils/graphql';

import { toBase64 } from '../../utils/to-base64';

import { ManualSearchStyles } from './manual-search.styles';
import { Media, getDefaultSearchQuery } from './manual-search.helpers';
import { JackettResultsTable } from './jackett-results-table';

interface ManualSearchProps {
  media: Media;
  refetchQueries?: PureQueryOptions[];
  onRequestClose: () => void;
}

export function ManualSearchComponent(props: ManualSearchProps) {
  const [isUploadTorrentLoading, setUploadTorrentLoading] = useState(false);
  const $fileInput = useRef<HTMLInputElement>(null);

  const defaultSearchQuery = getDefaultSearchQuery(props.media);
  const [searchQuery, setSearchQuery] = useState(
    defaultSearchQuery.toLowerCase()
  );

  const handleClose = () => {
    props.onRequestClose();
  };

  const [search, { data, loading }] = useSearchTorrentLazyQuery({
    variables: { query: searchQuery },
  });

  const [downloadOwnTorrent] = useDownloadOwnTorrentMutation({
    awaitRefetchQueries: true,
    refetchQueries: [
      { query: GetLibraryTvShowsDocument },
      { query: GetDownloadingDocument },
      { query: GetMissingDocument },
      ...(props.refetchQueries || []),
    ],
    onError: ({ message }) =>
      notification.error({
        message: message.replace('GraphQL error: ', ''),
        placement: 'bottomRight',
      }),
    onCompleted: () => {
      handleClose();
      notification.success({
        message: 'Download episode started',
        placement: 'bottomRight',
      });
    },
  });

  const handleUploadTorrent = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUploadTorrentLoading(true);
    const file = event.currentTarget.files?.item(0);

    if (file && props.media.id) {
      const base64 = await toBase64(file);
      await downloadOwnTorrent({
        variables: {
          mediaId: props.media.id,
          mediaType:
            props.media.__typename === 'EnrichedTVEpisode'
              ? FileType.Episode
              : FileType.Movie,
          torrent: base64,
        },
      });
    }

    setUploadTorrentLoading(false);
  };

  const handlePasteMagnetLink = async () => {
    setUploadTorrentLoading(true);

    const magnetLink = await navigator.clipboard.readText();

    if (typeof magnetLink !== 'string' || !magnetLink.startsWith('magnet:')) {
      setUploadTorrentLoading(false);
      return notification.error({
        message: 'You dont have a magnet link in your clipboard to paste',
      });
    }

    if (props.media.id) {
      await downloadOwnTorrent({
        variables: {
          mediaId: props.media.id,
          mediaType:
            props.media.__typename === 'EnrichedTVEpisode'
              ? FileType.Episode
              : FileType.Movie,
          torrent: magnetLink,
        },
      });
    }

    return setUploadTorrentLoading(false);
  };

  useEffect(() => {
    search();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal
      visible={true}
      destroyOnClose={true}
      onCancel={handleClose}
      centered={true}
      width={960}
      footer={[
        <Button key="close" onClick={handleClose}>
          Close
        </Button>,
      ]}
    >
      <ManualSearchStyles>
        <input
          ref={$fileInput}
          type="file"
          accept=".torrent"
          style={{ display: 'none' }}
          onChange={handleUploadTorrent}
        />
        <div className="search-title">{defaultSearchQuery}</div>
        <div className="search-input">
          <Input.Search
            defaultValue={searchQuery}
            onSearch={(value) => setSearchQuery(value)}
          />
          <Button
            type="primary"
            className="action-btn"
            onClick={() => $fileInput.current?.click()}
            loading={isUploadTorrentLoading}
            disabled={isUploadTorrentLoading}
          >
            Select own .torrent
          </Button>
          <Button
            type="primary"
            className="action-btn"
            onClick={handlePasteMagnetLink}
          >
            Paste magnet link
          </Button>
        </div>
        <Skeleton active={true} loading={loading}>
          <JackettResultsTable
            media={props.media}
            results={data?.results || []}
            refetchQueries={props.refetchQueries}
          />
        </Skeleton>
      </ManualSearchStyles>
    </Modal>
  );
}
