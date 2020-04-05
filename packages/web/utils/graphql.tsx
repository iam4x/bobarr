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
  BigInt: any;
  DateTime: any;
};



export enum DownloadableMediaState {
  Missing = 'MISSING',
  Downloading = 'DOWNLOADING',
  Downloaded = 'DOWNLOADED',
  Processed = 'PROCESSED'
}

export type EnrichedMovie = {
   __typename?: 'EnrichedMovie';
  id: Scalars['Float'];
  tmdbId: Scalars['Float'];
  title: Scalars['String'];
  state: DownloadableMediaState;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  posterPath?: Maybe<Scalars['String']>;
  voteAverage: Scalars['Float'];
  releaseDate: Scalars['String'];
};

export type GraphQlCommonResponse = {
   __typename?: 'GraphQLCommonResponse';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
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
  trackMovie: Movie;
  removeMovie: GraphQlCommonResponse;
};


export type MutationTrackMovieArgs = {
  tmdbId: Scalars['Int'];
  title: Scalars['String'];
};


export type MutationRemoveMovieArgs = {
  tmdbId: Scalars['Int'];
};

export type ParamsHash = {
   __typename?: 'ParamsHash';
  language: Scalars['String'];
  region: Scalars['String'];
};

export type Query = {
   __typename?: 'Query';
  getParams: ParamsHash;
  search: TmdbSearchResults;
  getPopular: TmdbSearchResults;
  getTorrentStatus: TorrentStatus;
  getMovies: Array<EnrichedMovie>;
};


export type QuerySearchArgs = {
  query: Scalars['String'];
};


export type QueryGetTorrentStatusArgs = {
  resourceType: Scalars['String'];
  resourceId: Scalars['Int'];
};

export type TmdbSearchResult = {
   __typename?: 'TMDBSearchResult';
  id: Scalars['Float'];
  tmdbId: Scalars['Float'];
  title: Scalars['String'];
  voteAverage: Scalars['Float'];
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
  percentDone: Scalars['Float'];
  rateDownload: Scalars['Int'];
  rateUpload: Scalars['Int'];
  uploadRatio: Scalars['Float'];
  uploadedEver: Scalars['BigInt'];
  totalSize: Scalars['BigInt'];
  status: Scalars['Int'];
};

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

export type TrackMovieMutationVariables = {
  title: Scalars['String'];
  tmdbId: Scalars['Int'];
};


export type TrackMovieMutation = (
  { __typename?: 'Mutation' }
  & { trackMovie: (
    { __typename?: 'Movie' }
    & Pick<Movie, 'id'>
  ) }
);

export type GetLibraryMoviesQueryVariables = {};


export type GetLibraryMoviesQuery = (
  { __typename?: 'Query' }
  & { movies: Array<(
    { __typename?: 'EnrichedMovie' }
    & Pick<EnrichedMovie, 'id' | 'tmdbId' | 'title' | 'state' | 'posterPath' | 'voteAverage' | 'releaseDate' | 'createdAt' | 'updatedAt'>
  )> }
);

export type GetParamsQueryVariables = {};


export type GetParamsQuery = (
  { __typename?: 'Query' }
  & { params: (
    { __typename?: 'ParamsHash' }
    & Pick<ParamsHash, 'language' | 'region'>
  ) }
);

export type GetPopularQueryVariables = {};


export type GetPopularQuery = (
  { __typename?: 'Query' }
  & { results: (
    { __typename?: 'TMDBSearchResults' }
    & { movies: Array<(
      { __typename?: 'TMDBSearchResult' }
      & Pick<TmdbSearchResult, 'id' | 'tmdbId' | 'title' | 'releaseDate' | 'posterPath' | 'voteAverage'>
    )>, tvShows: Array<(
      { __typename?: 'TMDBSearchResult' }
      & Pick<TmdbSearchResult, 'id' | 'tmdbId' | 'title' | 'releaseDate' | 'posterPath' | 'voteAverage'>
    )> }
  ) }
);

export type GetTorrentStatusQueryVariables = {
  resourceId: Scalars['Int'];
  resourceType: Scalars['String'];
};


export type GetTorrentStatusQuery = (
  { __typename?: 'Query' }
  & { torrent: (
    { __typename?: 'TorrentStatus' }
    & Pick<TorrentStatus, 'id' | 'percentDone' | 'rateDownload' | 'rateUpload' | 'uploadRatio' | 'uploadedEver' | 'totalSize' | 'status'>
  ) }
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
      & Pick<TmdbSearchResult, 'id' | 'tmdbId' | 'title' | 'releaseDate' | 'posterPath' | 'voteAverage'>
    )>, tvShows: Array<(
      { __typename?: 'TMDBSearchResult' }
      & Pick<TmdbSearchResult, 'id' | 'tmdbId' | 'title' | 'releaseDate' | 'posterPath' | 'voteAverage'>
    )> }
  ) }
);


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
export const TrackMovieDocument = gql`
    mutation trackMovie($title: String!, $tmdbId: Int!) {
  trackMovie(title: $title, tmdbId: $tmdbId) {
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
export const GetLibraryMoviesDocument = gql`
    query getLibraryMovies {
  movies: getMovies {
    id
    tmdbId
    title
    state
    posterPath
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
export const GetParamsDocument = gql`
    query getParams {
  params: getParams {
    language
    region
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
      voteAverage
    }
    tvShows {
      id
      tmdbId
      title
      releaseDate
      posterPath
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
export const GetTorrentStatusDocument = gql`
    query getTorrentStatus($resourceId: Int!, $resourceType: String!) {
  torrent: getTorrentStatus(resourceId: $resourceId, resourceType: $resourceType) {
    id
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
 *      resourceId: // value for 'resourceId'
 *      resourceType: // value for 'resourceType'
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
export const SearchDocument = gql`
    query search($query: String!) {
  results: search(query: $query) {
    movies {
      id
      tmdbId
      title
      releaseDate
      posterPath
      voteAverage
    }
    tvShows {
      id
      tmdbId
      title
      releaseDate
      posterPath
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