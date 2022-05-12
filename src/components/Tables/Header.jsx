import './style.css';

import { useCallback, useEffect, useMemo, useState } from 'react';

import NewDropDown from '../../components/DropDown/DropdownResponsive';
import Modal from '../../components/Modal/Modal';
import SearchInput from '../../components/SearchInput/SearchInput';
import { useModal } from '../../hooks/useModal';

import {
  ClipboardCopyIcon,
  FilterIcon,
  SortAscendingIcon,
} from '@heroicons/react/solid';
import { debounce } from 'lodash';
import { Link, useHistory, useLocation } from 'react-router-dom';

const defaultOptions = [
  { label: 'Active', to: '#' },
  { label: 'Email', to: '#' },
  { label: 'Mobile Number', to: '#' },
  { label: 'Banned', to: '#' },
  { label: 'Date', to: '#' },
];

//isloading didnt work properly
const Header = ({
  title,
  onRefetch,
  onFilters,
  isLoading,
  isNotFound,
  props,
  filter,
  initialSearch,
  useMultipleFilter,
}) => {
  const [modalOpen, setOpenModal] = useState(false);
  const modal = useModal();
  const location = useLocation();
  const history = useHistory();

  const [filterSearch, setFilterSearch] = useState([]);
  //try using useState to handle loading but didnt find the best way to turn it off when the loading is over
  // const [loading, setLoading] = useState(false);

  const handleSearchMutation = useCallback(
    (searchContent) => {
      const payload = { search: searchContent, page: 0 };

      if (typeof onRefetch === 'function') {
        onRefetch(payload);
      }
      // if (!isLoading) setLoading(false);
    },
    [onRefetch]
  );

  const handleChange = debounce((e) => {
    const value = e.target.value;
    // setLoading(true);
    handleSearchMutation(value);
    props.headerSearch(value);
    const queryParams = new URLSearchParams(location.search);

    if (queryParams.has('search')) {
      queryParams.delete('search');
      history.replace({
        search: queryParams.toString(),
      });
    }
  }, 1000);

  const withRating = [
    {
      label: 'Date',
      onClick: null,
      child: [
        {
          label: 'oldest to newest',
          onClick: () => onRefetch({ sortBy: 'asc' }),
        },
        {
          label: 'newest to oldest',
          onClick: () => onRefetch({ sortBy: 'desc' }),
        },
      ],
    },
    {
      label: 'Rating',
      onClick: null,
      child: [
        {
          label: 'oldest to newest',
          onClick: () => onRefetch({ sortBy: 'rank_asc' }),
        },
        {
          label: 'newest to oldest',
          onClick: () => onRefetch({ sortBy: 'rank_desc' }),
        },
      ],
    },
    {
      label: 'Reset',
      onClick: () => onRefetch({ sortBy: '' }),
    },
  ];
  const noRating = [
    {
      label: 'Date',
      onClick: null,
      child: [
        {
          label: 'oldest to newest',
          onClick: () => onRefetch({ sortBy: 'asc' }),
        },
        {
          label: 'newest to oldest',
          onClick: () => onRefetch({ sortBy: 'desc' }),
        },
      ],
    },
    {
      label: 'Reset',
      onClick: () => onRefetch({ sortBy: '' }),
    },
  ];
  const defaultOptionsSort = props.noRating ? noRating : withRating;

  useEffect(() => {
    if (onFilters) onFilters(filterSearch);
  }, [filterSearch, onFilters]);

  // handle filter tidak memberi data sesuai filter
  const handleFilters = useCallback(
    (filters) => {
      let newFilter = [];
      if (useMultipleFilter) {
        if (filterSearch.includes(filters)) {
          newFilter = filterSearch.filter((fill) => fill !== filters);
        } else if (filters.to || filters.from) {
          const oldFilterTimestamp = filterSearch.filter(
            (fill) => fill.to || fill.from
          );
          if (oldFilterTimestamp.length) {
            const target = `${filters.to ? 'to' : 'from'}`;
            const updated = {
              ...oldFilterTimestamp[0],
              [target]: filters[target],
            };

            newFilter = [...newFilter, updated];
          } else newFilter = [...filterSearch, filters];
        } else {
          newFilter = [...filterSearch, filters];
        }
      } else {
        newFilter = [filters];
      }

      setFilterSearch(newFilter);
    },
    [filterSearch, useMultipleFilter]
  );

  const options = useMemo(() => {
    return filter && filter.length
      ? filter.map(({ label, active, child, key }) => {
          return {
            label,
            active,
            onClick: child ? null : () => handleFilters(key || label),
            isActive: filterSearch.find((fil) => fil === label),
            child: child
              ? child.map((data) => {
                  return {
                    label: data.label,
                    isActive: filterSearch.find((fil) => fil === label),
                    onClick: () => handleFilters(data.key || data.label),
                    ...data,
                  };
                })
              : null, // should be active when filter contain label
          };
        })
      : defaultOptions;
  }, [filter, filterSearch, handleFilters]);

  const handleExport = () => {
    if (
      filterSearch.some((data) => data.from) ||
      title === 'Admin Log' ||
      title === 'User Post'
    ) {
      setOpenModal(true);
    } else {
      modal.actions.onSetSnackbar(
        'Please Set Filter Timestamp to start exporting data'
      );
    }
  };

  const exportDate = () => {
    let message = '';
    if (filterSearch.some((data) => data)) {
      const { from, to } = filterSearch.find((data) => data.from);
      return (message = `${from} until ${to}`);
    } else if (!filterSearch.some((data) => data)) message = '';
    return message;
  };
  return (
    <div className='header-container'>
      <div className='flex justify-between'>
        <div className='flex justify-center items-center'>
          <h1 className=''>{title}</h1>
          {!props.noAddNew &&
            (props.addNewLink ? (
              <Link
                className='bg-dark-6 rounded-lg text-typography-1 ml-2 p-1'
                to={props.addNewLink}
              >
                <span>Add</span>
              </Link>
            ) : (
              <button
                className='bg-dark-6 rounded-md text-typography-1 w-16'
                onClick={props.addNewFunc}
              >
                Add
              </button>
            ))}
        </div>
        <div>
          <div className='flex gap-5 items-center'>
            {!props.noSearch && (
              <SearchInput
                defaultValue={initialSearch}
                handleChange={handleChange}
                isNotFound={isNotFound}
                loading={isLoading}
              />
            )}
            {!props.noSort && (
              <div className=''>
                <NewDropDown
                  Icon={() => (
                    <div className='flex items-center'>
                      <SortAscendingIcon className=' w-5 h-5' />
                      <span className='inline-block'>Sort</span>
                    </div>
                  )}
                  options={defaultOptionsSort}
                  uniqueId='sort-header'
                />
              </div>
            )}
            {!props.noFilter && (
              <div className='filter'>
                <NewDropDown
                  Icon={() => (
                    <div className='flex items-center'>
                      <FilterIcon className=' w-5 h-5' />
                      <span className='inline-block'>Filter</span>
                    </div>
                  )}
                  options={options}
                  uniqueId='filters-header'
                />
              </div>
            )}
            {!props.noExport && (
              <div
                className='flex items-center cursor-pointer'
                onClickCapture={handleExport}
              >
                <ClipboardCopyIcon className=' w-5 h-5' />
                <span className='inline-block'>Export</span>
              </div>
            )}
            <Modal
              isModalOpen={modalOpen}
              onClick={() => onFilters(filterSearch, true)}
              setModalOpen={setOpenModal}
            >
              <p>You are about to export a data from {exportDate()}</p>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
