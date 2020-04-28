import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
  BigInt: any;
};



export enum DownloadableMediaState {
  Searching = 'SEARCHING',
  Missing = 'MISSING',
  Downloading = 'DOWNLOADING',
  Downloaded = 'DOWNLOADED',
  Processed = 'PROCESSED'
}

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

export type EnrichedTvEpisode = {
   __typename?: 'EnrichedTVEpisode';
  id: Scalars['Float'];
  episodeNumber: Scalars['Float'];
  seasonNumber: Scalars['Float'];
  state: DownloadableMediaState;
  tvShow: TvShow;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  voteAverage: Scalars['Float'];
  releaseDate: Scalars['String'];
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

export enum Entertainment {
  TvShow = 'TvShow',
  Movie = 'Movie'
}

export enum FileType {
  Episode = 'EPISODE',
  Season = 'SEASON',
  Movie = 'MOVIE'
}

export type GetTorrentStatusInput = {
  resourceId: Scalars['Int'];
  resourceType: FileType;
};

export type GraphQlCommonResponse = {
   __typename?: 'GraphQLCommonResponse';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
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

export type JackettInput = {
  title: Scalars['String'];
  downloadLink: Scalars['String'];
  quality: Scalars['String'];
  tag: Scalars['String'];
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

export type Mutation = {
   __typename?: 'Mutation';
  saveQualityParams: GraphQlCommonResponse;
  saveTags: GraphQlCommonResponse;
  updateParams: GraphQlCommonResponse;
  startScanLibraryJob: GraphQlCommonResponse;
  startFindNewEpisodesJob: GraphQlCommonResponse;
  startDownloadMissingJob: GraphQlCommonResponse;
  downloadMovie: GraphQlCommonResponse;
  downloadTVEpisode: GraphQlCommonResponse;
  trackMovie: Movie;
  removeMovie: GraphQlCommonResponse;
  trackTVShow: TvShow;
  removeTVShow: GraphQlCommonResponse;
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

export type ParamsHash = {
   __typename?: 'ParamsHash';
  region: Scalars['String'];
  language: Scalars['String'];
  tmdb_api_key: Scalars['String'];
  jackett_api_key: Scalars['String'];
  max_movie_download_size: Scalars['String'];
  max_tvshow_episode_download_size: Scalars['String'];
};

export type Quality = {
   __typename?: 'Quality';
  id: Scalars['Float'];
  name: Scalars['String'];
  match: Array<Scalars['String']>;
  score: Scalars['Float'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type QualityInput = {
  id: Scalars['Float'];
  score: Scalars['Float'];
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
  discover: Array<TmdbSearchResult>;
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
};


export type QuerySearchArgs = {
  query: Scalars['String'];
};


export type QueryGetTvShowSeasonsArgs = {
  tvShowTMDBId: Scalars['Int'];
};


export type QueryDiscoverArgs = {
  originLanguage?: Maybe<Scalars['String']>;
  year?: Maybe<Scalars['String']>;
  score?: Maybe<Scalars['Float']>;
  genres?: Maybe<Array<Scalars['Float']>>;
  entertainment?: Maybe<Entertainment>;
};


export type QuerySearchJackettArgs = {
  query: Scalars['String'];
};


export type QueryGetTorrentStatusArgs = {
  torrents: Array<GetTorrentStatusInput>;
};

export type SearchingMedia = {
   __typename?: 'SearchingMedia';
  id: Scalars['String'];
  title: Scalars['String'];
  resourceId: Scalars['Float'];
  resourceType: FileType;
};

export type Tag = {
   __typename?: 'Tag';
  id: Scalars['Float'];
  name: Scalars['String'];
  score: Scalars['Float'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type TagInput = {
  name: Scalars['String'];
  score: Scalars['Float'];
};

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

export type TmdbLanguagesResult = {
   __typename?: 'TMDBLanguagesResult';
  code: Scalars['String'];
  language: Scalars['String'];
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

export type TvShow = {
   __typename?: 'TVShow';
  id: Scalars['Float'];
  tmdbId: Scalars['Float'];
  title: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type UpdateParamsInput = {
  key: Scalars['String'];
  value: Scalars['String'];
};

export type StartScanLibraryMutationVariables = {};


export type StartScanLibraryMutation = (
  { __typename?: 'Mutation' }
  & { result: (
    { __typename?: 'GraphQLCommonResponse' }
    & Pick<GraphQlCommonResponse, 'success' | 'message'>
  ) }
);

export type StartFindNewEpisodesMutationVariables = {};


export type StartFindNewEpisodesMutation = (
  { __typename?: 'Mutation' }
  & { result: (
    { __typename?: 'GraphQLCommonResponse' }
    & Pick<GraphQlCommonResponse, 'success' | 'message'>
  ) }
);

export type StartDownloadMissingMutationVariables = {};


export type StartDownloadMissingMutation = (
  { __typename?: 'Mutation' }
  & { result: (
    { __typename?: 'GraphQLCommonResponse' }
    & Pick<GraphQlCommonResponse, 'success' | 'message'>
  ) }
);

export type DownloadMovieMutationVariables = {
  movieId: Scalars['Int'];
  jackettResult: JackettInput;
};


export type DownloadMovieMutation = (
  { __typename?: 'Mutation' }
  & { result: (
    { __typename?: 'GraphQLCommonResponse' }
    & Pick<GraphQlCommonResponse, 'success' | 'message'>
  ) }
);

export type DownloadTvEpisodeMutationVariables = {
  episodeId: Scalars['Int'];
  jackettResult: JackettInput;
};


export type DownloadTvEpisodeMutation = (
  { __typename?: 'Mutation' }
  & { result: (
    { __typename?: 'GraphQLCommonResponse' }
    & Pick<GraphQlCommonResponse, 'success' | 'message'>
  ) }
);

export type RemoveMovieMutationVariables = {
  tmdbId: Scalars['Int'];
};


export type RemoveMovieMutation = (
  { __typename?: 'Mutation' }
  & { result: (
    { __typename?: 'GraphQLCommonResponse' }
    & Pick<GraphQlCommonResponse, 'success' | 'message'>
  ) }
);

export type RemoveTvShowMutationVariables = {
  tmdbId: Scalars['Int'];
};


export type RemoveTvShowMutation = (
  { __typename?: 'Mutation' }
  & { result: (
    { __typename?: 'GraphQLCommonResponse' }
    & Pick<GraphQlCommonResponse, 'success' | 'message'>
  ) }
);

export type SaveQualityMutationVariables = {
  qualities: Array<QualityInput>;
};


export type SaveQualityMutation = (
  { __typename?: 'Mutation' }
  & { result: (
    { __typename?: 'GraphQLCommonResponse' }
    & Pick<GraphQlCommonResponse, 'success' | 'message'>
  ) }
);

export type SaveTagsMutationVariables = {
  tags: Array<TagInput>;
};


export type SaveTagsMutation = (
  { __typename?: 'Mutation' }
  & { result: (
    { __typename?: 'GraphQLCommonResponse' }
    & Pick<GraphQlCommonResponse, 'success' | 'message'>
  ) }
);

export type TrackMovieMutationVariables = {
  title: Scalars['String'];
  tmdbId: Scalars['Int'];
};


export type TrackMovieMutation = (
  { __typename?: 'Mutation' }
  & { movie: (
    { __typename?: 'Movie' }
    & Pick<Movie, 'id'>
  ) }
);

export type TrackTvShowMutationVariables = {
  tmdbId: Scalars['Int'];
  seasonNumbers: Array<Scalars['Int']>;
};


export type TrackTvShowMutation = (
  { __typename?: 'Mutation' }
  & { tvShow: (
    { __typename?: 'TVShow' }
    & Pick<TvShow, 'id'>
  ) }
);

export type UpdateParamsMutationVariables = {
  params: Array<UpdateParamsInput>;
};


export type UpdateParamsMutation = (
  { __typename?: 'Mutation' }
  & { result: (
    { __typename?: 'GraphQLCommonResponse' }
    & Pick<GraphQlCommonResponse, 'success' | 'message'>
  ) }
);

export type GetDiscoverQueryVariables = {
  entertainment?: Maybe<Entertainment>;
  originLanguage?: Maybe<Scalars['String']>;
  year?: Maybe<Scalars['String']>;
  score?: Maybe<Scalars['Float']>;
  genres?: Maybe<Array<Scalars['Float']>>;
};


export type GetDiscoverQuery = (
  { __typename?: 'Query' }
  & { results: Array<(
    { __typename?: 'TMDBSearchResult' }
    & Pick<TmdbSearchResult, 'id' | 'tmdbId' | 'title' | 'posterPath' | 'overview' | 'runtime' | 'voteAverage' | 'releaseDate'>
  )> }
);

export type GetDownloadingQueryVariables = {};


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

export type GetGenresQueryVariables = {};


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

export type GetLanguagesQueryVariables = {};


export type GetLanguagesQuery = (
  { __typename?: 'Query' }
  & { languages: Array<(
    { __typename?: 'TMDBLanguagesResult' }
    & Pick<TmdbLanguagesResult, 'code' | 'language'>
  )> }
);

export type GetLibraryMoviesQueryVariables = {};


export type GetLibraryMoviesQuery = (
  { __typename?: 'Query' }
  & { movies: Array<(
    { __typename?: 'EnrichedMovie' }
    & Pick<EnrichedMovie, 'id' | 'tmdbId' | 'title' | 'originalTitle' | 'state' | 'posterPath' | 'overview' | 'runtime' | 'voteAverage' | 'releaseDate' | 'createdAt' | 'updatedAt'>
  )> }
);

export type GetLibraryTvShowsQueryVariables = {};


export type GetLibraryTvShowsQuery = (
  { __typename?: 'Query' }
  & { tvShows: Array<(
    { __typename?: 'EnrichedTVShow' }
    & Pick<EnrichedTvShow, 'id' | 'tmdbId' | 'title' | 'originalTitle' | 'posterPath' | 'runtime' | 'overview' | 'voteAverage' | 'releaseDate' | 'createdAt' | 'updatedAt'>
  )> }
);

export type GetMissingQueryVariables = {};


export type GetMissingQuery = (
  { __typename?: 'Query' }
  & { tvEpisodes: Array<(
    { __typename?: 'EnrichedTVEpisode' }
    & Pick<EnrichedTvEpisode, 'id' | 'seasonNumber' | 'episodeNumber' | 'releaseDate'>
    & { tvShow: (
      { __typename?: 'TVShow' }
      & Pick<TvShow, 'id' | 'title'>
    ) }
  )>, movies: Array<(
    { __typename?: 'EnrichedMovie' }
    & Pick<EnrichedMovie, 'id' | 'title' | 'releaseDate'>
  )> }
);

export type GetParamsQueryVariables = {};


export type GetParamsQuery = (
  { __typename?: 'Query' }
  & { params: (
    { __typename?: 'ParamsHash' }
    & Pick<ParamsHash, 'region' | 'language' | 'tmdb_api_key' | 'jackett_api_key' | 'max_movie_download_size' | 'max_tvshow_episode_download_size'>
  ) }
);

export type GetPopularQueryVariables = {};


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

export type GetQualityQueryVariables = {};


export type GetQualityQuery = (
  { __typename?: 'Query' }
  & { qualities: Array<(
    { __typename?: 'Quality' }
    & Pick<Quality, 'id' | 'name' | 'match' | 'score' | 'updatedAt' | 'createdAt'>
  )> }
);

export type GetRecommendedQueryVariables = {};


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

export type GetTagsQueryVariables = {};


export type GetTagsQuery = (
  { __typename?: 'Query' }
  & { tags: Array<(
    { __typename?: 'Tag' }
    & Pick<Tag, 'id' | 'name' | 'score' | 'createdAt' | 'updatedAt'>
  )> }
);

export type GetTorrentStatusQueryVariables = {
  torrents: Array<GetTorrentStatusInput>;
};


export type GetTorrentStatusQuery = (
  { __typename?: 'Query' }
  & { torrents: Array<(
    { __typename?: 'TorrentStatus' }
    & Pick<TorrentStatus, 'id' | 'resourceId' | 'resourceType' | 'percentDone' | 'rateDownload' | 'rateUpload' | 'uploadRatio' | 'uploadedEver' | 'totalSize' | 'status'>
  )> }
);

export type GetTvShowSeasonsQueryVariables = {
  tvShowTMDBId: Scalars['Int'];
};


export type GetTvShowSeasonsQuery = (
  { __typename?: 'Query' }
  & { seasons: Array<(
    { __typename?: 'TMDBFormattedTVSeason' }
    & Pick<TmdbFormattedTvSeason, 'id' | 'name' | 'seasonNumber' | 'episodeCount' | 'overview' | 'posterPath' | 'airDate' | 'inLibrary'>
  )> }
);

export type SearchTorrentQueryVariables = {
  query: Scalars['String'];
};


export type SearchTorrentQuery = (
  { __typename?: 'Query' }
  & { results: Array<(
    { __typename?: 'JackettFormattedResult' }
    & Pick<JackettFormattedResult, 'id' | 'title' | 'quality' | 'qualityScore' | 'seeders' | 'peers' | 'link' | 'downloadLink' | 'tag' | 'tagScore' | 'normalizedTitle' | 'normalizedTitleParts' | 'size' | 'publishDate'>
  )> }
);

export type SearchQueryVariables = {
  query: Scalars['String'];
};


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


export const StartScanLibraryDocument = gql`
    mutation startScanLibrary {
  result: startScanLibraryJob {
    success
    message
  }
}
    `;
export type StartScanLibraryMutationFn = ApolloReactCommon.MutationFunction<StartScanLibraryMutation, StartScanLibraryMutationVariables>;

/**
 * __useStartScanLibraryMutation__
 *
 * To run a mutation, you first call `useStartScanLibraryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStartScanLibraryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [startScanLibraryMutation, { data, loading, error }] = useStartScanLibraryMutation({
 *   variables: {
 *   },
 * });
 */
export function useStartScanLibraryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<StartScanLibraryMutation, StartScanLibraryMutationVariables>) {
        return ApolloReactHooks.useMutation<StartScanLibraryMutation, StartScanLibraryMutationVariables>(StartScanLibraryDocument, baseOptions);
      }
export type StartScanLibraryMutationHookResult = ReturnType<typeof useStartScanLibraryMutation>;
export type StartScanLibraryMutationResult = ApolloReactCommon.MutationResult<StartScanLibraryMutation>;
export type StartScanLibraryMutationOptions = ApolloReactCommon.BaseMutationOptions<StartScanLibraryMutation, StartScanLibraryMutationVariables>;
export const StartFindNewEpisodesDocument = gql`
    mutation startFindNewEpisodes {
  result: startFindNewEpisodesJob {
    success
    message
  }
}
    `;
export type StartFindNewEpisodesMutationFn = ApolloReactCommon.MutationFunction<StartFindNewEpisodesMutation, StartFindNewEpisodesMutationVariables>;

/**
 * __useStartFindNewEpisodesMutation__
 *
 * To run a mutation, you first call `useStartFindNewEpisodesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStartFindNewEpisodesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [startFindNewEpisodesMutation, { data, loading, error }] = useStartFindNewEpisodesMutation({
 *   variables: {
 *   },
 * });
 */
export function useStartFindNewEpisodesMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<StartFindNewEpisodesMutation, StartFindNewEpisodesMutationVariables>) {
        return ApolloReactHooks.useMutation<StartFindNewEpisodesMutation, StartFindNewEpisodesMutationVariables>(StartFindNewEpisodesDocument, baseOptions);
      }
export type StartFindNewEpisodesMutationHookResult = ReturnType<typeof useStartFindNewEpisodesMutation>;
export type StartFindNewEpisodesMutationResult = ApolloReactCommon.MutationResult<StartFindNewEpisodesMutation>;
export type StartFindNewEpisodesMutationOptions = ApolloReactCommon.BaseMutationOptions<StartFindNewEpisodesMutation, StartFindNewEpisodesMutationVariables>;
export const StartDownloadMissingDocument = gql`
    mutation startDownloadMissing {
  result: startDownloadMissingJob {
    success
    message
  }
}
    `;
export type StartDownloadMissingMutationFn = ApolloReactCommon.MutationFunction<StartDownloadMissingMutation, StartDownloadMissingMutationVariables>;

/**
 * __useStartDownloadMissingMutation__
 *
 * To run a mutation, you first call `useStartDownloadMissingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStartDownloadMissingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [startDownloadMissingMutation, { data, loading, error }] = useStartDownloadMissingMutation({
 *   variables: {
 *   },
 * });
 */
export function useStartDownloadMissingMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<StartDownloadMissingMutation, StartDownloadMissingMutationVariables>) {
        return ApolloReactHooks.useMutation<StartDownloadMissingMutation, StartDownloadMissingMutationVariables>(StartDownloadMissingDocument, baseOptions);
      }
export type StartDownloadMissingMutationHookResult = ReturnType<typeof useStartDownloadMissingMutation>;
export type StartDownloadMissingMutationResult = ApolloReactCommon.MutationResult<StartDownloadMissingMutation>;
export type StartDownloadMissingMutationOptions = ApolloReactCommon.BaseMutationOptions<StartDownloadMissingMutation, StartDownloadMissingMutationVariables>;
export const DownloadMovieDocument = gql`
    mutation downloadMovie($movieId: Int!, $jackettResult: JackettInput!) {
  result: downloadMovie(movieId: $movieId, jackettResult: $jackettResult) {
    success
    message
  }
}
    `;
export type DownloadMovieMutationFn = ApolloReactCommon.MutationFunction<DownloadMovieMutation, DownloadMovieMutationVariables>;

/**
 * __useDownloadMovieMutation__
 *
 * To run a mutation, you first call `useDownloadMovieMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDownloadMovieMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [downloadMovieMutation, { data, loading, error }] = useDownloadMovieMutation({
 *   variables: {
 *      movieId: // value for 'movieId'
 *      jackettResult: // value for 'jackettResult'
 *   },
 * });
 */
export function useDownloadMovieMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DownloadMovieMutation, DownloadMovieMutationVariables>) {
        return ApolloReactHooks.useMutation<DownloadMovieMutation, DownloadMovieMutationVariables>(DownloadMovieDocument, baseOptions);
      }
export type DownloadMovieMutationHookResult = ReturnType<typeof useDownloadMovieMutation>;
export type DownloadMovieMutationResult = ApolloReactCommon.MutationResult<DownloadMovieMutation>;
export type DownloadMovieMutationOptions = ApolloReactCommon.BaseMutationOptions<DownloadMovieMutation, DownloadMovieMutationVariables>;
export const DownloadTvEpisodeDocument = gql`
    mutation downloadTVEpisode($episodeId: Int!, $jackettResult: JackettInput!) {
  result: downloadTVEpisode(episodeId: $episodeId, jackettResult: $jackettResult) {
    success
    message
  }
}
    `;
export type DownloadTvEpisodeMutationFn = ApolloReactCommon.MutationFunction<DownloadTvEpisodeMutation, DownloadTvEpisodeMutationVariables>;

/**
 * __useDownloadTvEpisodeMutation__
 *
 * To run a mutation, you first call `useDownloadTvEpisodeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDownloadTvEpisodeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [downloadTvEpisodeMutation, { data, loading, error }] = useDownloadTvEpisodeMutation({
 *   variables: {
 *      episodeId: // value for 'episodeId'
 *      jackettResult: // value for 'jackettResult'
 *   },
 * });
 */
export function useDownloadTvEpisodeMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DownloadTvEpisodeMutation, DownloadTvEpisodeMutationVariables>) {
        return ApolloReactHooks.useMutation<DownloadTvEpisodeMutation, DownloadTvEpisodeMutationVariables>(DownloadTvEpisodeDocument, baseOptions);
      }
export type DownloadTvEpisodeMutationHookResult = ReturnType<typeof useDownloadTvEpisodeMutation>;
export type DownloadTvEpisodeMutationResult = ApolloReactCommon.MutationResult<DownloadTvEpisodeMutation>;
export type DownloadTvEpisodeMutationOptions = ApolloReactCommon.BaseMutationOptions<DownloadTvEpisodeMutation, DownloadTvEpisodeMutationVariables>;
export const RemoveMovieDocument = gql`
    mutation removeMovie($tmdbId: Int!) {
  result: removeMovie(tmdbId: $tmdbId) {
    success
    message
  }
}
    `;
export type RemoveMovieMutationFn = ApolloReactCommon.MutationFunction<RemoveMovieMutation, RemoveMovieMutationVariables>;

/**
 * __useRemoveMovieMutation__
 *
 * To run a mutation, you first call `useRemoveMovieMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveMovieMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeMovieMutation, { data, loading, error }] = useRemoveMovieMutation({
 *   variables: {
 *      tmdbId: // value for 'tmdbId'
 *   },
 * });
 */
export function useRemoveMovieMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RemoveMovieMutation, RemoveMovieMutationVariables>) {
        return ApolloReactHooks.useMutation<RemoveMovieMutation, RemoveMovieMutationVariables>(RemoveMovieDocument, baseOptions);
      }
export type RemoveMovieMutationHookResult = ReturnType<typeof useRemoveMovieMutation>;
export type RemoveMovieMutationResult = ApolloReactCommon.MutationResult<RemoveMovieMutation>;
export type RemoveMovieMutationOptions = ApolloReactCommon.BaseMutationOptions<RemoveMovieMutation, RemoveMovieMutationVariables>;
export const RemoveTvShowDocument = gql`
    mutation removeTVShow($tmdbId: Int!) {
  result: removeTVShow(tmdbId: $tmdbId) {
    success
    message
  }
}
    `;
export type RemoveTvShowMutationFn = ApolloReactCommon.MutationFunction<RemoveTvShowMutation, RemoveTvShowMutationVariables>;

/**
 * __useRemoveTvShowMutation__
 *
 * To run a mutation, you first call `useRemoveTvShowMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveTvShowMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeTvShowMutation, { data, loading, error }] = useRemoveTvShowMutation({
 *   variables: {
 *      tmdbId: // value for 'tmdbId'
 *   },
 * });
 */
export function useRemoveTvShowMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RemoveTvShowMutation, RemoveTvShowMutationVariables>) {
        return ApolloReactHooks.useMutation<RemoveTvShowMutation, RemoveTvShowMutationVariables>(RemoveTvShowDocument, baseOptions);
      }
export type RemoveTvShowMutationHookResult = ReturnType<typeof useRemoveTvShowMutation>;
export type RemoveTvShowMutationResult = ApolloReactCommon.MutationResult<RemoveTvShowMutation>;
export type RemoveTvShowMutationOptions = ApolloReactCommon.BaseMutationOptions<RemoveTvShowMutation, RemoveTvShowMutationVariables>;
export const SaveQualityDocument = gql`
    mutation saveQuality($qualities: [QualityInput!]!) {
  result: saveQualityParams(qualities: $qualities) {
    success
    message
  }
}
    `;
export type SaveQualityMutationFn = ApolloReactCommon.MutationFunction<SaveQualityMutation, SaveQualityMutationVariables>;

/**
 * __useSaveQualityMutation__
 *
 * To run a mutation, you first call `useSaveQualityMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSaveQualityMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [saveQualityMutation, { data, loading, error }] = useSaveQualityMutation({
 *   variables: {
 *      qualities: // value for 'qualities'
 *   },
 * });
 */
export function useSaveQualityMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SaveQualityMutation, SaveQualityMutationVariables>) {
        return ApolloReactHooks.useMutation<SaveQualityMutation, SaveQualityMutationVariables>(SaveQualityDocument, baseOptions);
      }
export type SaveQualityMutationHookResult = ReturnType<typeof useSaveQualityMutation>;
export type SaveQualityMutationResult = ApolloReactCommon.MutationResult<SaveQualityMutation>;
export type SaveQualityMutationOptions = ApolloReactCommon.BaseMutationOptions<SaveQualityMutation, SaveQualityMutationVariables>;
export const SaveTagsDocument = gql`
    mutation saveTags($tags: [TagInput!]!) {
  result: saveTags(tags: $tags) {
    success
    message
  }
}
    `;
export type SaveTagsMutationFn = ApolloReactCommon.MutationFunction<SaveTagsMutation, SaveTagsMutationVariables>;

/**
 * __useSaveTagsMutation__
 *
 * To run a mutation, you first call `useSaveTagsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSaveTagsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [saveTagsMutation, { data, loading, error }] = useSaveTagsMutation({
 *   variables: {
 *      tags: // value for 'tags'
 *   },
 * });
 */
export function useSaveTagsMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SaveTagsMutation, SaveTagsMutationVariables>) {
        return ApolloReactHooks.useMutation<SaveTagsMutation, SaveTagsMutationVariables>(SaveTagsDocument, baseOptions);
      }
export type SaveTagsMutationHookResult = ReturnType<typeof useSaveTagsMutation>;
export type SaveTagsMutationResult = ApolloReactCommon.MutationResult<SaveTagsMutation>;
export type SaveTagsMutationOptions = ApolloReactCommon.BaseMutationOptions<SaveTagsMutation, SaveTagsMutationVariables>;
export const TrackMovieDocument = gql`
    mutation trackMovie($title: String!, $tmdbId: Int!) {
  movie: trackMovie(title: $title, tmdbId: $tmdbId) {
    id
  }
}
    `;
export type TrackMovieMutationFn = ApolloReactCommon.MutationFunction<TrackMovieMutation, TrackMovieMutationVariables>;

/**
 * __useTrackMovieMutation__
 *
 * To run a mutation, you first call `useTrackMovieMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTrackMovieMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [trackMovieMutation, { data, loading, error }] = useTrackMovieMutation({
 *   variables: {
 *      title: // value for 'title'
 *      tmdbId: // value for 'tmdbId'
 *   },
 * });
 */
export function useTrackMovieMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<TrackMovieMutation, TrackMovieMutationVariables>) {
        return ApolloReactHooks.useMutation<TrackMovieMutation, TrackMovieMutationVariables>(TrackMovieDocument, baseOptions);
      }
export type TrackMovieMutationHookResult = ReturnType<typeof useTrackMovieMutation>;
export type TrackMovieMutationResult = ApolloReactCommon.MutationResult<TrackMovieMutation>;
export type TrackMovieMutationOptions = ApolloReactCommon.BaseMutationOptions<TrackMovieMutation, TrackMovieMutationVariables>;
export const TrackTvShowDocument = gql`
    mutation trackTVShow($tmdbId: Int!, $seasonNumbers: [Int!]!) {
  tvShow: trackTVShow(tmdbId: $tmdbId, seasonNumbers: $seasonNumbers) {
    id
  }
}
    `;
export type TrackTvShowMutationFn = ApolloReactCommon.MutationFunction<TrackTvShowMutation, TrackTvShowMutationVariables>;

/**
 * __useTrackTvShowMutation__
 *
 * To run a mutation, you first call `useTrackTvShowMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTrackTvShowMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [trackTvShowMutation, { data, loading, error }] = useTrackTvShowMutation({
 *   variables: {
 *      tmdbId: // value for 'tmdbId'
 *      seasonNumbers: // value for 'seasonNumbers'
 *   },
 * });
 */
export function useTrackTvShowMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<TrackTvShowMutation, TrackTvShowMutationVariables>) {
        return ApolloReactHooks.useMutation<TrackTvShowMutation, TrackTvShowMutationVariables>(TrackTvShowDocument, baseOptions);
      }
export type TrackTvShowMutationHookResult = ReturnType<typeof useTrackTvShowMutation>;
export type TrackTvShowMutationResult = ApolloReactCommon.MutationResult<TrackTvShowMutation>;
export type TrackTvShowMutationOptions = ApolloReactCommon.BaseMutationOptions<TrackTvShowMutation, TrackTvShowMutationVariables>;
export const UpdateParamsDocument = gql`
    mutation updateParams($params: [UpdateParamsInput!]!) {
  result: updateParams(params: $params) {
    success
    message
  }
}
    `;
export type UpdateParamsMutationFn = ApolloReactCommon.MutationFunction<UpdateParamsMutation, UpdateParamsMutationVariables>;

/**
 * __useUpdateParamsMutation__
 *
 * To run a mutation, you first call `useUpdateParamsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateParamsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateParamsMutation, { data, loading, error }] = useUpdateParamsMutation({
 *   variables: {
 *      params: // value for 'params'
 *   },
 * });
 */
export function useUpdateParamsMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateParamsMutation, UpdateParamsMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateParamsMutation, UpdateParamsMutationVariables>(UpdateParamsDocument, baseOptions);
      }
export type UpdateParamsMutationHookResult = ReturnType<typeof useUpdateParamsMutation>;
export type UpdateParamsMutationResult = ApolloReactCommon.MutationResult<UpdateParamsMutation>;
export type UpdateParamsMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateParamsMutation, UpdateParamsMutationVariables>;
export const GetDiscoverDocument = gql`
    query getDiscover($entertainment: Entertainment, $originLanguage: String, $year: String, $score: Float, $genres: [Float!]) {
  results: discover(entertainment: $entertainment, originLanguage: $originLanguage, year: $year, score: $score, genres: $genres) {
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
    `;

/**
 * __useGetDiscoverQuery__
 *
 * To run a query within a React component, call `useGetDiscoverQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDiscoverQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDiscoverQuery({
 *   variables: {
 *      entertainment: // value for 'entertainment'
 *      originLanguage: // value for 'originLanguage'
 *      year: // value for 'year'
 *      score: // value for 'score'
 *      genres: // value for 'genres'
 *   },
 * });
 */
export function useGetDiscoverQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetDiscoverQuery, GetDiscoverQueryVariables>) {
        return ApolloReactHooks.useQuery<GetDiscoverQuery, GetDiscoverQueryVariables>(GetDiscoverDocument, baseOptions);
      }
export function useGetDiscoverLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetDiscoverQuery, GetDiscoverQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetDiscoverQuery, GetDiscoverQueryVariables>(GetDiscoverDocument, baseOptions);
        }
export type GetDiscoverQueryHookResult = ReturnType<typeof useGetDiscoverQuery>;
export type GetDiscoverLazyQueryHookResult = ReturnType<typeof useGetDiscoverLazyQuery>;
export type GetDiscoverQueryResult = ApolloReactCommon.QueryResult<GetDiscoverQuery, GetDiscoverQueryVariables>;
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

/**
 * __useGetDownloadingQuery__
 *
 * To run a query within a React component, call `useGetDownloadingQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDownloadingQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDownloadingQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetDownloadingQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetDownloadingQuery, GetDownloadingQueryVariables>) {
        return ApolloReactHooks.useQuery<GetDownloadingQuery, GetDownloadingQueryVariables>(GetDownloadingDocument, baseOptions);
      }
export function useGetDownloadingLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetDownloadingQuery, GetDownloadingQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetDownloadingQuery, GetDownloadingQueryVariables>(GetDownloadingDocument, baseOptions);
        }
export type GetDownloadingQueryHookResult = ReturnType<typeof useGetDownloadingQuery>;
export type GetDownloadingLazyQueryHookResult = ReturnType<typeof useGetDownloadingLazyQuery>;
export type GetDownloadingQueryResult = ApolloReactCommon.QueryResult<GetDownloadingQuery, GetDownloadingQueryVariables>;
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

/**
 * __useGetGenresQuery__
 *
 * To run a query within a React component, call `useGetGenresQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGenresQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGenresQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetGenresQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetGenresQuery, GetGenresQueryVariables>) {
        return ApolloReactHooks.useQuery<GetGenresQuery, GetGenresQueryVariables>(GetGenresDocument, baseOptions);
      }
export function useGetGenresLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetGenresQuery, GetGenresQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetGenresQuery, GetGenresQueryVariables>(GetGenresDocument, baseOptions);
        }
export type GetGenresQueryHookResult = ReturnType<typeof useGetGenresQuery>;
export type GetGenresLazyQueryHookResult = ReturnType<typeof useGetGenresLazyQuery>;
export type GetGenresQueryResult = ApolloReactCommon.QueryResult<GetGenresQuery, GetGenresQueryVariables>;
export const GetLanguagesDocument = gql`
    query getLanguages {
  languages: getLanguages {
    code
    language
  }
}
    `;

/**
 * __useGetLanguagesQuery__
 *
 * To run a query within a React component, call `useGetLanguagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLanguagesQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLanguagesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetLanguagesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetLanguagesQuery, GetLanguagesQueryVariables>) {
        return ApolloReactHooks.useQuery<GetLanguagesQuery, GetLanguagesQueryVariables>(GetLanguagesDocument, baseOptions);
      }
export function useGetLanguagesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetLanguagesQuery, GetLanguagesQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetLanguagesQuery, GetLanguagesQueryVariables>(GetLanguagesDocument, baseOptions);
        }
export type GetLanguagesQueryHookResult = ReturnType<typeof useGetLanguagesQuery>;
export type GetLanguagesLazyQueryHookResult = ReturnType<typeof useGetLanguagesLazyQuery>;
export type GetLanguagesQueryResult = ApolloReactCommon.QueryResult<GetLanguagesQuery, GetLanguagesQueryVariables>;
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

/**
 * __useGetLibraryMoviesQuery__
 *
 * To run a query within a React component, call `useGetLibraryMoviesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLibraryMoviesQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLibraryMoviesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetLibraryMoviesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetLibraryMoviesQuery, GetLibraryMoviesQueryVariables>) {
        return ApolloReactHooks.useQuery<GetLibraryMoviesQuery, GetLibraryMoviesQueryVariables>(GetLibraryMoviesDocument, baseOptions);
      }
export function useGetLibraryMoviesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetLibraryMoviesQuery, GetLibraryMoviesQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetLibraryMoviesQuery, GetLibraryMoviesQueryVariables>(GetLibraryMoviesDocument, baseOptions);
        }
export type GetLibraryMoviesQueryHookResult = ReturnType<typeof useGetLibraryMoviesQuery>;
export type GetLibraryMoviesLazyQueryHookResult = ReturnType<typeof useGetLibraryMoviesLazyQuery>;
export type GetLibraryMoviesQueryResult = ApolloReactCommon.QueryResult<GetLibraryMoviesQuery, GetLibraryMoviesQueryVariables>;
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

/**
 * __useGetLibraryTvShowsQuery__
 *
 * To run a query within a React component, call `useGetLibraryTvShowsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLibraryTvShowsQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLibraryTvShowsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetLibraryTvShowsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetLibraryTvShowsQuery, GetLibraryTvShowsQueryVariables>) {
        return ApolloReactHooks.useQuery<GetLibraryTvShowsQuery, GetLibraryTvShowsQueryVariables>(GetLibraryTvShowsDocument, baseOptions);
      }
export function useGetLibraryTvShowsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetLibraryTvShowsQuery, GetLibraryTvShowsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetLibraryTvShowsQuery, GetLibraryTvShowsQueryVariables>(GetLibraryTvShowsDocument, baseOptions);
        }
export type GetLibraryTvShowsQueryHookResult = ReturnType<typeof useGetLibraryTvShowsQuery>;
export type GetLibraryTvShowsLazyQueryHookResult = ReturnType<typeof useGetLibraryTvShowsLazyQuery>;
export type GetLibraryTvShowsQueryResult = ApolloReactCommon.QueryResult<GetLibraryTvShowsQuery, GetLibraryTvShowsQueryVariables>;
export const GetMissingDocument = gql`
    query getMissing {
  tvEpisodes: getMissingTVEpisodes {
    id
    seasonNumber
    episodeNumber
    releaseDate
    tvShow {
      id
      title
    }
  }
  movies: getMissingMovies {
    id
    title
    releaseDate
  }
}
    `;

/**
 * __useGetMissingQuery__
 *
 * To run a query within a React component, call `useGetMissingQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMissingQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMissingQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMissingQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetMissingQuery, GetMissingQueryVariables>) {
        return ApolloReactHooks.useQuery<GetMissingQuery, GetMissingQueryVariables>(GetMissingDocument, baseOptions);
      }
export function useGetMissingLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetMissingQuery, GetMissingQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetMissingQuery, GetMissingQueryVariables>(GetMissingDocument, baseOptions);
        }
export type GetMissingQueryHookResult = ReturnType<typeof useGetMissingQuery>;
export type GetMissingLazyQueryHookResult = ReturnType<typeof useGetMissingLazyQuery>;
export type GetMissingQueryResult = ApolloReactCommon.QueryResult<GetMissingQuery, GetMissingQueryVariables>;
export const GetParamsDocument = gql`
    query getParams {
  params: getParams {
    region
    language
    tmdb_api_key
    jackett_api_key
    max_movie_download_size
    max_tvshow_episode_download_size
  }
}
    `;

/**
 * __useGetParamsQuery__
 *
 * To run a query within a React component, call `useGetParamsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetParamsQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetParamsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetParamsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetParamsQuery, GetParamsQueryVariables>) {
        return ApolloReactHooks.useQuery<GetParamsQuery, GetParamsQueryVariables>(GetParamsDocument, baseOptions);
      }
export function useGetParamsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetParamsQuery, GetParamsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetParamsQuery, GetParamsQueryVariables>(GetParamsDocument, baseOptions);
        }
export type GetParamsQueryHookResult = ReturnType<typeof useGetParamsQuery>;
export type GetParamsLazyQueryHookResult = ReturnType<typeof useGetParamsLazyQuery>;
export type GetParamsQueryResult = ApolloReactCommon.QueryResult<GetParamsQuery, GetParamsQueryVariables>;
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

/**
 * __useGetPopularQuery__
 *
 * To run a query within a React component, call `useGetPopularQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPopularQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPopularQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPopularQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetPopularQuery, GetPopularQueryVariables>) {
        return ApolloReactHooks.useQuery<GetPopularQuery, GetPopularQueryVariables>(GetPopularDocument, baseOptions);
      }
export function useGetPopularLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetPopularQuery, GetPopularQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetPopularQuery, GetPopularQueryVariables>(GetPopularDocument, baseOptions);
        }
export type GetPopularQueryHookResult = ReturnType<typeof useGetPopularQuery>;
export type GetPopularLazyQueryHookResult = ReturnType<typeof useGetPopularLazyQuery>;
export type GetPopularQueryResult = ApolloReactCommon.QueryResult<GetPopularQuery, GetPopularQueryVariables>;
export const GetQualityDocument = gql`
    query getQuality {
  qualities: getQualityParams {
    id
    name
    match
    score
    updatedAt
    createdAt
  }
}
    `;

/**
 * __useGetQualityQuery__
 *
 * To run a query within a React component, call `useGetQualityQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetQualityQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetQualityQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetQualityQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetQualityQuery, GetQualityQueryVariables>) {
        return ApolloReactHooks.useQuery<GetQualityQuery, GetQualityQueryVariables>(GetQualityDocument, baseOptions);
      }
export function useGetQualityLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetQualityQuery, GetQualityQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetQualityQuery, GetQualityQueryVariables>(GetQualityDocument, baseOptions);
        }
export type GetQualityQueryHookResult = ReturnType<typeof useGetQualityQuery>;
export type GetQualityLazyQueryHookResult = ReturnType<typeof useGetQualityLazyQuery>;
export type GetQualityQueryResult = ApolloReactCommon.QueryResult<GetQualityQuery, GetQualityQueryVariables>;
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

/**
 * __useGetRecommendedQuery__
 *
 * To run a query within a React component, call `useGetRecommendedQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRecommendedQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRecommendedQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetRecommendedQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetRecommendedQuery, GetRecommendedQueryVariables>) {
        return ApolloReactHooks.useQuery<GetRecommendedQuery, GetRecommendedQueryVariables>(GetRecommendedDocument, baseOptions);
      }
export function useGetRecommendedLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetRecommendedQuery, GetRecommendedQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetRecommendedQuery, GetRecommendedQueryVariables>(GetRecommendedDocument, baseOptions);
        }
export type GetRecommendedQueryHookResult = ReturnType<typeof useGetRecommendedQuery>;
export type GetRecommendedLazyQueryHookResult = ReturnType<typeof useGetRecommendedLazyQuery>;
export type GetRecommendedQueryResult = ApolloReactCommon.QueryResult<GetRecommendedQuery, GetRecommendedQueryVariables>;
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

/**
 * __useGetTagsQuery__
 *
 * To run a query within a React component, call `useGetTagsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTagsQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTagsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetTagsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetTagsQuery, GetTagsQueryVariables>) {
        return ApolloReactHooks.useQuery<GetTagsQuery, GetTagsQueryVariables>(GetTagsDocument, baseOptions);
      }
export function useGetTagsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetTagsQuery, GetTagsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetTagsQuery, GetTagsQueryVariables>(GetTagsDocument, baseOptions);
        }
export type GetTagsQueryHookResult = ReturnType<typeof useGetTagsQuery>;
export type GetTagsLazyQueryHookResult = ReturnType<typeof useGetTagsLazyQuery>;
export type GetTagsQueryResult = ApolloReactCommon.QueryResult<GetTagsQuery, GetTagsQueryVariables>;
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

/**
 * __useGetTorrentStatusQuery__
 *
 * To run a query within a React component, call `useGetTorrentStatusQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTorrentStatusQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTorrentStatusQuery({
 *   variables: {
 *      torrents: // value for 'torrents'
 *   },
 * });
 */
export function useGetTorrentStatusQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetTorrentStatusQuery, GetTorrentStatusQueryVariables>) {
        return ApolloReactHooks.useQuery<GetTorrentStatusQuery, GetTorrentStatusQueryVariables>(GetTorrentStatusDocument, baseOptions);
      }
export function useGetTorrentStatusLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetTorrentStatusQuery, GetTorrentStatusQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetTorrentStatusQuery, GetTorrentStatusQueryVariables>(GetTorrentStatusDocument, baseOptions);
        }
export type GetTorrentStatusQueryHookResult = ReturnType<typeof useGetTorrentStatusQuery>;
export type GetTorrentStatusLazyQueryHookResult = ReturnType<typeof useGetTorrentStatusLazyQuery>;
export type GetTorrentStatusQueryResult = ApolloReactCommon.QueryResult<GetTorrentStatusQuery, GetTorrentStatusQueryVariables>;
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

/**
 * __useGetTvShowSeasonsQuery__
 *
 * To run a query within a React component, call `useGetTvShowSeasonsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTvShowSeasonsQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTvShowSeasonsQuery({
 *   variables: {
 *      tvShowTMDBId: // value for 'tvShowTMDBId'
 *   },
 * });
 */
export function useGetTvShowSeasonsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetTvShowSeasonsQuery, GetTvShowSeasonsQueryVariables>) {
        return ApolloReactHooks.useQuery<GetTvShowSeasonsQuery, GetTvShowSeasonsQueryVariables>(GetTvShowSeasonsDocument, baseOptions);
      }
export function useGetTvShowSeasonsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetTvShowSeasonsQuery, GetTvShowSeasonsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetTvShowSeasonsQuery, GetTvShowSeasonsQueryVariables>(GetTvShowSeasonsDocument, baseOptions);
        }
export type GetTvShowSeasonsQueryHookResult = ReturnType<typeof useGetTvShowSeasonsQuery>;
export type GetTvShowSeasonsLazyQueryHookResult = ReturnType<typeof useGetTvShowSeasonsLazyQuery>;
export type GetTvShowSeasonsQueryResult = ApolloReactCommon.QueryResult<GetTvShowSeasonsQuery, GetTvShowSeasonsQueryVariables>;
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

/**
 * __useSearchTorrentQuery__
 *
 * To run a query within a React component, call `useSearchTorrentQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchTorrentQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchTorrentQuery({
 *   variables: {
 *      query: // value for 'query'
 *   },
 * });
 */
export function useSearchTorrentQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SearchTorrentQuery, SearchTorrentQueryVariables>) {
        return ApolloReactHooks.useQuery<SearchTorrentQuery, SearchTorrentQueryVariables>(SearchTorrentDocument, baseOptions);
      }
export function useSearchTorrentLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchTorrentQuery, SearchTorrentQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<SearchTorrentQuery, SearchTorrentQueryVariables>(SearchTorrentDocument, baseOptions);
        }
export type SearchTorrentQueryHookResult = ReturnType<typeof useSearchTorrentQuery>;
export type SearchTorrentLazyQueryHookResult = ReturnType<typeof useSearchTorrentLazyQuery>;
export type SearchTorrentQueryResult = ApolloReactCommon.QueryResult<SearchTorrentQuery, SearchTorrentQueryVariables>;
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

/**
 * __useSearchQuery__
 *
 * To run a query within a React component, call `useSearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchQuery({
 *   variables: {
 *      query: // value for 'query'
 *   },
 * });
 */
export function useSearchQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SearchQuery, SearchQueryVariables>) {
        return ApolloReactHooks.useQuery<SearchQuery, SearchQueryVariables>(SearchDocument, baseOptions);
      }
export function useSearchLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchQuery, SearchQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<SearchQuery, SearchQueryVariables>(SearchDocument, baseOptions);
        }
export type SearchQueryHookResult = ReturnType<typeof useSearchQuery>;
export type SearchLazyQueryHookResult = ReturnType<typeof useSearchLazyQuery>;
export type SearchQueryResult = ApolloReactCommon.QueryResult<SearchQuery, SearchQueryVariables>;