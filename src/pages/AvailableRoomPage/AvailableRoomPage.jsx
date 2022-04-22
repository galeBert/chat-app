import { useLazyQuery } from '@apollo/client';
import { useEffect } from 'react';
import Table from "components/Tables";

import { SEARCH_ROOMS } from 'graphql/query';

const AvailableRoomPage = () => {

  const [
    searchRooms,
    { data, refetch: onSearchRefetch, loading: isLoading, called }
  ] = useLazyQuery(SEARCH_ROOMS)

  useEffect(() => {

    if (called) {
      onSearchRefetch()

      return;
    }
    searchRooms({ variables: { name: '', perPage: 5, page: 0 } });
  }, [])

  return (
    <div>
      <Table
        type="Available Room"
        addNewLink='/available-room/add'
        isLoading={isLoading}
        noFilter
        noRating
        onRefetch={onSearchRefetch}
        data={data?.searchRoom.hits}
        pages={data?.searchRoom.nbPages - 1}
      />
    </div>
  );
}

export default AvailableRoomPage;