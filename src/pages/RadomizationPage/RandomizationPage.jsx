import { useMutation, useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { get } from 'lodash'

import Button from 'components/Button';
import NewDropDown from 'components/DropDown/DropdownResponsive';

import { GET_THEMES } from "graphql/query";
import { CREATE_NEW_THEMES, DELETE_THEME, UPDATE_THEMES } from "graphql/mutation";

import './RandomizationPage.css';
import { useState } from 'react';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { useModal } from 'hooks/useModal';

const RandomizationPage = () => {
  const modal = useModal()
  const [input, setInput] = useState('')
  const { data, loading } = useQuery(GET_THEMES, { variables: { name: '' } })
  const [updateThemes] = useMutation(UPDATE_THEMES, {
    update(cache, { data: { updateThemesById } }) {
      const getData = cache.readQuery({
        query: GET_THEMES,
        variables: { name: '' }
      });

      const newThemeData = getData?.searchThemes.map((theme) => {
        if (updateThemesById.id === theme.id) {
          return {
            ...theme,
            isActive: updateThemesById.isActive,
            isDeleted: updateThemesById.isDeleted
          }
        }

        return theme
      })

      cache.writeQuery({
        query: GET_THEMES,
        variables: { name: '' },
        data: {
          searchThemes: newThemeData
        }
      })
    }
  })
  const searchThemes = get(data, 'searchThemes', [])
  const hasData = searchThemes.length


  //handle add theme
  const [createNewTheme] = useMutation(CREATE_NEW_THEMES, {
    update(cache, { data: newTheme }) {
      const { createNewTheme: dataCreateNewTheme } = newTheme;

      const getData = cache.readQuery({
        query: GET_THEMES,
        variables: { name: '' }
      });

      cache.writeQuery({
        query: GET_THEMES,
        variables: { name: '' },
        data: {
          searchThemes: [...getData?.searchThemes, dataCreateNewTheme]
        }
      });
    }, onError(err) {
      console.log("err", err);
    }
  })
  const [deleteThemeById] = useMutation(DELETE_THEME, {
    update(cache, { data: newTheme }) {
      const { deleteThemeById: datadeleteThemeById } = newTheme;

      const getData = cache.readQuery({
        query: GET_THEMES,
        variables: { name: '' }
      });

      cache.writeQuery({
        query: GET_THEMES,
        variables: { name: '' },
        data: {
          searchThemes: [...getData?.searchThemes, datadeleteThemeById]
        }
      });

      modal.actions.onSetSnackbar(datadeleteThemeById.message)
    }, onError(err) {
      console.log("err", err);
    }
  })

  //end

  const handleSetStatusThemes = (status, themeId) => () => {
    const variables = { id: themeId }
    if (status === 'active') variables.isActive = true
    else variables.isDeleted = true

    updateThemes({ variables })
  }

  const handleAddNewTheme = () => {
    createNewTheme({ variables: { name: input, colors: [], adjective: [], nouns: [] } })
  }
  const handleDeleteTheme = (action, id) => {
    if (action === 'delete') deleteThemeById({ variables: { id } })
  }
  const activeThemeCount = hasData && searchThemes.filter(data => data.isActive === true).length
  return (
    <div className="randomization-container p-4">
      <div className='mb-8'>
        <h1 className='p-2'>Select Theme</h1>
        <div className='flex gap-5 items-center'>
          <div className='relative w-96'>
            <input onChange={(e) => setInput(e.target.value)} placeholder='Enter Name...' className='addnew-input' />
            <button onClick={handleAddNewTheme} disabled={!input.length} className='addnew-button'><span>Add New</span></button>
          </div>
          <span>Active Theme {activeThemeCount}</span>
        </div>
      </div>

      <div className='grid grid-cols-4 gap-5'>
        {loading && (
          <div className='theme-card skeleton' />
        )}
        {!loading && hasData && searchThemes.map((theme) => {
          return (
            <div className='theme-card '>
              {theme.isActive && <div className='absolute w-4 h-4 text-green-300'><CheckCircleIcon /></div>}

              <div className="header">
                <div className=' w-4'>
                  <NewDropDown
                    uniqueId={'1'}
                    options={[
                      { label: 'Rename', onClick: () => console.log("hi") },
                      { label: 'Delete', onClick: () => handleDeleteTheme("delete", theme.id) }
                    ]}
                  />
                </div>

              </div>
              <Link to={`/randomization/${theme.name}`} className=' text-center flex items-center justify-center w-full h-full'>
                <div className="body ">
                  <h1>{theme.name}</h1>

                </div>
              </Link>

              <div className="footer">
                <Button
                  onClick={handleSetStatusThemes('active', theme.id)}
                  disabled={theme.isActive}>
                  Active
                </Button>
                <Button
                  onClick={handleSetStatusThemes('deleted', theme.id)}
                  disabled={theme.isDeleted}>
                  Disabled
                </Button>
              </div>
            </div>
          )
        })}
      </div>

    </div>
  );
}

export default RandomizationPage;