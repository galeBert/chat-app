import { useEffect, useMemo, useRef, useState } from 'react';

const Footer = ({
  pages = 0,
  onRefetch,
  currentLengthData,
  totalHits,
  props,
}) => {
  const _isMounted = useRef(false);
  const [totalOpened, setTotalOpened] = useState(currentLengthData);

  const [number, setNumber] = useState(0);
  const [paging, setPaging] = useState({ start: 0, limit: 5 });

  useEffect(() => {
    if (currentLengthData !== undefined && !_isMounted.current) {
      setTotalOpened(currentLengthData);

      _isMounted.current = true;
    }
  }, [currentLengthData]);

  const handleClick = (e) => {
    const value = e.target.innerText;
    if (Number(value) !== number + 1) {
      const newNumber = Number(value);
      setNumber(newNumber - 1);
      if (
        newNumber >= 5 &&
        (newNumber === paging.start || newNumber - paging.start <= 1)
      ) {
        setPaging({ start: paging.start - 5, limit: paging.limit - 5 });
      }

      if (newNumber % 5 === 0 && newNumber < pages) {
        setPaging({ start: newNumber, limit: newNumber + 5 });
      }
      if (typeof onRefetch === 'function') onRefetch({ page: newNumber - 1 });
    }
  };

  const handlePrevNext = (e) => {
    const value = e.target.innerText;
    let newPage = 0;
    if (value === 'Prev') {
      newPage = number - 1;
      setTotalOpened(Number(totalOpened) - Number(currentLengthData));
      if (number - paging.start === 0) {
        setPaging({ start: paging.start - 5, limit: paging.limit - 5 });
      }

      if (typeof onRefetch === 'function') onRefetch({ page: number - 1 });
    }
    if (value === 'Next') {
      newPage = number + 1;
      setTotalOpened(
        Number(totalOpened) +
          Number(
            totalHits - totalOpened > 5
              ? currentLengthData
              : totalHits - totalOpened
          )
      );
      if (newPage % 5 === 0 && newPage < pages) {
        setPaging({ start: newPage, limit: newPage + 5 });
      }

      if (typeof onRefetch === 'function') onRefetch({ page: number });
    }

    setNumber(newPage);
  };
  const range = useMemo(() => {
    const list = [];
    const start = 1;
    for (let i = start; i <= (pages === 0 ? pages + 1 : pages); i++) {
      list.push(i);
    }
    return list;
  }, [pages]);
  return (
    <div className='flex justify-between mt-5'>
      <div>
        <span>
          Showing {totalOpened} of {totalHits} entries
        </span>
      </div>
      {!props.noPagination && (
        <div>
          <div className='flex border-2 border-solid border-dark-9 rounded-lg'>
            <button disabled={number === 0} onClick={handlePrevNext}>
              <span className='text-typography-1 pt-1 pb-1 pl-2 pr-2'>
                Prev
              </span>
            </button>
            {range.slice(paging.start, paging.limit).map((data, idx) => {
              return (
                <button
                  key={idx}
                  className={`text-typography-1 border-l-2 border-solid border-dark-9 pt-1 pb-1 pl-2 pr-2 ${
                    !!(data === number + 1) && 'bg-brand-1'
                  }`}
                  onClick={handleClick}
                >
                  <h5 className='inline m-1 cursor-pointer'>{data}</h5>
                </button>
              );
            })}
            {!!(pages && pages - number >= 5) && (
              <button
                className='text-typography-1 border-l-2 border-r-2 border-solid border-dark-9 pt-1 pb-1 pl-2 pr-2'
                disabled
              >
                <span>...</span>
              </button>
            )}
            <button disabled={number >= pages} onClick={handlePrevNext}>
              <span className='text-typography-1 pt-1 pb-1 pl-2 pr-2'>
                Next
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Footer;
