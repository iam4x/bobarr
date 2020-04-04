import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { NextPageContext } from 'next';
import fetch from 'isomorphic-unfetch';

import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory';

import introspectionResult from './introspection-result';

export function createApolloClient(
  initialState: Record<string, any>,
  ctx?: NextPageContext
) {
  // The `ctx` (NextPageContext) will only be present on the server.
  // use it to extract auth headers (ctx.req) or similar.
  return new ApolloClient({
    ssrMode: Boolean(ctx),
    link: new HttpLink({
      uri: `http://localhost:4000/graphql`,
      fetch,
    }),
    cache: new InMemoryCache({
      fragmentMatcher: new IntrospectionFragmentMatcher({
        introspectionQueryResultData: introspectionResult,
      }),
    }).restore(initialState),
  });
}
