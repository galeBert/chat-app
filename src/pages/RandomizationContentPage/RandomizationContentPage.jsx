import { useEffect, useMemo } from 'react';

import Table from '../../components/Tables';
import { GET_THEMES } from '../../graphql/query';

import { useLazyQuery } from '@apollo/client';
import { ChevronLeftIcon } from '@heroicons/react/solid';
import { get } from 'lodash';
import { useHistory } from 'react-router-dom';

const RandomizationContentPage = () => {
  const history = useHistory();
  const path = history.location.pathname.split('/')[2];

  const [searchTheme, { data, refetch: onSearchRefetch, loading, called }] =
    useLazyQuery(GET_THEMES, { fetchPolicy: 'no-cache' });

  // const { data, loading } = useQuery(GET_THEMES, { variables: { name: path }, fetchPolicy : 'no-cache' })
  // const searchThemes = get(data, 'searchThemes', [])[0]

  useEffect(() => {
    if (called) {
      onSearchRefetch({ name: path });

      return;
    }
    searchTheme({ variables: { name: path } });
  }, [called, onSearchRefetch, path, searchTheme]);

  // const adjective = searchThemes?.adjective.map(adj => ({ name: adj })) || []
  const handleClick = () => history.goBack();

  const colors = useMemo(
    () => get(data, 'searchThemes[0].colors') || [],
    [data]
  );
  const adjective = get(data, 'searchThemes[0].adjective') || [];
  const nouns = get(data, 'searchThemes[0].nouns') || [];
  const id = get(data, 'searchThemes[0].id') || [];
  //   const { searchThemes: searchThemeData } = data
  return (
    <div>
      <div className='flex items-center p-2'>
        <ChevronLeftIcon
          className='w-6 h-6 cursor-pointer'
          onClick={handleClick}
        />
        <h1>{path}</h1>
      </div>

      <div className='grid grid-cols-3 gap-3'>
        <Table
          data={colors}
          headerName='Colors'
          id={id}
          isLoading={loading}
          noAddNew
          noExport
          noFilter
          noPagination
          noSearch
          noSort
          onRefetch={onSearchRefetch}
          type='Randomization'
        />
        <Table
          data={adjective}
          headerName='Adjective'
          id={id}
          isLoading={loading}
          noAddNew
          noExport
          noFilter
          noPagination
          noSearch
          noSort
          onRefetch={onSearchRefetch}
          type='Randomization'
        />
        <Table
          data={nouns}
          headerName='Nouns'
          id={id}
          isLoading={loading}
          noAddNew
          noExport
          noFilter
          noPagination
          noSearch
          noSort
          onRefetch={onSearchRefetch}
          type='Randomization'
        />
      </div>
    </div>
  );
};

export default RandomizationContentPage;
