import React, { useState, useEffect } from 'react';
import { PureQueryOptions } from 'apollo-client';
import { Modal, Button, Skeleton, Input } from 'antd';

import { useSearchTorrentLazyQuery } from '../../utils/graphql';

import { ManualSearchStyles } from './manual-search.styles';
import { Media, getDefaultSearchQuery } from './manual-search.helpers';
import { JackettResultsTable } from './jackett-results-table';

interface ManualSearchProps {
  media: Media;
  refetchQueries?: PureQueryOptions[];
  onRequestClose: () => void;
}

export function ManualSearchComponent(props: ManualSearchProps) {
  const defaultSearchQuery = getDefaultSearchQuery(props.media);
  const [searchQuery, setSearchQuery] = useState(
    defaultSearchQuery.toLowerCase()
  );

  const [search, { data, loading }] = useSearchTorrentLazyQuery({
    variables: { query: searchQuery },
  });

  const handleClose = () => {
    props.onRequestClose();
  };

  /* eslint-disable-next-line */
  useEffect(() => { search(); }, []);

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
        <div className="search-title">{defaultSearchQuery}</div>
        <div className="search-input">
          <Input.Search
            defaultValue={searchQuery}
            onSearch={(value) => setSearchQuery(value)}
          />
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
