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
};

export type Query = {
   __typename?: 'Query';
  getParams: ParamsHash;
  search: TmdbSearchResults;
  getPopular: TmdbSearchResults;
  getMovies: Array<EnrichedMovie>;
};


export type QuerySearchArgs = {
  query: Scalars['String'];
};

export type ParamsHash = {
   __typename?: 'ParamsHash';
  language: Scalars['String'];
  region: Scalars['String'];
};

export type TmdbSearchResults = {
   __typename?: 'TMDBSearchResults';
  movies: Array<TmdbSearchResult>;
  tvShows: Array<TmdbSearchResult>;
};

export type TmdbSearchResult = {
   __typename?: 'TMDBSearchResult';
  id: Scalars['Float'];
  title: Scalars['String'];
  releaseDate: Scalars['String'];
  posterPath: Scalars['String'];
  voteAverage: Scalars['Float'];
};

export type EnrichedMovie = {
   __typename?: 'EnrichedMovie';
  id: Scalars['Float'];
  tmdbId: Scalars['Float'];
  title: Scalars['String'];
  state: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  posterPath?: Maybe<Scalars['String']>;
  voteAverage: Scalars['Float'];
  releaseDate: Scalars['String'];
};


export type Mutation = {
   __typename?: 'Mutation';
  trackMovie: Movie;
};


export type MutationTrackMovieArgs = {
  tmdbId: Scalars['Int'];
  title: Scalars['String'];
};

export type Movie = {
   __typename?: 'Movie';
  id: Scalars['Float'];
  tmdbId: Scalars['Float'];
  title: Scalars['String'];
  state: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

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
  & { getMovies: Array<(
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
      & Pick<TmdbSearchResult, 'id' | 'title' | 'releaseDate' | 'posterPath' | 'voteAverage'>
    )>, tvShows: Array<(
      { __typename?: 'TMDBSearchResult' }
      & Pick<TmdbSearchResult, 'id' | 'title' | 'releaseDate' | 'posterPath' | 'voteAverage'>
    )> }
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
      & Pick<TmdbSearchResult, 'id' | 'title' | 'releaseDate' | 'posterPath' | 'voteAverage'>
    )>, tvShows: Array<(
      { __typename?: 'TMDBSearchResult' }
      & Pick<TmdbSearchResult, 'id' | 'title' | 'releaseDate' | 'posterPath' | 'voteAverage'>
    )> }
  ) }
);


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
  getMovies {
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
      title
      releaseDate
      posterPath
      voteAverage
    }
    tvShows {
      id
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
export const SearchDocument = gql`
    query search($query: String!) {
  results: search(query: $query) {
    movies {
      id
      title
      releaseDate
      posterPath
      voteAverage
    }
    tvShows {
      id
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