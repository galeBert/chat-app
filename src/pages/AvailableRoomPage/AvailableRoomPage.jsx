import { useEffect } from 'react';

import Table from '../../components/Tables';
import { SEARCH_ROOMS } from '../../graphql/query';

import { useLazyQuery } from '@apollo/client';

const AvailableRoomPage = () => {
  const [
    searchRooms,
    { data, refetch: onSearchRefetch, loading: isLoading, called },
  ] = useLazyQuery(SEARCH_ROOMS);

  useEffect(() => {
    if (called) {
      onSearchRefetch();

      return;
    }
    searchRooms({ variables: { name: '', perPage: 5, page: 0 } });
  }, []);

  return (
    <div>
      <Table
        addNewLink='/available-room/add'
        data={data?.searchRoom.hits}
        isLoading={isLoading}
        noFilter
        noRating
        onRefetch={onSearchRefetch}
        pages={data?.searchRoom.nbPages - 1}
        type='Available Room'
      />
    </div>
  );
};

export default AvailableRoomPage;
