/* eslint-disable */
/* this is a generated file, do not edit */
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any;
  /** The `BigInt` scalar type represents non-fractional signed whole numeric values. BigInt can represent values between -(2^53) + 1 and 2^53 - 1.  */
  BigInt: any;
};

export type GraphQlCommonResponse = {
  __typename?: 'GraphQLCommonResponse';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
};

export type TvShow = {
  __typename?: 'TVShow';
  id: Scalars['Float'];
  tmdbId: Scalars['Float'];
  title: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};


export type Movie = {
  __typename?: 'Movie';
  id: Scalars['Float'];
  tmdbId: Scalars['Float'];
  title: Scalars['String'];
  state: DownloadableMediaState;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export enum DownloadableMediaState {
  Searching = 'SEARCHING',
  Missing = 'MISSING',
  Downloading = 'DOWNLOADING',
  Downloaded = 'DOWNLOADED',
  Processed = 'PROCESSED'
}

export type TmdbFormattedTvEpisode = {
  __typename?: 'TMDBFormattedTVEpisode';
  id: Scalars['Float'];
  episodeNumber: Scalars['Float'];
  name: Scalars['String'];
  overview: Scalars['String'];
  seasonNumber: Scalars['Float'];
  voteCount?: Maybe<Scalars['Float']>;
  voteAverage?: Maybe<Scalars['Float']>;
  airDate?: Maybe<Scalars['String']>;
  stillPath?: Maybe<Scalars['String']>;
};

export type TmdbFormattedTvSeason = {
  __typename?: 'TMDBFormattedTVSeason';
  id: Scalars['Float'];
  name: Scalars['String'];
  seasonNumber: Scalars['Float'];
  inLibrary: Scalars['Boolean'];
  overview?: Maybe<Scalars['String']>;
  airDate?: Maybe<Scalars['String']>;
  episodeCount?: Maybe<Scalars['Float']>;
  posterPath?: Maybe<Scalars['String']>;
  episodes?: Maybe<Array<TmdbFormattedTvEpisode>>;
};

export type TmdbSearchResult = {
  __typename?: 'TMDBSearchResult';
  id: Scalars['Float'];
  tmdbId: Scalars['Float'];
  title: Scalars['String'];
  voteAverage: Scalars['Float'];
  overview: Scalars['String'];
  runtime?: Maybe<Scalars['Float']>;
  posterPath?: Maybe<Scalars['String']>;
  releaseDate?: Maybe<Scalars['String']>;
};

export type TmdbSearchResults = {
  __typename?: 'TMDBSearchResults';
  movies: Array<TmdbSearchResult>;
  tvShows: Array<TmdbSearchResult>;
};

export type TmdbPaginatedResult = {
  __typename?: 'TMDBPaginatedResult';
  page: Scalars['Float'];
  totalResults: Scalars['Float'];
  totalPages: Scalars['Float'];
  results: Array<TmdbSearchResult>;
};

export type TmdbLanguagesResult = {
  __typename?: 'TMDBLanguagesResult';
  code: Scalars['String'];
  language: Scalars['String'];
};

export type TmdbGenresResult = {
  __typename?: 'TMDBGenresResult';
  id: Scalars['Float'];
  name: Scalars['String'];
};

export type TmdbGenresResults = {
  __typename?: 'TMDBGenresResults';
  movieGenres: Array<TmdbGenresResult>;
  tvShowGenres: Array<TmdbGenresResult>;
};

export type Quality = {
  __typename?: 'Quality';
  id: Scalars['Float'];
  name: Scalars['String'];
  match: Array<Scalars['String']>;
  score: Scalars['Float'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  type: Entertainment;
};

export enum Entertainment {
  TvShow = 'TvShow',
  Movie = 'Movie'
}

export type Tag = {
  __typename?: 'Tag';
  id: Scalars['Float'];
  name: Scalars['String'];
  score: Scalars['Float'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type ParamsHash = {
  __typename?: 'ParamsHash';
  region: Scalars['String'];
  language: Scalars['String'];
  tmdb_api_key: Scalars['String'];
  jackett_api_key: Scalars['String'];
  max_movie_download_size: Scalars['String'];
  max_tvshow_episode_download_size: Scalars['String'];
  organize_library_strategy: Scalars['String'];
};

export type EnrichedMovie = {
  __typename?: 'EnrichedMovie';
  id: Scalars['Float'];
  tmdbId: Scalars['Float'];
  title: Scalars['String'];
  state: DownloadableMediaState;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  overview: Scalars['String'];
  voteAverage: Scalars['Float'];
  releaseDate: Scalars['String'];
  originalTitle?: Maybe<Scalars['String']>;
  posterPath?: Maybe<Scalars['String']>;
  runtime?: Maybe<Scalars['Float']>;
};

export type EnrichedTvShow = {
  __typename?: 'EnrichedTVShow';
  id: Scalars['Float'];
  tmdbId: Scalars['Float'];
  title: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  overview: Scalars['String'];
  voteAverage: Scalars['Float'];
  releaseDate: Scalars['String'];
  originalTitle?: Maybe<Scalars['String']>;
  posterPath?: Maybe<Scalars['String']>;
  runtime?: Maybe<Scalars['Float']>;
};

export type EnrichedTvEpisode = {
  __typename?: 'EnrichedTVEpisode';
  id: Scalars['Float'];
  episodeNumber: Scalars['Float'];
  seasonNumber: Scalars['Float'];
  state: DownloadableMediaState;
  tvShow: TvShow;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  releaseDate: Scalars['String'];
  voteAverage?: Maybe<Scalars['Float']>;
};

export type DownloadingMedia = {
  __typename?: 'DownloadingMedia';
  id: Scalars['String'];
  title: Scalars['String'];
  tag: Scalars['String'];
  resourceId: Scalars['Float'];
  resourceType: FileType;
  quality: Scalars['String'];
  torrent: Scalars['String'];
};

export enum FileType {
  Episode = 'EPISODE',
  Season = 'SEASON',
  Movie = 'MOVIE'
}

export type SearchingMedia = {
  __typename?: 'SearchingMedia';
  id: Scalars['String'];
  title: Scalars['String'];
  resourceId: Scalars['Float'];
  resourceType: FileType;
};

export type LibraryCalendar = {
  __typename?: 'LibraryCalendar';
  movies: Array<EnrichedMovie>;
  tvEpisodes: Array<EnrichedTvEpisode>;
};

export type LibraryFileDetails = {
  __typename?: 'LibraryFileDetails';
  id: Scalars['Float'];
  libraryPath: Scalars['String'];
  torrentFileName?: Maybe<Scalars['String']>;
  libraryFileSize?: Maybe<Scalars['BigInt']>;
};


export type JackettFormattedResult = {
  __typename?: 'JackettFormattedResult';
  id: Scalars['String'];
  title: Scalars['String'];
  quality: Scalars['String'];
  qualityScore: Scalars['Float'];
  seeders: Scalars['Float'];
  peers: Scalars['Float'];
  link: Scalars['String'];
  downloadLink: Scalars['String'];
  tag: Scalars['String'];
  tagScore: Scalars['Float'];
  publishDate: Scalars['String'];
  normalizedTitle: Scalars['String'];
  normalizedTitleParts: Array<Scalars['String']>;
  size: Scalars['BigInt'];
};

export type TorrentStatus = {
  __typename?: 'TorrentStatus';
  id: Scalars['Int'];
  resourceId: Scalars['Int'];
  resourceType: FileType;
  percentDone: Scalars['Float'];
  rateDownload: Scalars['Int'];
  rateUpload: Scalars['Int'];
  uploadRatio: Scalars['Float'];
  uploadedEver: Scalars['BigInt'];
  totalSize: Scalars['BigInt'];
  status: Scalars['Int'];
};

export type Ratings = {
  __typename?: 'Ratings';
  IMDB?: Maybe<Scalars['String']>;
  rottenTomatoes?: Maybe<Scalars['String']>;
  metaCritic?: Maybe<Scalars['String']>;
};

export type OmdbInfo = {
  __typename?: 'OMDBInfo';
  ratings: Ratings;
};

export type Query = {
  __typename?: 'Query';
  getQualityParams: Array<Quality>;
  getTags: Array<Tag>;
  getParams: ParamsHash;
  search: TmdbSearchResults;
  getPopular: TmdbSearchResults;
  getTVShowSeasons: Array<TmdbFormattedTvSeason>;
  getRecommendedTVShows: Array<TmdbSearchResult>;
  getRecommendedMovies: Array<TmdbSearchResult>;
  discover: TmdbPaginatedResult;
  getLanguages: Array<TmdbLanguagesResult>;
  getGenres: TmdbGenresResults;
  searchJackett: Array<JackettFormattedResult>;
  getTorrentStatus: Array<TorrentStatus>;
  getDownloadingMedias: Array<DownloadingMedia>;
  getSearchingMedias: Array<SearchingMedia>;
  getMovies: Array<EnrichedMovie>;
  getTVShows: Array<EnrichedTvShow>;
  getMissingTVEpisodes: Array<EnrichedTvEpisode>;
  getMissingMovies: Array<EnrichedMovie>;
  getTVSeasonDetails: Array<EnrichedTvEpisode>;
  getCalendar: LibraryCalendar;
  getMovieFileDetails: LibraryFileDetails;
  omdbSearch: OmdbInfo;
};


export type QueryGetQualityParamsArgs = {
  type: Entertainment;
};


export type QuerySearchArgs = {
  query: Scalars['String'];
};


export type QueryGetTvShowSeasonsArgs = {
  tvShowTMDBId: Scalars['Int'];
};


export type QueryDiscoverArgs = {
  originLanguage?: Maybe<Scalars['String']>;
  primaryReleaseYear?: Maybe<Scalars['String']>;
  score?: Maybe<Scalars['Float']>;
  genres?: Maybe<Array<Scalars['Float']>>;
  page?: Maybe<Scalars['Float']>;
  entertainment?: Maybe<Entertainment>;
};


export type QuerySearchJackettArgs = {
  query: Scalars['String'];
};


export type QueryGetTorrentStatusArgs = {
  torrents: Array<GetTorrentStatusInput>;
};


export type QueryGetTvSeasonDetailsArgs = {
  seasonNumber: Scalars['Int'];
  tvShowTMDBId: Scalars['Int'];
};


export type QueryGetMovieFileDetailsArgs = {
  tmdbId: Scalars['Int'];
};


export type QueryOmdbSearchArgs = {
  title: Scalars['String'];
};

export type GetTorrentStatusInput = {
  resourceId: Scalars['Int'];
  resourceType: FileType;
};

export type Mutation = {
  __typename?: 'Mutation';
  saveQualityParams: GraphQlCommonResponse;
  saveTags: GraphQlCommonResponse;
  clearRedisCache: GraphQlCommonResponse;
  updateParams: GraphQlCommonResponse;
  startScanLibraryJob: GraphQlCommonResponse;
  startFindNewEpisodesJob: GraphQlCommonResponse;
  startDownloadMissingJob: GraphQlCommonResponse;
  downloadMovie: GraphQlCommonResponse;
  downloadSeason: GraphQlCommonResponse;
  downloadTVEpisode: GraphQlCommonResponse;
  trackMovie: Movie;
  removeMovie: GraphQlCommonResponse;
  trackTVShow: TvShow;
  removeTVShow: GraphQlCommonResponse;
  resetLibrary: GraphQlCommonResponse;
  downloadOwnTorrent: GraphQlCommonResponse;
};


export type MutationSaveQualityParamsArgs = {
  qualities: Array<QualityInput>;
};


export type MutationSaveTagsArgs = {
  tags: Array<TagInput>;
};


export type MutationUpdateParamsArgs = {
  params: Array<UpdateParamsInput>;
};


export type MutationDownloadMovieArgs = {
  jackettResult: JackettInput;
  movieId: Scalars['Int'];
};


export type MutationDownloadSeasonArgs = {
  jackettResult: JackettInput;
  seasonNumber: Scalars['Int'];
  tvShowTMDBId: Scalars['Int'];
};


export type MutationDownloadTvEpisodeArgs = {
  jackettResult: JackettInput;
  episodeId: Scalars['Int'];
};


export type MutationTrackMovieArgs = {
  tmdbId: Scalars['Int'];
  title: Scalars['String'];
};


export type MutationRemoveMovieArgs = {
  tmdbId: Scalars['Int'];
};


export type MutationTrackTvShowArgs = {
  seasonNumbers: Array<Scalars['Int']>;
  tmdbId: Scalars['Int'];
};


export type MutationRemoveTvShowArgs = {
  tmdbId: Scalars['Int'];
};


export type MutationResetLibraryArgs = {
  resetSettings: Scalars['Boolean'];
  deleteFiles: Scalars['Boolean'];
};


export type MutationDownloadOwnTorrentArgs = {
  torrent: Scalars['String'];
  mediaType: FileType;
  mediaId: Scalars['Int'];
};

export type QualityInput = {
  id: Scalars['Float'];
  score: Scalars['Float'];
};

export type TagInput = {
  name: Scalars['String'];
  score: Scalars['Float'];
};

export type UpdateParamsInput = {
  key: Scalars['String'];
  value: Scalars['String'];
};

export type JackettInput = {
  title: Scalars['String'];
  downloadLink: Scalars['String'];
  quality: Scalars['String'];
  tag: Scalars['String'];
};

export type ClearCacheMutationVariables = Exact<{ [key: string]: never; }>;


export type ClearCacheMutation = (
  { __typename?: 'Mutation' }
  & { result: (
    { __typename?: 'GraphQLCommonResponse' }
    & Pick<GraphQlCommonResponse, 'success' | 'message'>
  ) }
);

export type DownloadOwnTorrentMutationVariables = Exact<{
  mediaId: Scalars['Int'];
  mediaType: FileType;
  torrent: Scalars['String'];
}>;


export type DownloadOwnTorrentMutation = (
  { __typename?: 'Mutation' }
  & { downloadOwnTorrent: (
    { __typename?: 'GraphQLCommonResponse' }
    & Pick<GraphQlCommonResponse, 'success' | 'message'>
  ) }
);

export type StartScanLibraryMutationVariables = Exact<{ [key: string]: never; }>;


export type StartScanLibraryMutation = (
  { __typename?: 'Mutation' }
  & { result: (
    { __typename?: 'GraphQLCommonResponse' }
    & Pick<GraphQlCommonResponse, 'success' | 'message'>
  ) }
);

export type StartFindNewEpisodesMutationVariables = Exact<{ [key: string]: never; }>;


export type StartFindNewEpisodesMutation = (
  { __typename?: 'Mutation' }
  & { result: (
    { __typename?: 'GraphQLCommonResponse' }
    & Pick<GraphQlCommonResponse, 'success' | 'message'>
  ) }
);

export type StartDownloadMissingMutationVariables = Exact<{ [key: string]: never; }>;


export type StartDownloadMissingMutation = (
  { __typename?: 'Mutation' }
  & { result: (
    { __typename?: 'GraphQLCommonResponse' }
    & Pick<GraphQlCommonResponse, 'success' | 'message'>
  ) }
);

export type DownloadMovieMutationVariables = Exact<{
  movieId: Scalars['Int'];
  jackettResult: JackettInput;
}>;


export type DownloadMovieMutation = (
  { __typename?: 'Mutation' }
  & { result: (
    { __typename?: 'GraphQLCommonResponse' }
    & Pick<GraphQlCommonResponse, 'success' | 'message'>
  ) }
);

export type DownloadTvEpisodeMutationVariables = Exact<{
  episodeId: Scalars['Int'];
  jackettResult: JackettInput;
}>;


export type DownloadTvEpisodeMutation = (
  { __typename?: 'Mutation' }
  & { result: (
    { __typename?: 'GraphQLCommonResponse' }
    & Pick<GraphQlCommonResponse, 'success' | 'message'>
  ) }
);

export type DownloadSeasonMutationVariables = Exact<{
  tvShowTMDBId: Scalars['Int'];
  seasonNumber: Scalars['Int'];
  jackettResult: JackettInput;
}>;


export type DownloadSeasonMutation = (
  { __typename?: 'Mutation' }
  & { result: (
    { __typename?: 'GraphQLCommonResponse' }
    & Pick<GraphQlCommonResponse, 'success' | 'message'>
  ) }
);

export type RemoveMovieMutationVariables = Exact<{
  tmdbId: Scalars['Int'];
}>;


export type RemoveMovieMutation = (
  { __typename?: 'Mutation' }
  & { result: (
    { __typename?: 'GraphQLCommonResponse' }
    & Pick<GraphQlCommonResponse, 'success' | 'message'>
  ) }
);

export type RemoveTvShowMutationVariables = Exact<{
  tmdbId: Scalars['Int'];
}>;


export type RemoveTvShowMutation = (
  { __typename?: 'Mutation' }
  & { result: (
    { __typename?: 'GraphQLCommonResponse' }
    & Pick<GraphQlCommonResponse, 'success' | 'message'>
  ) }
);

export type ResetLibraryMutationVariables = Exact<{
  deleteFiles: Scalars['Boolean'];
  resetSettings: Scalars['Boolean'];
}>;


export type ResetLibraryMutation = (
  { __typename?: 'Mutation' }
  & { result: (
    { __typename?: 'GraphQLCommonResponse' }
    & Pick<GraphQlCommonResponse, 'success' | 'message'>
  ) }
);

export type SaveQualityMutationVariables = Exact<{
  qualities: Array<QualityInput>;
}>;


export type SaveQualityMutation = (
  { __typename?: 'Mutation' }
  & { result: (
    { __typename?: 'GraphQLCommonResponse' }
    & Pick<GraphQlCommonResponse, 'success' | 'message'>
  ) }
);

export type SaveTagsMutationVariables = Exact<{
  tags: Array<TagInput>;
}>;


export type SaveTagsMutation = (
  { __typename?: 'Mutation' }
  & { result: (
    { __typename?: 'GraphQLCommonResponse' }
    & Pick<GraphQlCommonResponse, 'success' | 'message'>
  ) }
);

export type TrackMovieMutationVariables = Exact<{
  title: Scalars['String'];
  tmdbId: Scalars['Int'];
}>;


export type TrackMovieMutation = (
  { __typename?: 'Mutation' }
  & { movie: (
    { __typename?: 'Movie' }
    & Pick<Movie, 'id'>
  ) }
);

export type TrackTvShowMutationVariables = Exact<{
  tmdbId: Scalars['Int'];
  seasonNumbers: Array<Scalars['Int']>;
}>;


export type TrackTvShowMutation = (
  { __typename?: 'Mutation' }
  & { tvShow: (
    { __typename?: 'TVShow' }
    & Pick<TvShow, 'id'>
  ) }
);

export type UpdateParamsMutationVariables = Exact<{
  params: Array<UpdateParamsInput>;
}>;


export type UpdateParamsMutation = (
  { __typename?: 'Mutation' }
  & { result: (
    { __typename?: 'GraphQLCommonResponse' }
    & Pick<GraphQlCommonResponse, 'success' | 'message'>
  ) }
);

export type GetCalendarQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCalendarQuery = (
  { __typename?: 'Query' }
  & { calendar: (
    { __typename?: 'LibraryCalendar' }
    & { movies: Array<(
      { __typename?: 'EnrichedMovie' }
      & Pick<EnrichedMovie, 'id' | 'title' | 'state' | 'releaseDate'>
    )>, tvEpisodes: Array<(
      { __typename?: 'EnrichedTVEpisode' }
      & Pick<EnrichedTvEpisode, 'id' | 'episodeNumber' | 'seasonNumber' | 'state' | 'releaseDate'>
      & { tvShow: (
        { __typename?: 'TVShow' }
        & Pick<TvShow, 'id' | 'title'>
      ) }
    )> }
  ) }
);

export type GetDiscoverQueryVariables = Exact<{
  entertainment?: Maybe<Entertainment>;
  originLanguage?: Maybe<Scalars['String']>;
  primaryReleaseYear?: Maybe<Scalars['String']>;
  score?: Maybe<Scalars['Float']>;
  genres?: Maybe<Array<Scalars['Float']>>;
  page?: Maybe<Scalars['Float']>;
}>;


export type GetDiscoverQuery = (
  { __typename?: 'Query' }
  & { TMDBResults: (
    { __typename?: 'TMDBPaginatedResult' }
    & Pick<TmdbPaginatedResult, 'page' | 'totalResults' | 'totalPages'>
    & { results: Array<(
      { __typename?: 'TMDBSearchResult' }
      & Pick<TmdbSearchResult, 'id' | 'tmdbId' | 'title' | 'posterPath' | 'overview' | 'runtime' | 'voteAverage' | 'releaseDate'>
    )> }
  ) }
);

export type GetDownloadingQueryVariables = Exact<{ [key: string]: never; }>;


export type GetDownloadingQuery = (
  { __typename?: 'Query' }
  & { searching: Array<(
    { __typename?: 'SearchingMedia' }
    & Pick<SearchingMedia, 'id' | 'title' | 'resourceId' | 'resourceType'>
  )>, downloading: Array<(
    { __typename?: 'DownloadingMedia' }
    & Pick<DownloadingMedia, 'id' | 'title' | 'tag' | 'quality' | 'torrent' | 'resourceId' | 'resourceType'>
  )> }
);

export type GetGenresQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGenresQuery = (
  { __typename?: 'Query' }
  & { genres: (
    { __typename?: 'TMDBGenresResults' }
    & { movieGenres: Array<(
      { __typename?: 'TMDBGenresResult' }
      & Pick<TmdbGenresResult, 'id' | 'name'>
    )>, tvShowGenres: Array<(
      { __typename?: 'TMDBGenresResult' }
      & Pick<TmdbGenresResult, 'id' | 'name'>
    )> }
  ) }
);

export type GetLanguagesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLanguagesQuery = (
  { __typename?: 'Query' }
  & { languages: Array<(
    { __typename?: 'TMDBLanguagesResult' }
    & Pick<TmdbLanguagesResult, 'code' | 'language'>
  )> }
);

export type GetLibraryMoviesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLibraryMoviesQuery = (
  { __typename?: 'Query' }
  & { movies: Array<(
    { __typename?: 'EnrichedMovie' }
    & Pick<EnrichedMovie, 'id' | 'tmdbId' | 'title' | 'originalTitle' | 'state' | 'posterPath' | 'overview' | 'runtime' | 'voteAverage' | 'releaseDate' | 'createdAt' | 'updatedAt'>
  )> }
);

export type GetLibraryTvShowsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLibraryTvShowsQuery = (
  { __typename?: 'Query' }
  & { tvShows: Array<(
    { __typename?: 'EnrichedTVShow' }
    & Pick<EnrichedTvShow, 'id' | 'tmdbId' | 'title' | 'originalTitle' | 'posterPath' | 'runtime' | 'overview' | 'voteAverage' | 'releaseDate' | 'createdAt' | 'updatedAt'>
  )> }
);

export type MissingTvEpisodesFragment = (
  { __typename?: 'EnrichedTVEpisode' }
  & Pick<EnrichedTvEpisode, 'id' | 'seasonNumber' | 'episodeNumber' | 'releaseDate'>
  & { tvShow: (
    { __typename?: 'TVShow' }
    & Pick<TvShow, 'id' | 'title'>
  ) }
);

export type MissingMoviesFragment = (
  { __typename?: 'EnrichedMovie' }
  & Pick<EnrichedMovie, 'id' | 'title' | 'releaseDate'>
);

export type GetMissingQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMissingQuery = (
  { __typename?: 'Query' }
  & { tvEpisodes: Array<(
    { __typename?: 'EnrichedTVEpisode' }
    & MissingTvEpisodesFragment
  )>, movies: Array<(
    { __typename?: 'EnrichedMovie' }
    & MissingMoviesFragment
  )> }
);

export type GetMovieFileDetailsQueryVariables = Exact<{
  tmdbId: Scalars['Int'];
}>;


export type GetMovieFileDetailsQuery = (
  { __typename?: 'Query' }
  & { details: (
    { __typename?: 'LibraryFileDetails' }
    & Pick<LibraryFileDetails, 'id' | 'libraryPath' | 'libraryFileSize' | 'torrentFileName'>
  ) }
);

export type GetParamsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetParamsQuery = (
  { __typename?: 'Query' }
  & { params: (
    { __typename?: 'ParamsHash' }
    & Pick<ParamsHash, 'region' | 'language' | 'tmdb_api_key' | 'jackett_api_key' | 'max_movie_download_size' | 'max_tvshow_episode_download_size' | 'organize_library_strategy'>
  ) }
);

export type GetPopularQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPopularQuery = (
  { __typename?: 'Query' }
  & { results: (
    { __typename?: 'TMDBSearchResults' }
    & { movies: Array<(
      { __typename?: 'TMDBSearchResult' }
      & Pick<TmdbSearchResult, 'id' | 'tmdbId' | 'title' | 'releaseDate' | 'posterPath' | 'overview' | 'runtime' | 'voteAverage'>
    )>, tvShows: Array<(
      { __typename?: 'TMDBSearchResult' }
      & Pick<TmdbSearchResult, 'id' | 'tmdbId' | 'title' | 'releaseDate' | 'posterPath' | 'overview' | 'runtime' | 'voteAverage'>
    )> }
  ) }
);

export type GetQualityQueryVariables = Exact<{
  type: Entertainment;
}>;


export type GetQualityQuery = (
  { __typename?: 'Query' }
  & { qualities: Array<(
    { __typename?: 'Quality' }
    & Pick<Quality, 'id' | 'name' | 'match' | 'score' | 'updatedAt' | 'createdAt' | 'type'>
  )> }
);

export type GetRecommendedQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRecommendedQuery = (
  { __typename?: 'Query' }
  & { tvShows: Array<(
    { __typename?: 'TMDBSearchResult' }
    & Pick<TmdbSearchResult, 'id' | 'tmdbId' | 'title' | 'releaseDate' | 'posterPath' | 'overview' | 'runtime' | 'voteAverage'>
  )>, movies: Array<(
    { __typename?: 'TMDBSearchResult' }
    & Pick<TmdbSearchResult, 'id' | 'tmdbId' | 'title' | 'releaseDate' | 'posterPath' | 'overview' | 'runtime' | 'voteAverage'>
  )> }
);

export type GetTagsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTagsQuery = (
  { __typename?: 'Query' }
  & { tags: Array<(
    { __typename?: 'Tag' }
    & Pick<Tag, 'id' | 'name' | 'score' | 'createdAt' | 'updatedAt'>
  )> }
);

export type GetTorrentStatusQueryVariables = Exact<{
  torrents: Array<GetTorrentStatusInput>;
}>;


export type GetTorrentStatusQuery = (
  { __typename?: 'Query' }
  & { torrents: Array<(
    { __typename?: 'TorrentStatus' }
    & Pick<TorrentStatus, 'id' | 'resourceId' | 'resourceType' | 'percentDone' | 'rateDownload' | 'rateUpload' | 'uploadRatio' | 'uploadedEver' | 'totalSize' | 'status'>
  )> }
);

export type GetTvSeasonDetailsQueryVariables = Exact<{
  tvShowTMDBId: Scalars['Int'];
  seasonNumber: Scalars['Int'];
}>;


export type GetTvSeasonDetailsQuery = (
  { __typename?: 'Query' }
  & { episodes: Array<(
    { __typename?: 'EnrichedTVEpisode' }
    & Pick<EnrichedTvEpisode, 'id' | 'episodeNumber' | 'seasonNumber' | 'state' | 'updatedAt' | 'voteAverage' | 'releaseDate' | 'createdAt'>
    & { tvShow: (
      { __typename?: 'TVShow' }
      & Pick<TvShow, 'id' | 'title' | 'tmdbId' | 'updatedAt' | 'createdAt'>
    ) }
  )> }
);

export type GetTvShowSeasonsQueryVariables = Exact<{
  tvShowTMDBId: Scalars['Int'];
}>;


export type GetTvShowSeasonsQuery = (
  { __typename?: 'Query' }
  & { seasons: Array<(
    { __typename?: 'TMDBFormattedTVSeason' }
    & Pick<TmdbFormattedTvSeason, 'id' | 'name' | 'seasonNumber' | 'episodeCount' | 'overview' | 'posterPath' | 'airDate' | 'inLibrary'>
  )> }
);

export type OmdbSearchQueryVariables = Exact<{
  title: Scalars['String'];
}>;


export type OmdbSearchQuery = (
  { __typename?: 'Query' }
  & { result: (
    { __typename?: 'OMDBInfo' }
    & { ratings: (
      { __typename?: 'Ratings' }
      & Pick<Ratings, 'IMDB' | 'rottenTomatoes' | 'metaCritic'>
    ) }
  ) }
);

export type SearchTorrentQueryVariables = Exact<{
  query: Scalars['String'];
}>;


export type SearchTorrentQuery = (
  { __typename?: 'Query' }
  & { results: Array<(
    { __typename?: 'JackettFormattedResult' }
    & Pick<JackettFormattedResult, 'id' | 'title' | 'quality' | 'qualityScore' | 'seeders' | 'peers' | 'link' | 'downloadLink' | 'tag' | 'tagScore' | 'normalizedTitle' | 'normalizedTitleParts' | 'size' | 'publishDate'>
  )> }
);

export type SearchQueryVariables = Exact<{
  query: Scalars['String'];
}>;


export type SearchQuery = (
  { __typename?: 'Query' }
  & { results: (
    { __typename?: 'TMDBSearchResults' }
    & { movies: Array<(
      { __typename?: 'TMDBSearchResult' }
      & Pick<TmdbSearchResult, 'id' | 'tmdbId' | 'title' | 'releaseDate' | 'posterPath' | 'overview' | 'runtime' | 'voteAverage'>
    )>, tvShows: Array<(
      { __typename?: 'TMDBSearchResult' }
      & Pick<TmdbSearchResult, 'id' | 'tmdbId' | 'title' | 'releaseDate' | 'posterPath' | 'overview' | 'runtime' | 'voteAverage'>
    )> }
  ) }
);

export const MissingTvEpisodesFragmentDoc = gql`
    fragment MissingTVEpisodes on EnrichedTVEpisode {
  id
  seasonNumber
  episodeNumber
  releaseDate
  tvShow {
    id
    title
  }
}
    `;
export const MissingMoviesFragmentDoc = gql`
    fragment MissingMovies on EnrichedMovie {
  id
  title
  releaseDate
}
    `;
export const ClearCacheDocument = gql`
    mutation clearCache {
  result: clearRedisCache {
    success
    message
  }
}
    `;
export function useClearCacheMutation(baseOptions?: Apollo.MutationHookOptions<ClearCacheMutation, ClearCacheMutationVariables>) {
        return Apollo.useMutation<ClearCacheMutation, ClearCacheMutationVariables>(ClearCacheDocument, baseOptions);
      }
export type ClearCacheMutationHookResult = ReturnType<typeof useClearCacheMutation>;
export type ClearCacheMutationResult = Apollo.MutationResult<ClearCacheMutation>;
export type ClearCacheMutationOptions = Apollo.BaseMutationOptions<ClearCacheMutation, ClearCacheMutationVariables>;
export const DownloadOwnTorrentDocument = gql`
    mutation downloadOwnTorrent($mediaId: Int!, $mediaType: FileType!, $torrent: String!) {
  downloadOwnTorrent(mediaId: $mediaId, mediaType: $mediaType, torrent: $torrent) {
    success
    message
  }
}
    `;
export function useDownloadOwnTorrentMutation(baseOptions?: Apollo.MutationHookOptions<DownloadOwnTorrentMutation, DownloadOwnTorrentMutationVariables>) {
        return Apollo.useMutation<DownloadOwnTorrentMutation, DownloadOwnTorrentMutationVariables>(DownloadOwnTorrentDocument, baseOptions);
      }
export type DownloadOwnTorrentMutationHookResult = ReturnType<typeof useDownloadOwnTorrentMutation>;
export type DownloadOwnTorrentMutationResult = Apollo.MutationResult<DownloadOwnTorrentMutation>;
export type DownloadOwnTorrentMutationOptions = Apollo.BaseMutationOptions<DownloadOwnTorrentMutation, DownloadOwnTorrentMutationVariables>;
export const StartScanLibraryDocument = gql`
    mutation startScanLibrary {
  result: startScanLibraryJob {
    success
    message
  }
}
    `;
export function useStartScanLibraryMutation(baseOptions?: Apollo.MutationHookOptions<StartScanLibraryMutation, StartScanLibraryMutationVariables>) {
        return Apollo.useMutation<StartScanLibraryMutation, StartScanLibraryMutationVariables>(StartScanLibraryDocument, baseOptions);
      }
export type StartScanLibraryMutationHookResult = ReturnType<typeof useStartScanLibraryMutation>;
export type StartScanLibraryMutationResult = Apollo.MutationResult<StartScanLibraryMutation>;
export type StartScanLibraryMutationOptions = Apollo.BaseMutationOptions<StartScanLibraryMutation, StartScanLibraryMutationVariables>;
export const StartFindNewEpisodesDocument = gql`
    mutation startFindNewEpisodes {
  result: startFindNewEpisodesJob {
    success
    message
  }
}
    `;
export function useStartFindNewEpisodesMutation(baseOptions?: Apollo.MutationHookOptions<StartFindNewEpisodesMutation, StartFindNewEpisodesMutationVariables>) {
        return Apollo.useMutation<StartFindNewEpisodesMutation, StartFindNewEpisodesMutationVariables>(StartFindNewEpisodesDocument, baseOptions);
      }
export type StartFindNewEpisodesMutationHookResult = ReturnType<typeof useStartFindNewEpisodesMutation>;
export type StartFindNewEpisodesMutationResult = Apollo.MutationResult<StartFindNewEpisodesMutation>;
export type StartFindNewEpisodesMutationOptions = Apollo.BaseMutationOptions<StartFindNewEpisodesMutation, StartFindNewEpisodesMutationVariables>;
export const StartDownloadMissingDocument = gql`
    mutation startDownloadMissing {
  result: startDownloadMissingJob {
    success
    message
  }
}
    `;
export function useStartDownloadMissingMutation(baseOptions?: Apollo.MutationHookOptions<StartDownloadMissingMutation, StartDownloadMissingMutationVariables>) {
        return Apollo.useMutation<StartDownloadMissingMutation, StartDownloadMissingMutationVariables>(StartDownloadMissingDocument, baseOptions);
      }
export type StartDownloadMissingMutationHookResult = ReturnType<typeof useStartDownloadMissingMutation>;
export type StartDownloadMissingMutationResult = Apollo.MutationResult<StartDownloadMissingMutation>;
export type StartDownloadMissingMutationOptions = Apollo.BaseMutationOptions<StartDownloadMissingMutation, StartDownloadMissingMutationVariables>;
export const DownloadMovieDocument = gql`
    mutation downloadMovie($movieId: Int!, $jackettResult: JackettInput!) {
  result: downloadMovie(movieId: $movieId, jackettResult: $jackettResult) {
    success
    message
  }
}
    `;
export function useDownloadMovieMutation(baseOptions?: Apollo.MutationHookOptions<DownloadMovieMutation, DownloadMovieMutationVariables>) {
        return Apollo.useMutation<DownloadMovieMutation, DownloadMovieMutationVariables>(DownloadMovieDocument, baseOptions);
      }
export type DownloadMovieMutationHookResult = ReturnType<typeof useDownloadMovieMutation>;
export type DownloadMovieMutationResult = Apollo.MutationResult<DownloadMovieMutation>;
export type DownloadMovieMutationOptions = Apollo.BaseMutationOptions<DownloadMovieMutation, DownloadMovieMutationVariables>;
export const DownloadTvEpisodeDocument = gql`
    mutation downloadTVEpisode($episodeId: Int!, $jackettResult: JackettInput!) {
  result: downloadTVEpisode(episodeId: $episodeId, jackettResult: $jackettResult) {
    success
    message
  }
}
    `;
export function useDownloadTvEpisodeMutation(baseOptions?: Apollo.MutationHookOptions<DownloadTvEpisodeMutation, DownloadTvEpisodeMutationVariables>) {
        return Apollo.useMutation<DownloadTvEpisodeMutation, DownloadTvEpisodeMutationVariables>(DownloadTvEpisodeDocument, baseOptions);
      }
export type DownloadTvEpisodeMutationHookResult = ReturnType<typeof useDownloadTvEpisodeMutation>;
export type DownloadTvEpisodeMutationResult = Apollo.MutationResult<DownloadTvEpisodeMutation>;
export type DownloadTvEpisodeMutationOptions = Apollo.BaseMutationOptions<DownloadTvEpisodeMutation, DownloadTvEpisodeMutationVariables>;
export const DownloadSeasonDocument = gql`
    mutation downloadSeason($tvShowTMDBId: Int!, $seasonNumber: Int!, $jackettResult: JackettInput!) {
  result: downloadSeason(
    tvShowTMDBId: $tvShowTMDBId
    seasonNumber: $seasonNumber
    jackettResult: $jackettResult
  ) {
    success
    message
  }
}
    `;
export function useDownloadSeasonMutation(baseOptions?: Apollo.MutationHookOptions<DownloadSeasonMutation, DownloadSeasonMutationVariables>) {
        return Apollo.useMutation<DownloadSeasonMutation, DownloadSeasonMutationVariables>(DownloadSeasonDocument, baseOptions);
      }
export type DownloadSeasonMutationHookResult = ReturnType<typeof useDownloadSeasonMutation>;
export type DownloadSeasonMutationResult = Apollo.MutationResult<DownloadSeasonMutation>;
export type DownloadSeasonMutationOptions = Apollo.BaseMutationOptions<DownloadSeasonMutation, DownloadSeasonMutationVariables>;
export const RemoveMovieDocument = gql`
    mutation removeMovie($tmdbId: Int!) {
  result: removeMovie(tmdbId: $tmdbId) {
    success
    message
  }
}
    `;
export function useRemoveMovieMutation(baseOptions?: Apollo.MutationHookOptions<RemoveMovieMutation, RemoveMovieMutationVariables>) {
        return Apollo.useMutation<RemoveMovieMutation, RemoveMovieMutationVariables>(RemoveMovieDocument, baseOptions);
      }
export type RemoveMovieMutationHookResult = ReturnType<typeof useRemoveMovieMutation>;
export type RemoveMovieMutationResult = Apollo.MutationResult<RemoveMovieMutation>;
export type RemoveMovieMutationOptions = Apollo.BaseMutationOptions<RemoveMovieMutation, RemoveMovieMutationVariables>;
export const RemoveTvShowDocument = gql`
    mutation removeTVShow($tmdbId: Int!) {
  result: removeTVShow(tmdbId: $tmdbId) {
    success
    message
  }
}
    `;
export function useRemoveTvShowMutation(baseOptions?: Apollo.MutationHookOptions<RemoveTvShowMutation, RemoveTvShowMutationVariables>) {
        return Apollo.useMutation<RemoveTvShowMutation, RemoveTvShowMutationVariables>(RemoveTvShowDocument, baseOptions);
      }
export type RemoveTvShowMutationHookResult = ReturnType<typeof useRemoveTvShowMutation>;
export type RemoveTvShowMutationResult = Apollo.MutationResult<RemoveTvShowMutation>;
export type RemoveTvShowMutationOptions = Apollo.BaseMutationOptions<RemoveTvShowMutation, RemoveTvShowMutationVariables>;
export const ResetLibraryDocument = gql`
    mutation resetLibrary($deleteFiles: Boolean!, $resetSettings: Boolean!) {
  result: resetLibrary(deleteFiles: $deleteFiles, resetSettings: $resetSettings) {
    success
    message
  }
}
    `;
export function useResetLibraryMutation(baseOptions?: Apollo.MutationHookOptions<ResetLibraryMutation, ResetLibraryMutationVariables>) {
        return Apollo.useMutation<ResetLibraryMutation, ResetLibraryMutationVariables>(ResetLibraryDocument, baseOptions);
      }
export type ResetLibraryMutationHookResult = ReturnType<typeof useResetLibraryMutation>;
export type ResetLibraryMutationResult = Apollo.MutationResult<ResetLibraryMutation>;
export type ResetLibraryMutationOptions = Apollo.BaseMutationOptions<ResetLibraryMutation, ResetLibraryMutationVariables>;
export const SaveQualityDocument = gql`
    mutation saveQuality($qualities: [QualityInput!]!) {
  result: saveQualityParams(qualities: $qualities) {
    success
    message
  }
}
    `;
export function useSaveQualityMutation(baseOptions?: Apollo.MutationHookOptions<SaveQualityMutation, SaveQualityMutationVariables>) {
        return Apollo.useMutation<SaveQualityMutation, SaveQualityMutationVariables>(SaveQualityDocument, baseOptions);
      }
export type SaveQualityMutationHookResult = ReturnType<typeof useSaveQualityMutation>;
export type SaveQualityMutationResult = Apollo.MutationResult<SaveQualityMutation>;
export type SaveQualityMutationOptions = Apollo.BaseMutationOptions<SaveQualityMutation, SaveQualityMutationVariables>;
export const SaveTagsDocument = gql`
    mutation saveTags($tags: [TagInput!]!) {
  result: saveTags(tags: $tags) {
    success
    message
  }
}
    `;
export function useSaveTagsMutation(baseOptions?: Apollo.MutationHookOptions<SaveTagsMutation, SaveTagsMutationVariables>) {
        return Apollo.useMutation<SaveTagsMutation, SaveTagsMutationVariables>(SaveTagsDocument, baseOptions);
      }
export type SaveTagsMutationHookResult = ReturnType<typeof useSaveTagsMutation>;
export type SaveTagsMutationResult = Apollo.MutationResult<SaveTagsMutation>;
export type SaveTagsMutationOptions = Apollo.BaseMutationOptions<SaveTagsMutation, SaveTagsMutationVariables>;
export const TrackMovieDocument = gql`
    mutation trackMovie($title: String!, $tmdbId: Int!) {
  movie: trackMovie(title: $title, tmdbId: $tmdbId) {
    id
  }
}
    `;
export function useTrackMovieMutation(baseOptions?: Apollo.MutationHookOptions<TrackMovieMutation, TrackMovieMutationVariables>) {
        return Apollo.useMutation<TrackMovieMutation, TrackMovieMutationVariables>(TrackMovieDocument, baseOptions);
      }
export type TrackMovieMutationHookResult = ReturnType<typeof useTrackMovieMutation>;
export type TrackMovieMutationResult = Apollo.MutationResult<TrackMovieMutation>;
export type TrackMovieMutationOptions = Apollo.BaseMutationOptions<TrackMovieMutation, TrackMovieMutationVariables>;
export const TrackTvShowDocument = gql`
    mutation trackTVShow($tmdbId: Int!, $seasonNumbers: [Int!]!) {
  tvShow: trackTVShow(tmdbId: $tmdbId, seasonNumbers: $seasonNumbers) {
    id
  }
}
    `;
export function useTrackTvShowMutation(baseOptions?: Apollo.MutationHookOptions<TrackTvShowMutation, TrackTvShowMutationVariables>) {
        return Apollo.useMutation<TrackTvShowMutation, TrackTvShowMutationVariables>(TrackTvShowDocument, baseOptions);
      }
export type TrackTvShowMutationHookResult = ReturnType<typeof useTrackTvShowMutation>;
export type TrackTvShowMutationResult = Apollo.MutationResult<TrackTvShowMutation>;
export type TrackTvShowMutationOptions = Apollo.BaseMutationOptions<TrackTvShowMutation, TrackTvShowMutationVariables>;
export const UpdateParamsDocument = gql`
    mutation updateParams($params: [UpdateParamsInput!]!) {
  result: updateParams(params: $params) {
    success
    message
  }
}
    `;
export function useUpdateParamsMutation(baseOptions?: Apollo.MutationHookOptions<UpdateParamsMutation, UpdateParamsMutationVariables>) {
        return Apollo.useMutation<UpdateParamsMutation, UpdateParamsMutationVariables>(UpdateParamsDocument, baseOptions);
      }
export type UpdateParamsMutationHookResult = ReturnType<typeof useUpdateParamsMutation>;
export type UpdateParamsMutationResult = Apollo.MutationResult<UpdateParamsMutation>;
export type UpdateParamsMutationOptions = Apollo.BaseMutationOptions<UpdateParamsMutation, UpdateParamsMutationVariables>;
export const GetCalendarDocument = gql`
    query getCalendar {
  calendar: getCalendar {
    movies {
      id
      title
      state
      releaseDate
    }
    tvEpisodes {
      id
      tvShow {
        id
        title
      }
      episodeNumber
      seasonNumber
      state
      releaseDate
    }
  }
}
    `;
export function useGetCalendarQuery(baseOptions?: Apollo.QueryHookOptions<GetCalendarQuery, GetCalendarQueryVariables>) {
        return Apollo.useQuery<GetCalendarQuery, GetCalendarQueryVariables>(GetCalendarDocument, baseOptions);
      }
export function useGetCalendarLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCalendarQuery, GetCalendarQueryVariables>) {
          return Apollo.useLazyQuery<GetCalendarQuery, GetCalendarQueryVariables>(GetCalendarDocument, baseOptions);
        }
export type GetCalendarQueryHookResult = ReturnType<typeof useGetCalendarQuery>;
export type GetCalendarLazyQueryHookResult = ReturnType<typeof useGetCalendarLazyQuery>;
export type GetCalendarQueryResult = Apollo.QueryResult<GetCalendarQuery, GetCalendarQueryVariables>;
export const GetDiscoverDocument = gql`
    query getDiscover($entertainment: Entertainment, $originLanguage: String, $primaryReleaseYear: String, $score: Float, $genres: [Float!], $page: Float) {
  TMDBResults: discover(
    entertainment: $entertainment
    originLanguage: $originLanguage
    primaryReleaseYear: $primaryReleaseYear
    score: $score
    genres: $genres
    page: $page
  ) {
    page
    totalResults
    totalPages
    results {
      id
      tmdbId
      title
      posterPath
      overview
      runtime
      voteAverage
      releaseDate
    }
  }
}
    `;
export function useGetDiscoverQuery(baseOptions?: Apollo.QueryHookOptions<GetDiscoverQuery, GetDiscoverQueryVariables>) {
        return Apollo.useQuery<GetDiscoverQuery, GetDiscoverQueryVariables>(GetDiscoverDocument, baseOptions);
      }
export function useGetDiscoverLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDiscoverQuery, GetDiscoverQueryVariables>) {
          return Apollo.useLazyQuery<GetDiscoverQuery, GetDiscoverQueryVariables>(GetDiscoverDocument, baseOptions);
        }
export type GetDiscoverQueryHookResult = ReturnType<typeof useGetDiscoverQuery>;
export type GetDiscoverLazyQueryHookResult = ReturnType<typeof useGetDiscoverLazyQuery>;
export type GetDiscoverQueryResult = Apollo.QueryResult<GetDiscoverQuery, GetDiscoverQueryVariables>;
export const GetDownloadingDocument = gql`
    query getDownloading {
  searching: getSearchingMedias {
    id
    title
    resourceId
    resourceType
  }
  downloading: getDownloadingMedias {
    id
    title
    tag
    quality
    torrent
    resourceId
    resourceType
  }
}
    `;
export function useGetDownloadingQuery(baseOptions?: Apollo.QueryHookOptions<GetDownloadingQuery, GetDownloadingQueryVariables>) {
        return Apollo.useQuery<GetDownloadingQuery, GetDownloadingQueryVariables>(GetDownloadingDocument, baseOptions);
      }
export function useGetDownloadingLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDownloadingQuery, GetDownloadingQueryVariables>) {
          return Apollo.useLazyQuery<GetDownloadingQuery, GetDownloadingQueryVariables>(GetDownloadingDocument, baseOptions);
        }
export type GetDownloadingQueryHookResult = ReturnType<typeof useGetDownloadingQuery>;
export type GetDownloadingLazyQueryHookResult = ReturnType<typeof useGetDownloadingLazyQuery>;
export type GetDownloadingQueryResult = Apollo.QueryResult<GetDownloadingQuery, GetDownloadingQueryVariables>;
export const GetGenresDocument = gql`
    query getGenres {
  genres: getGenres {
    movieGenres {
      id
      name
    }
    tvShowGenres {
      id
      name
    }
  }
}
    `;
export function useGetGenresQuery(baseOptions?: Apollo.QueryHookOptions<GetGenresQuery, GetGenresQueryVariables>) {
        return Apollo.useQuery<GetGenresQuery, GetGenresQueryVariables>(GetGenresDocument, baseOptions);
      }
export function useGetGenresLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGenresQuery, GetGenresQueryVariables>) {
          return Apollo.useLazyQuery<GetGenresQuery, GetGenresQueryVariables>(GetGenresDocument, baseOptions);
        }
export type GetGenresQueryHookResult = ReturnType<typeof useGetGenresQuery>;
export type GetGenresLazyQueryHookResult = ReturnType<typeof useGetGenresLazyQuery>;
export type GetGenresQueryResult = Apollo.QueryResult<GetGenresQuery, GetGenresQueryVariables>;
export const GetLanguagesDocument = gql`
    query getLanguages {
  languages: getLanguages {
    code
    language
  }
}
    `;
export function useGetLanguagesQuery(baseOptions?: Apollo.QueryHookOptions<GetLanguagesQuery, GetLanguagesQueryVariables>) {
        return Apollo.useQuery<GetLanguagesQuery, GetLanguagesQueryVariables>(GetLanguagesDocument, baseOptions);
      }
export function useGetLanguagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLanguagesQuery, GetLanguagesQueryVariables>) {
          return Apollo.useLazyQuery<GetLanguagesQuery, GetLanguagesQueryVariables>(GetLanguagesDocument, baseOptions);
        }
export type GetLanguagesQueryHookResult = ReturnType<typeof useGetLanguagesQuery>;
export type GetLanguagesLazyQueryHookResult = ReturnType<typeof useGetLanguagesLazyQuery>;
export type GetLanguagesQueryResult = Apollo.QueryResult<GetLanguagesQuery, GetLanguagesQueryVariables>;
export const GetLibraryMoviesDocument = gql`
    query getLibraryMovies {
  movies: getMovies {
    id
    tmdbId
    title
    originalTitle
    state
    posterPath
    overview
    runtime
    voteAverage
    releaseDate
    createdAt
    updatedAt
  }
}
    `;
export function useGetLibraryMoviesQuery(baseOptions?: Apollo.QueryHookOptions<GetLibraryMoviesQuery, GetLibraryMoviesQueryVariables>) {
        return Apollo.useQuery<GetLibraryMoviesQuery, GetLibraryMoviesQueryVariables>(GetLibraryMoviesDocument, baseOptions);
      }
export function useGetLibraryMoviesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLibraryMoviesQuery, GetLibraryMoviesQueryVariables>) {
          return Apollo.useLazyQuery<GetLibraryMoviesQuery, GetLibraryMoviesQueryVariables>(GetLibraryMoviesDocument, baseOptions);
        }
export type GetLibraryMoviesQueryHookResult = ReturnType<typeof useGetLibraryMoviesQuery>;
export type GetLibraryMoviesLazyQueryHookResult = ReturnType<typeof useGetLibraryMoviesLazyQuery>;
export type GetLibraryMoviesQueryResult = Apollo.QueryResult<GetLibraryMoviesQuery, GetLibraryMoviesQueryVariables>;
export const GetLibraryTvShowsDocument = gql`
    query getLibraryTVShows {
  tvShows: getTVShows {
    id
    tmdbId
    title
    originalTitle
    posterPath
    runtime
    overview
    voteAverage
    releaseDate
    createdAt
    updatedAt
  }
}
    `;
export function useGetLibraryTvShowsQuery(baseOptions?: Apollo.QueryHookOptions<GetLibraryTvShowsQuery, GetLibraryTvShowsQueryVariables>) {
        return Apollo.useQuery<GetLibraryTvShowsQuery, GetLibraryTvShowsQueryVariables>(GetLibraryTvShowsDocument, baseOptions);
      }
export function useGetLibraryTvShowsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLibraryTvShowsQuery, GetLibraryTvShowsQueryVariables>) {
          return Apollo.useLazyQuery<GetLibraryTvShowsQuery, GetLibraryTvShowsQueryVariables>(GetLibraryTvShowsDocument, baseOptions);
        }
export type GetLibraryTvShowsQueryHookResult = ReturnType<typeof useGetLibraryTvShowsQuery>;
export type GetLibraryTvShowsLazyQueryHookResult = ReturnType<typeof useGetLibraryTvShowsLazyQuery>;
export type GetLibraryTvShowsQueryResult = Apollo.QueryResult<GetLibraryTvShowsQuery, GetLibraryTvShowsQueryVariables>;
export const GetMissingDocument = gql`
    query getMissing {
  tvEpisodes: getMissingTVEpisodes {
    ...MissingTVEpisodes
  }
  movies: getMissingMovies {
    ...MissingMovies
  }
}
    ${MissingTvEpisodesFragmentDoc}
${MissingMoviesFragmentDoc}`;
export function useGetMissingQuery(baseOptions?: Apollo.QueryHookOptions<GetMissingQuery, GetMissingQueryVariables>) {
        return Apollo.useQuery<GetMissingQuery, GetMissingQueryVariables>(GetMissingDocument, baseOptions);
      }
export function useGetMissingLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMissingQuery, GetMissingQueryVariables>) {
          return Apollo.useLazyQuery<GetMissingQuery, GetMissingQueryVariables>(GetMissingDocument, baseOptions);
        }
export type GetMissingQueryHookResult = ReturnType<typeof useGetMissingQuery>;
export type GetMissingLazyQueryHookResult = ReturnType<typeof useGetMissingLazyQuery>;
export type GetMissingQueryResult = Apollo.QueryResult<GetMissingQuery, GetMissingQueryVariables>;
export const GetMovieFileDetailsDocument = gql`
    query getMovieFileDetails($tmdbId: Int!) {
  details: getMovieFileDetails(tmdbId: $tmdbId) {
    id
    libraryPath
    libraryFileSize
    torrentFileName
  }
}
    `;
export function useGetMovieFileDetailsQuery(baseOptions: Apollo.QueryHookOptions<GetMovieFileDetailsQuery, GetMovieFileDetailsQueryVariables>) {
        return Apollo.useQuery<GetMovieFileDetailsQuery, GetMovieFileDetailsQueryVariables>(GetMovieFileDetailsDocument, baseOptions);
      }
export function useGetMovieFileDetailsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMovieFileDetailsQuery, GetMovieFileDetailsQueryVariables>) {
          return Apollo.useLazyQuery<GetMovieFileDetailsQuery, GetMovieFileDetailsQueryVariables>(GetMovieFileDetailsDocument, baseOptions);
        }
export type GetMovieFileDetailsQueryHookResult = ReturnType<typeof useGetMovieFileDetailsQuery>;
export type GetMovieFileDetailsLazyQueryHookResult = ReturnType<typeof useGetMovieFileDetailsLazyQuery>;
export type GetMovieFileDetailsQueryResult = Apollo.QueryResult<GetMovieFileDetailsQuery, GetMovieFileDetailsQueryVariables>;
export const GetParamsDocument = gql`
    query getParams {
  params: getParams {
    region
    language
    tmdb_api_key
    jackett_api_key
    max_movie_download_size
    max_tvshow_episode_download_size
    organize_library_strategy
  }
}
    `;
export function useGetParamsQuery(baseOptions?: Apollo.QueryHookOptions<GetParamsQuery, GetParamsQueryVariables>) {
        return Apollo.useQuery<GetParamsQuery, GetParamsQueryVariables>(GetParamsDocument, baseOptions);
      }
export function useGetParamsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetParamsQuery, GetParamsQueryVariables>) {
          return Apollo.useLazyQuery<GetParamsQuery, GetParamsQueryVariables>(GetParamsDocument, baseOptions);
        }
export type GetParamsQueryHookResult = ReturnType<typeof useGetParamsQuery>;
export type GetParamsLazyQueryHookResult = ReturnType<typeof useGetParamsLazyQuery>;
export type GetParamsQueryResult = Apollo.QueryResult<GetParamsQuery, GetParamsQueryVariables>;
export const GetPopularDocument = gql`
    query getPopular {
  results: getPopular {
    movies {
      id
      tmdbId
      title
      releaseDate
      posterPath
      overview
      runtime
      voteAverage
    }
    tvShows {
      id
      tmdbId
      title
      releaseDate
      posterPath
      overview
      runtime
      voteAverage
    }
  }
}
    `;
export function useGetPopularQuery(baseOptions?: Apollo.QueryHookOptions<GetPopularQuery, GetPopularQueryVariables>) {
        return Apollo.useQuery<GetPopularQuery, GetPopularQueryVariables>(GetPopularDocument, baseOptions);
      }
export function useGetPopularLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPopularQuery, GetPopularQueryVariables>) {
          return Apollo.useLazyQuery<GetPopularQuery, GetPopularQueryVariables>(GetPopularDocument, baseOptions);
        }
export type GetPopularQueryHookResult = ReturnType<typeof useGetPopularQuery>;
export type GetPopularLazyQueryHookResult = ReturnType<typeof useGetPopularLazyQuery>;
export type GetPopularQueryResult = Apollo.QueryResult<GetPopularQuery, GetPopularQueryVariables>;
export const GetQualityDocument = gql`
    query getQuality($type: Entertainment!) {
  qualities: getQualityParams(type: $type) {
    id
    name
    match
    score
    updatedAt
    createdAt
    type
  }
}
    `;
export function useGetQualityQuery(baseOptions: Apollo.QueryHookOptions<GetQualityQuery, GetQualityQueryVariables>) {
        return Apollo.useQuery<GetQualityQuery, GetQualityQueryVariables>(GetQualityDocument, baseOptions);
      }
export function useGetQualityLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetQualityQuery, GetQualityQueryVariables>) {
          return Apollo.useLazyQuery<GetQualityQuery, GetQualityQueryVariables>(GetQualityDocument, baseOptions);
        }
export type GetQualityQueryHookResult = ReturnType<typeof useGetQualityQuery>;
export type GetQualityLazyQueryHookResult = ReturnType<typeof useGetQualityLazyQuery>;
export type GetQualityQueryResult = Apollo.QueryResult<GetQualityQuery, GetQualityQueryVariables>;
export const GetRecommendedDocument = gql`
    query getRecommended {
  tvShows: getRecommendedTVShows {
    id
    tmdbId
    title
    releaseDate
    posterPath
    overview
    runtime
    voteAverage
  }
  movies: getRecommendedMovies {
    id
    tmdbId
    title
    releaseDate
    posterPath
    overview
    runtime
    voteAverage
  }
}
    `;
export function useGetRecommendedQuery(baseOptions?: Apollo.QueryHookOptions<GetRecommendedQuery, GetRecommendedQueryVariables>) {
        return Apollo.useQuery<GetRecommendedQuery, GetRecommendedQueryVariables>(GetRecommendedDocument, baseOptions);
      }
export function useGetRecommendedLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRecommendedQuery, GetRecommendedQueryVariables>) {
          return Apollo.useLazyQuery<GetRecommendedQuery, GetRecommendedQueryVariables>(GetRecommendedDocument, baseOptions);
        }
export type GetRecommendedQueryHookResult = ReturnType<typeof useGetRecommendedQuery>;
export type GetRecommendedLazyQueryHookResult = ReturnType<typeof useGetRecommendedLazyQuery>;
export type GetRecommendedQueryResult = Apollo.QueryResult<GetRecommendedQuery, GetRecommendedQueryVariables>;
export const GetTagsDocument = gql`
    query getTags {
  tags: getTags {
    id
    name
    score
    createdAt
    updatedAt
  }
}
    `;
export function useGetTagsQuery(baseOptions?: Apollo.QueryHookOptions<GetTagsQuery, GetTagsQueryVariables>) {
        return Apollo.useQuery<GetTagsQuery, GetTagsQueryVariables>(GetTagsDocument, baseOptions);
      }
export function useGetTagsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTagsQuery, GetTagsQueryVariables>) {
          return Apollo.useLazyQuery<GetTagsQuery, GetTagsQueryVariables>(GetTagsDocument, baseOptions);
        }
export type GetTagsQueryHookResult = ReturnType<typeof useGetTagsQuery>;
export type GetTagsLazyQueryHookResult = ReturnType<typeof useGetTagsLazyQuery>;
export type GetTagsQueryResult = Apollo.QueryResult<GetTagsQuery, GetTagsQueryVariables>;
export const GetTorrentStatusDocument = gql`
    query getTorrentStatus($torrents: [GetTorrentStatusInput!]!) {
  torrents: getTorrentStatus(torrents: $torrents) {
    id
    resourceId
    resourceType
    percentDone
    rateDownload
    rateUpload
    uploadRatio
    uploadedEver
    totalSize
    status
  }
}
    `;
export function useGetTorrentStatusQuery(baseOptions: Apollo.QueryHookOptions<GetTorrentStatusQuery, GetTorrentStatusQueryVariables>) {
        return Apollo.useQuery<GetTorrentStatusQuery, GetTorrentStatusQueryVariables>(GetTorrentStatusDocument, baseOptions);
      }
export function useGetTorrentStatusLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTorrentStatusQuery, GetTorrentStatusQueryVariables>) {
          return Apollo.useLazyQuery<GetTorrentStatusQuery, GetTorrentStatusQueryVariables>(GetTorrentStatusDocument, baseOptions);
        }
export type GetTorrentStatusQueryHookResult = ReturnType<typeof useGetTorrentStatusQuery>;
export type GetTorrentStatusLazyQueryHookResult = ReturnType<typeof useGetTorrentStatusLazyQuery>;
export type GetTorrentStatusQueryResult = Apollo.QueryResult<GetTorrentStatusQuery, GetTorrentStatusQueryVariables>;
export const GetTvSeasonDetailsDocument = gql`
    query getTVSeasonDetails($tvShowTMDBId: Int!, $seasonNumber: Int!) {
  episodes: getTVSeasonDetails(
    tvShowTMDBId: $tvShowTMDBId
    seasonNumber: $seasonNumber
  ) {
    id
    episodeNumber
    seasonNumber
    state
    updatedAt
    voteAverage
    releaseDate
    createdAt
    tvShow {
      id
      title
      tmdbId
      updatedAt
      createdAt
    }
  }
}
    `;
export function useGetTvSeasonDetailsQuery(baseOptions: Apollo.QueryHookOptions<GetTvSeasonDetailsQuery, GetTvSeasonDetailsQueryVariables>) {
        return Apollo.useQuery<GetTvSeasonDetailsQuery, GetTvSeasonDetailsQueryVariables>(GetTvSeasonDetailsDocument, baseOptions);
      }
export function useGetTvSeasonDetailsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTvSeasonDetailsQuery, GetTvSeasonDetailsQueryVariables>) {
          return Apollo.useLazyQuery<GetTvSeasonDetailsQuery, GetTvSeasonDetailsQueryVariables>(GetTvSeasonDetailsDocument, baseOptions);
        }
export type GetTvSeasonDetailsQueryHookResult = ReturnType<typeof useGetTvSeasonDetailsQuery>;
export type GetTvSeasonDetailsLazyQueryHookResult = ReturnType<typeof useGetTvSeasonDetailsLazyQuery>;
export type GetTvSeasonDetailsQueryResult = Apollo.QueryResult<GetTvSeasonDetailsQuery, GetTvSeasonDetailsQueryVariables>;
export const GetTvShowSeasonsDocument = gql`
    query getTVShowSeasons($tvShowTMDBId: Int!) {
  seasons: getTVShowSeasons(tvShowTMDBId: $tvShowTMDBId) {
    id
    name
    seasonNumber
    episodeCount
    overview
    posterPath
    airDate
    inLibrary
  }
}
    `;
export function useGetTvShowSeasonsQuery(baseOptions: Apollo.QueryHookOptions<GetTvShowSeasonsQuery, GetTvShowSeasonsQueryVariables>) {
        return Apollo.useQuery<GetTvShowSeasonsQuery, GetTvShowSeasonsQueryVariables>(GetTvShowSeasonsDocument, baseOptions);
      }
export function useGetTvShowSeasonsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTvShowSeasonsQuery, GetTvShowSeasonsQueryVariables>) {
          return Apollo.useLazyQuery<GetTvShowSeasonsQuery, GetTvShowSeasonsQueryVariables>(GetTvShowSeasonsDocument, baseOptions);
        }
export type GetTvShowSeasonsQueryHookResult = ReturnType<typeof useGetTvShowSeasonsQuery>;
export type GetTvShowSeasonsLazyQueryHookResult = ReturnType<typeof useGetTvShowSeasonsLazyQuery>;
export type GetTvShowSeasonsQueryResult = Apollo.QueryResult<GetTvShowSeasonsQuery, GetTvShowSeasonsQueryVariables>;
export const OmdbSearchDocument = gql`
    query omdbSearch($title: String!) {
  result: omdbSearch(title: $title) {
    ratings {
      IMDB
      rottenTomatoes
      metaCritic
    }
  }
}
    `;
export function useOmdbSearchQuery(baseOptions: Apollo.QueryHookOptions<OmdbSearchQuery, OmdbSearchQueryVariables>) {
        return Apollo.useQuery<OmdbSearchQuery, OmdbSearchQueryVariables>(OmdbSearchDocument, baseOptions);
      }
export function useOmdbSearchLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OmdbSearchQuery, OmdbSearchQueryVariables>) {
          return Apollo.useLazyQuery<OmdbSearchQuery, OmdbSearchQueryVariables>(OmdbSearchDocument, baseOptions);
        }
export type OmdbSearchQueryHookResult = ReturnType<typeof useOmdbSearchQuery>;
export type OmdbSearchLazyQueryHookResult = ReturnType<typeof useOmdbSearchLazyQuery>;
export type OmdbSearchQueryResult = Apollo.QueryResult<OmdbSearchQuery, OmdbSearchQueryVariables>;
export const SearchTorrentDocument = gql`
    query searchTorrent($query: String!) {
  results: searchJackett(query: $query) {
    id
    title
    quality
    qualityScore
    seeders
    peers
    link
    downloadLink
    tag
    tagScore
    normalizedTitle
    normalizedTitleParts
    size
    publishDate
  }
}
    `;
export function useSearchTorrentQuery(baseOptions: Apollo.QueryHookOptions<SearchTorrentQuery, SearchTorrentQueryVariables>) {
        return Apollo.useQuery<SearchTorrentQuery, SearchTorrentQueryVariables>(SearchTorrentDocument, baseOptions);
      }
export function useSearchTorrentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchTorrentQuery, SearchTorrentQueryVariables>) {
          return Apollo.useLazyQuery<SearchTorrentQuery, SearchTorrentQueryVariables>(SearchTorrentDocument, baseOptions);
        }
export type SearchTorrentQueryHookResult = ReturnType<typeof useSearchTorrentQuery>;
export type SearchTorrentLazyQueryHookResult = ReturnType<typeof useSearchTorrentLazyQuery>;
export type SearchTorrentQueryResult = Apollo.QueryResult<SearchTorrentQuery, SearchTorrentQueryVariables>;
export const SearchDocument = gql`
    query search($query: String!) {
  results: search(query: $query) {
    movies {
      id
      tmdbId
      title
      releaseDate
      posterPath
      overview
      runtime
      voteAverage
    }
    tvShows {
      id
      tmdbId
      title
      releaseDate
      posterPath
      overview
      runtime
      voteAverage
    }
  }
}
    `;
export function useSearchQuery(baseOptions: Apollo.QueryHookOptions<SearchQuery, SearchQueryVariables>) {
        return Apollo.useQuery<SearchQuery, SearchQueryVariables>(SearchDocument, baseOptions);
      }
export function useSearchLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchQuery, SearchQueryVariables>) {
          return Apollo.useLazyQuery<SearchQuery, SearchQueryVariables>(SearchDocument, baseOptions);
        }
export type SearchQueryHookResult = ReturnType<typeof useSearchQuery>;
export type SearchLazyQueryHookResult = ReturnType<typeof useSearchLazyQuery>;
export type SearchQueryResult = Apollo.QueryResult<SearchQuery, SearchQueryVariables>;