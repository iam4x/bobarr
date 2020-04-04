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


export type Movie = {
   __typename?: 'Movie';
  id: Scalars['Float'];
  tmdbId: Scalars['Float'];
  title: Scalars['String'];
  state: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type Mutation = {
   __typename?: 'Mutation';
  trackMovie: Movie;
};


export type MutationTrackMovieArgs = {
  tmdbId: Scalars['Int'];
  title: Scalars['String'];
};

export type Query = {
   __typename?: 'Query';
  getMovies: Array<Movie>;
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