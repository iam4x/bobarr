import { registerEnumType, Field, ObjectType } from '@nestjs/graphql';

export enum FileType {
  EPISODE = 'episode',
  SEASON = 'season',
  MOVIE = 'movie',
}

export enum JobName {
  DOWNLOAD_MOVIE = 'download_movie',
  DOWNLOAD_EPISODE = 'download_episode',
  DOWNLOAD_SEASON = 'download_season',
}

export enum DownloadableMediaState {
  SEARCHING = 'searching',
  MISSING = 'missing',
  DOWNLOADING = 'downloading',
  DOWNLOADED = 'downloaded',
  PROCESSED = 'processed',
}

export enum ParameterKey {
  REGION = 'region',
  LANGUAGE = 'language',
  TMDB_API_KEY = 'tmdb_api_key',
  JACKETT_API_KEY = 'jackett_api_key',
  JACKETT_URL = 'jackett_url',
  MAX_MOVIE_DOWNLOAD_SIZE = 'max_movie_download_size',
  MAX_TVSHOW_EPISODE_DOWNLOAD_SIZE = 'max_tvshow_episode_download_size',
  ORGANIZE_LIBRARY_STRATEGY = 'organize_library_strategy',
}

export enum OrganizeLibraryStrategy {
  LINK = 'link',
  COPY = 'copy',
  MOVE = 'move',
}

export enum JobsQueue {
  DOWNLOAD = 'download',
  REFRESH_TORRENT = 'refresh_torrent',
  RENAME_AND_LINK = 'rename_and_link',
  SCAN_LIBRARY = 'scan_library',
}

export enum DownloadQueueProcessors {
  DOWNLOAD_MOVIE = 'download_movie',
  DOWNLOAD_SEASON = 'download_season',
  DOWNLOAD_EPISODE = 'download_episode',
  DOWNLOAD_MISSING = 'download_missing',
}

export enum OrganizeQueueProcessors {
  HANDLE_MOVIE = 'handle_movie',
  HANDLE_SEASON = 'handle_season',
  HANDLE_EPISODE = 'handle_episode',
}

export enum ScanLibraryQueueProcessors {
  SCAN_LIBRARY_FOLDER = 'scan_library_folder',
  FIND_NEW_EPISODES = 'find_new_episodes',
  SCAN_TV_SHOWS_FOLDER = 'scan_tv_shows_folder',
  SCAN_MOVIES_FOLDER = 'scan_movies_folder',
  PROCESS_MOVIE_FOLDER = 'process_movie_folder',
  PROCESS_TV_SHOW_FOLDER = 'process_tv_show_folder',
}

@ObjectType()
export class GraphQLCommonResponse {
  @Field() public success!: boolean;
  @Field({ nullable: true }) public message?: string;
}

registerEnumType(FileType, { name: 'FileType' });
registerEnumType(JobName, { name: 'JobName' });
registerEnumType(DownloadableMediaState, { name: 'DownloadableMediaState' });
registerEnumType(ParameterKey, { name: 'ParameterKey' });
