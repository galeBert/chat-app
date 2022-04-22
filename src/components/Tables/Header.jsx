import './style.css'
import { SortAscendingIcon, FilterIcon, ClipboardCopyIcon } from '@heroicons/react/solid'
import SearchInput from 'components/SearchInput/SearchInput';
import NewDropDown from 'components/DropDown/DropdownResponsive';
import { debounce } from 'lodash'
import { useCallback, useState, useMemo } from 'react';
import { useHistory, useLocation } from "react-router";
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useModal } from 'hooks/useModal';
import Modal from 'components/Modal/Modal';

const defaultOptions = [
  { label: "Active", to: "#" },
  { label: "Email", to: "#" },
  { label: "Mobile Number", to: "#" },
  { label: "Banned", to: "#" },
  { label: "Date", to: "#" },
]

//isloading didnt work properly 
const Header = ({ title, setAllUser, onRefetch, onFilters, isLoading, isNotFound, props, filter, initialSearch, useMultipleFilter, ...rest }) => {
  const [modalOpen, setOpenModal] = useState(false)
  const modal = useModal()
  const location = useLocation();
  const history = useHistory();

  const [filterSearch, setFilterSearch] = useState([])
  //try using useState to handle loading but didnt find the best way to turn it off when the loading is over
  const [loading, setLoading] = useState(false)

  const handleSearchMutation = useCallback(
    (searchContent) => {
      const payload = { search: searchContent, page: 0 }

      if (typeof onRefetch === 'function') {
        onRefetch(payload)
      }
      if (!isLoading) setLoading(false)
    },
    [onRefetch, isLoading]
  )

  const handleChange = debounce((e) => {
    let value = e.target.value
    setLoading(true)
    handleSearchMutation(value)
    props.headerSearch(value)
    const queryParams = new URLSearchParams(location.search)

    if (queryParams.has('search')) {
      queryParams.delete('search')
      history.replace({
        search: queryParams.toString()
      })
    }
  }, 1000)

  const defaultOptionsSort = !props.noRating ? [
    {
      label: 'Date', onClick: null, child: [
        { label: 'oldest to newest', onClick: () => onRefetch({ sortBy: 'asc' }) },
        { label: 'newest to oldest', onClick: () => onRefetch({ sortBy: 'desc' }) }
      ]
    },
    {
      label: 'Rating', onClick: null, child: [
        { label: 'oldest to newest', onClick: () => onRefetch({ sortBy: 'rank_asc' }) },
        { label: 'newest to oldest', onClick: () => onRefetch({ sortBy: 'rank_desc' }) }
      ]
    },
    {
      label: 'Reset', onClick: () => onRefetch({ sortBy: '' })
    }
  ] : [
    {
      label: 'Date', onClick: null, child: [
        { label: 'oldest to newest', onClick: () => onRefetch({ sortBy: 'asc' }) },
        { label: 'newest to oldest', onClick: () => onRefetch({ sortBy: 'desc' }) }
      ]
    },
    {
      label: 'Reset', onClick: () => onRefetch({ sortBy: '' })
    }
  ]

  useEffect(() => {
    if (onFilters) onFilters(filterSearch)
  }, [filterSearch])

  //handle filter tidak memberi data sesuai filter
  const handleFilters = (filter, exported = false) => {
    let newFilter = []
    if (useMultipleFilter) {
      if (filterSearch.includes(filter)) {
        newFilter = filterSearch.filter(fill => fill !== filter)

      } else if (filter.to || filter.from) {
        const oldFilterTimestamp = filterSearch.filter(fill => fill.to || fill.from);
        if (oldFilterTimestamp.length) {
          const target = `${filter.to ? 'to' : 'from'}`;
          const updated = {
            ...oldFilterTimestamp[0],
            [target]: filter[target]
          }

          newFilter = [...newFilter, updated]
        } else newFilter = [...filterSearch, filter]
      } else {
        newFilter = [...filterSearch, filter]
      }
    } else {
      newFilter = [filter]
    }

    setFilterSearch(newFilter)
  }

  const options = useMemo(() => {
    return filter && filter.length ? filter.map(({ label, active, child, key }) => {
      return ({
        label,
        active,
        onClick: child ? null : () => handleFilters(key || label),
        isActive: filterSearch.find(fil => fil === label),
        child: child ? child.map(data => {
          return ({
            label: data.label,
            isActive: filterSearch.find(fil => fil === label),
            onClick: () => handleFilters(data.key || data.label),
            ...data
          })
        }) : null // should be active when filter contain label
      })
    }) : defaultOptions
  }, [filter, filterSearch])

  const handleExport = () => {

    if (filterSearch.some(data => data.from) || (title === "Admin Log" || title === "User Post")) {
      setOpenModal(true)
    } else {
      modal.actions.onSetSnackbar("Please Set Filter Timestamp to start exporting data")
    }

  }

  const exportDate = () => {
    if (filterSearch.some(data => data.from)) {
      const { from, to } = filterSearch.find(data => data.from)
      return `${from} until ${to}`
    }
    else return ''

  }
  return (
    <div className="header-container">
      <div className="flex justify-between">
        <div className='flex justify-center items-center'>
          <h1 className=''>{title}</h1>
          {!props.noAddNew && (props.addNewLink ? <Link to={props.addNewLink} className='bg-dark-600 rounded-lg text-white ml-2 p-1'>
            <span>Add</span>
          </Link> : <button onClick={props.addNewFunc} className='bg-dark-600 rounded-md text-white w-16'>
            Add
          </button>)}
        </div>
        <div>
          <div className="flex gap-5 items-center">
            {!props.noSearch && <SearchInput handleChange={handleChange} isNotFound={isNotFound} loading={isLoading} defaultValue={initialSearch} />}
            {!props.noSort && (
              <div className="">
                <NewDropDown
                  uniqueId="sort-header"
                  Icon={() => (
                    <div className="flex items-center">
                      <SortAscendingIcon className=" w-5 h-5" />
                      <span className="inline-block">Sort</span>
                    </div>
                  )}
                  options={defaultOptionsSort}
                />
              </div>
            )}
            {!props.noFilter && (
              <div className='filter'>
                <NewDropDown
                  uniqueId='filters-header'
                  Icon={() => (
                    <div className="flex items-center">
                      <FilterIcon className=" w-5 h-5" />
                      <span className="inline-block">Filter</span>
                    </div>
                  )}
                  options={options}
                />
              </div>
            )}
            {!props.noExport && (
              <div className="flex items-center cursor-pointer" onClick={handleExport}>
                <ClipboardCopyIcon className=" w-5 h-5" />
                <span className="inline-block">Export</span>
              </div>
            )}
            <Modal isModalOpen={modalOpen} setModalOpen={setOpenModal} onClick={() => onFilters(filterSearch, true)} >
              You're about to export a data from {exportDate()}
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;