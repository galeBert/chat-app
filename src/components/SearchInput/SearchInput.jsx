import './SearchInput.css';

import { ExclamationCircleIcon } from '@heroicons/react/outline';
import { SearchIcon } from '@heroicons/react/solid';

const SearchInput = ({
  handleChange,
  isNotFound = false,
  loading = false,
  ...rest
}) => {
  return (
    <div className='relative'>
      <SearchIcon
        className='absolute w-5 h-5  left-4 text-gray-600'
        style={{ top: 9 }}
      />
      <input
        className='input-skin'
        onChange={handleChange}
        placeholder='Search here...'
        {...rest}
      />
      <div className='absolute right-2 top-3'>
        {loading && <div className='loading w-4 h-4' />}
      </div>
      {isNotFound && (
        <div className='absolute w-full bg-red-100 top-11 text-center '>
          <ExclamationCircleIcon className='w-6 h-6 inline mr-2' />
          <span>Not Found</span>
        </div>
      )}
    </div>
  );
};

export default SearchInput;
