import { ViewEntity, ViewColumn } from 'typeorm';
import { FileType, DownloadableMediaState } from 'src/app.dto';

@ViewEntity({
  expression: `
    SELECT
      'movie-' || id::text as id,
      id as "resourceId",
      title,
      'movie' as "resourceType",
      state
    FROM
      movie
    UNION ALL
    SELECT
      'season-' || tv_season.id::text as id,
      tv_season.id as "resourceId",
      tv_show.title || ' - Season ' || "seasonNumber"::text as title,
      'season' as "resourceType",
      tv_season.state
    FROM
      tv_season
      LEFT JOIN tv_show ON tv_season."tvShowId" = tv_show.id
    UNION ALL
    SELECT
      'episode-' || tv_episode.id::text as id,
      tv_episode.id as "resourceId",
      tv_show.title || ' - Season ' || "seasonNumber"::text || ' - Episode ' || "episodeNumber"::text as title,
      'episode' as "resourceType",
      tv_episode.state
    FROM
      tv_episode
      LEFT JOIN tv_show ON tv_episode."tvShowId" = tv_show.id
`,
})
export class MediaView {
  @ViewColumn() public id!: string;
  @ViewColumn() public title!: string;
  @ViewColumn() public resourceId!: number;
  @ViewColumn() public resourceType!: FileType;
  @ViewColumn() public state!: DownloadableMediaState;
}
