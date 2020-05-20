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

type TvEpisode = Omit<EnrichedTvEpisode, 'tvShow'>;

interface TVSeasonDetailsProps {
  tvShowTMDBId: number;
  season: TmdbFormattedTvSeason;
}

export function TVSeasonDetailsComponent({
  tvShowTMDBId,
  season,
}: TVSeasonDetailsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [manualSearch, setManualSearch] = useState<TvEpisode | null>(null);

  const { data, loading } = useGetTvSeasonDetailsQuery({
    pollInterval: 5000,
    fetchPolicy: 'cache-and-network',
    variables: { tvShowTMDBId, seasonNumber: season.seasonNumber },
  });

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const columns: ColumnsType<TvEpisode> = [
    {
      title: 'Title',
      render: (row: TvEpisode) => `Episode ${row.episodeNumber}`,
      width: 100,
    },
    {
      title: 'Air date',
      render: (row: TvEpisode) => availableIn(dayjs(row.releaseDate)),
    },
    {
      title: 'Status',
      align: 'right',
      render: (row: TvEpisode) => {
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
      render: (row: TvEpisode) => {
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
        </div>
        {isOpen && (
          <Table<TvEpisode>
            rowKey="id"
            size="small"
            dataSource={data?.episodes || []}
            columns={columns}
            showHeader={false}
            pagination={false}
            loading={
              (data && data.episodes.length === 0 && loading) ||
              (!data && loading)
            }
          />
        )}
      </div>
    </>
  );
}
