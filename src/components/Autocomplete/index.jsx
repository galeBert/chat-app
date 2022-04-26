import React, { useMemo } from 'react';

import SearchInput from '../../components/SearchInput/SearchInput';

import { createAutocomplete } from '@algolia/autocomplete-core';
import { getAlgoliaResults } from '@algolia/autocomplete-preset-algolia';
import algoliasearch from 'algoliasearch/lite';
import { useHistory } from 'react-router-dom';

const searchClient = algoliasearch(
  'X3DO93E2H0',
  'a95bc441f3391e56089fb3abedecc24a'
);

export const Autocomplete = () => {
  const [autocompleteState, setAutocompleteState] = React.useState({});
  const history = useHistory();

  const autocomplete = useMemo(
    () =>
      createAutocomplete({
        onStateChange({ state }) {
          const totalPostsSearch =
            state?.collections[0]?.items.filter(
              (post) => post.__autocomplete_indexName === 'posts'
            ) || [];
          const totalUserssSearch =
            state?.collections[0]?.items.filter(
              (post) => post.__autocomplete_indexName === 'users'
            ) || [];
          const items = [
            {
              target: 'posts',
              total: totalPostsSearch.length,
              query: state.query,
              url: '/all-post',
            },
            {
              target: 'users',
              total: totalUserssSearch.length,
              query: state.query,
              url: '/user',
            },
          ];

          setAutocompleteState({
            ...state,
            collections: [
              {
                ...(state?.collections[0] || {}),
                items,
              },
            ],
          });
        },
        getSources() {
          return [
            // (3) Use an Algolia index source.
            {
              sourceId: 'autocomplete',
              getItemInputValue({ item }) {
                // console.log('query item: ', item);
                return item?.query;
              },
              getItems({ query }) {
                return getAlgoliaResults({
                  searchClient,
                  queries: [
                    {
                      indexName: 'posts',
                      query,
                    },
                    {
                      indexName: 'users',
                      query,
                    },
                  ],
                });
              },
              getItemUrl({ item }) {
                return item?.url;
              },
            },
          ];
        },
      }),
    []
  );

  return (
    <div className='aa-Autocomplete' {...autocomplete.getRootProps({})}>
      <SearchInput {...autocomplete.getInputProps({})} />
      <div
        className='aa-Panel'
        style={{ width: 380, position: 'absolute', zIndex: 100 }}
        {...autocomplete.getPanelProps({})}
      >
        {autocompleteState.isOpen &&
          autocompleteState.collections.map((collection, index) => {
            const { source, items } = collection;
            return (
              <div
                key={`source-${index}`}
                className='aa-Source bg-dark-100'
                style={{ borderRadius: 10, border: '1px solid black' }}
              >
                {items.length > 0 && (
                  <ul className='aa-List' {...autocomplete.getListProps()}>
                    {items.map((item) => (
                      <li
                        key={item.objectID}
                        className='aa-Item cursor-pointer p-2 relative'
                        onKeyDownCapture={() =>
                          history.push(`${item.url}?search=${item.query}`)
                        }
                        {...autocomplete.getItemProps({
                          item,
                          source,
                        })}
                      >
                        <div>
                          <div>search {item.query}</div>
                          <div>in {item.target}</div>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: 13,
                            position: 'absolute',
                            width: 20,
                            height: 20,
                            right: 10,
                            top: 5,
                            borderRadius: 100,
                            backgroundColor: 'red',
                          }}
                        >
                          {item.total}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};
