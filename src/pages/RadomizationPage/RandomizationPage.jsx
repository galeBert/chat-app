import { useState } from 'react';

import Button from '../../components/Button';
import NewDropDown from '../../components/DropDown/DropdownResponsive';
import {
  CREATE_NEW_THEMES,
  DELETE_THEME,
  UPDATE_THEMES,
} from '../../graphql/mutation';
import { GET_THEMES } from '../../graphql/query';
import { useModal } from '../../hooks/useModal';

import { useMutation, useQuery } from '@apollo/client';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { get } from 'lodash';
import { Link } from 'react-router-dom';

const RandomizationPage = () => {
  const modal = useModal();
  const [input, setInput] = useState('');
  const { data, loading } = useQuery(GET_THEMES, { variables: { name: '' } });
  const [updateThemes] = useMutation(UPDATE_THEMES, {
    update(cache, { data: { updateThemesById } }) {
      const getData = cache.readQuery({
        query: GET_THEMES,
        variables: { name: '' },
      });

      const newThemeData = getData?.searchThemes.map((theme) => {
        if (updateThemesById.id === theme.id) {
          return {
            ...theme,
            isActive: updateThemesById.isActive,
            isDeleted: updateThemesById.isDeleted,
          };
        }

        return theme;
      });

      cache.writeQuery({
        query: GET_THEMES,
        variables: { name: '' },
        data: {
          searchThemes: newThemeData,
        },
      });
    },
  });
  const searchThemes = get(data, 'searchThemes', []);
  const hasData = searchThemes.length;

  //handle add theme
  const [createNewTheme] = useMutation(CREATE_NEW_THEMES, {
    update(cache, { data: newTheme }) {
      const { createNewTheme: dataCreateNewTheme } = newTheme;

      const getData = cache.readQuery({
        query: GET_THEMES,
        variables: { name: '' },
      });
      const searchThemesData = { ...getData?.searchThemes };

      cache.writeQuery({
        query: GET_THEMES,
        variables: { name: '' },
        data: {
          searchThemes: [searchThemesData, dataCreateNewTheme],
        },
      });
    },
    onError(err) {
      console.log('err', err);
    },
  });
  const [deleteThemeById] = useMutation(DELETE_THEME, {
    update(cache, { data: newTheme }) {
      const { deleteThemeById: datadeleteThemeById } = newTheme;

      const getData = cache.readQuery({
        query: GET_THEMES,
        variables: { name: '' },
      });
      const searchThemesData = { ...getData?.searchThemes };

      cache.writeQuery({
        query: GET_THEMES,
        variables: { name: '' },
        data: {
          searchThemes: [searchThemesData, datadeleteThemeById],
        },
      });

      modal.actions.onSetSnackbar(datadeleteThemeById.message);
    },
    onError(err) {
      console.log('err', err);
    },
  });

  //end

  const handleSetStatusThemes = (status, themeId) => () => {
    const variables = { id: themeId };
    if (status === 'active') variables.isActive = true;
    else variables.isDeleted = true;

    updateThemes({ variables });
  };

  const handleAddNewTheme = () => {
    createNewTheme({
      variables: { name: input, colors: [], adjective: [], nouns: [] },
    });
  };
  const handleDeleteTheme = (action, id) => {
    if (action === 'delete') deleteThemeById({ variables: { id } });
  };
  const activeThemeCount =
    hasData && searchThemes.filter((docs) => docs.isActive === true).length;
  return (
    <div className='w-full bg-dark-1 p-4'>
      <div className='mb-8'>
        <h1 className='p-2'>Select Theme</h1>
        <div className='flex gap-5 items-center'>
          <div className='relative w-96'>
            <input
              className='bg-none pl-2 w-full ml-2 border-2 border-solid border-dark-9 h-10 rounded-md'
              onChange={(e) => setInput(e.target.value)}
              placeholder='Enter Name...'
            />
            <button
              className='absolute right-0 top-2 w-24 bg-dark-6 rounded-sm'
              disabled={!input.length}
              onClick={handleAddNewTheme}
            >
              <span>Add New</span>
            </button>
          </div>
          <span>Active Theme {activeThemeCount}</span>
        </div>
      </div>

      <div className='grid grid-cols-4 gap-5'>
        {loading && (
          <div className='w-full max-w-sm h-44 border-2 border-solid border-dark-9 rounded-md flex justify-between flex-col p-2 hover:bg-dark-6 m-2 skeleton' />
        )}
        {!loading &&
          hasData &&
          searchThemes.map((theme, key) => {
            return (
              <div
                key={key}
                className='w-full max-w-sm h-44 border-2 border-solid border-dark-9 rounded-md flex justify-between flex-col p-2 hover:bg-dark-6 m-2'
              >
                {theme.isActive && (
                  <div className='absolute w-4 h-4 text-green-300'>
                    <CheckCircleIcon />
                  </div>
                )}

                <div className='flex justify-end'>
                  <div className=' w-4'>
                    <NewDropDown
                      options={[
                        { label: 'Rename', onClick: () => console.log('hi') },
                        {
                          label: 'Delete',
                          onClick: () => handleDeleteTheme('delete', theme.id),
                        },
                      ]}
                      uniqueId='1'
                    />
                  </div>
                </div>
                <Link
                  className=' text-center flex items-center justify-center w-full h-full'
                  to={`/randomization/${theme.name}`}
                >
                  <div className='body '>
                    <h1>{theme.name}</h1>
                  </div>
                </Link>

                <div className='flex gap-2 justify-center -mb-3'>
                  <Button
                    disabled={theme.isActive}
                    onClick={handleSetStatusThemes('active', theme.id)}
                  >
                    Active
                  </Button>
                  <Button
                    disabled={theme.isDeleted}
                    onClick={handleSetStatusThemes('deleted', theme.id)}
                  >
                    Disabled
                  </Button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default RandomizationPage;
