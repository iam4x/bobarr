import React, { useState } from 'react';
import dayjs from 'dayjs';
import { Table, Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { SearchOutlined } from '@ant-design/icons';
import { FaChevronCircleDown, FaChevronCircleRight } from 'react-icons/fa';

import {
  useGetTvSeasonDetailsQuery,
  TmdbFormattedTvSeason,
  EnrichedTvEpisode,
  DownloadableMediaState,
  GetTvSeasonDetailsDocument,
} from '../../utils/graphql';

import { availableIn } from '../../utils/available-in';
import { ManualSearchComponent } from '../manual-search/manual-search.component';
import { Media } from '../manual-search/manual-search.helpers';

interface TVSeasonDetailsProps {
  tvShowTMDBId: number;
  season: TmdbFormattedTvSeason;
  tvShowTitle: string;
}

export function TVSeasonDetailsComponent({
  tvShowTMDBId,
  season,
  tvShowTitle,
}: TVSeasonDetailsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [manualSearch, setManualSearch] = useState<Media | null>(null);

  const { data, loading } = useGetTvSeasonDetailsQuery({
    pollInterval: 5000,
    fetchPolicy: 'cache-and-network',
    variables: { tvShowTMDBId, seasonNumber: season.seasonNumber },
  });

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const columns: ColumnsType<EnrichedTvEpisode> = [
    {
      title: 'Title',
      render: (row: EnrichedTvEpisode) => `Episode ${row.episodeNumber}`,
      width: 100,
    },
    {
      title: 'Air date',
      render: (row: EnrichedTvEpisode) => availableIn(dayjs(row.releaseDate)),
    },
    {
      title: 'Status',
      align: 'right',
      render: (row: EnrichedTvEpisode) => {
        let color: string | undefined = undefined;
        let label = 'Missing';

        if (
          row.state === DownloadableMediaState.Processed ||
          row.state === DownloadableMediaState.Downloaded
        ) {
          color = 'geekblue';
          label = 'Downloaded';
        }

        if (
          row.state === DownloadableMediaState.Searching ||
          row.state === DownloadableMediaState.Downloading
        ) {
          color = 'blue';
          label = 'Downloading';
        }

        return (
          <Tag color={color} style={{ width: 90, textAlign: 'center' }}>
            {label}
          </Tag>
        );
      },
    },
    {
      title: 'Actions',
      align: 'right',
      width: 100,
      render: (row: EnrichedTvEpisode) => {
        const inLibrary = row.state !== DownloadableMediaState.Missing;
        return (
          <Tag
            icon={<SearchOutlined />}
            onClick={() => setManualSearch(row)}
            style={{ width: 80, textAlign: 'center', cursor: 'pointer' }}
          >
            {inLibrary ? 'Replace' : 'Search'}
          </Tag>
        );
      },
    },
  ];

  return (
    <>
      {manualSearch && (
        <ManualSearchComponent
          media={manualSearch}
          onRequestClose={() => setManualSearch(null)}
          refetchQueries={[
            {
              query: GetTvSeasonDetailsDocument,
              variables: {
                tvShowTMDBId,
                seasonNumber: season.seasonNumber,
              },
            },
          ]}
        />
      )}

      <div
        className="season"
        style={{ marginBottom: isOpen && season.seasonNumber !== 1 ? 12 : 0 }}
      >
        <div className="season-title" onClick={toggle}>
          <div className="season-toggle">
            {isOpen ? <FaChevronCircleDown /> : <FaChevronCircleRight />}
          </div>
          <div className="season-number">Season {season.seasonNumber}</div>
          {season.airDate && (
            <div className="season-year">
              {' '}
              ({dayjs(season.airDate).format('YYYY')})
            </div>
          )}
          <div>
            <Tag
              icon={<SearchOutlined />}
              onClick={() =>
                setManualSearch({ ...season, tvShowTitle, tvShowTMDBId })
              }
              style={{ width: 80, textAlign: 'center', cursor: 'pointer' }}
            >
              {season.inLibrary ? 'Replace' : 'Search'}
            </Tag>
          </div>
        </div>
        {isOpen && (
          <Table<EnrichedTvEpisode>
            rowKey="id"
            size="small"
            dataSource={data?.episodes || []}
            columns={columns}
            showHeader={false}
            pagination={false}
            loading={!data && loading}
          />
        )}
      </div>
    </>
  );
}
