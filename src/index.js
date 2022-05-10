import './styles/globals.css';

import React from 'react';
import ReactDOM from 'react-dom';

import { onRefreshToken } from '../src/functions/auth';

import App from './App';

// Apollo
import { ApolloProvider } from '@apollo/client';
import {
  ApolloClient,
  ApolloLink,
  concat,
  HttpLink,
  InMemoryCache,
} from '@apollo/client/core';
import { onError } from '@apollo/client/link/error';

const httpUrl =
  'https://asia-southeast2-insvire-curious-app.cloudfunctions.net/admin';
// const httpUrl = 'http://localhost:5000/insvire-curious-app/asia-southeast2/admin';

const httpLink = ApolloLink.from([
  new ApolloLink((operation, forward) => {
    const token = localStorage.token;
    if (token) {
      operation.setContext({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return forward(operation);
  }),
  new HttpLink({ uri: httpUrl }),
]);

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      switch (err.extensions.code) {
        case 'UNAUTHENTICATED':
          // error code is set to UNAUTHENTICATED
          if (err.message.includes('Firebase ID token has expired')) {
            console.log(err.message);
            onRefreshToken();
          }
          break;
        default:
          console.log(err.extensions);
      }
    }
  }
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
    // if you would also like to retry automatically on
    // network errors, we recommend that you use
    // apollo-link-retry
  }
});

const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          searchPosts: {
            // Don't cache separate results based on
            // any of this field's arguments.
            keyArgs: [
              'useExport',
              'filters',
              'page',
              'hasReported',
              'media',
              'owner',
              'search',
            ],
            // Concatenate the incoming list items with
            // the existing list items.
            merge(_, incoming) {
              return incoming;
            },
          },
          searchUser: {
            // Don't cache separate results based on
            // any of this field's arguments.
            keyArgs: ['useExport', 'search'],
            // keyArgs: false,
            // Concatenate the incoming list items with
            // the existing list items.
            merge(_, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  link: concat(errorLink, httpLink),
  defaultOptions: {
    query: { fetchPolicy: 'cache-first' },
    mutate: { fetchPolicy: 'network-only' },
  },
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
