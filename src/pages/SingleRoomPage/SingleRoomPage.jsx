import './SingleRoomPage.css';

import { useEffect } from 'react';

import RoomDetailCard from '../../components/RoomDetailCard';
import Table from '../../components/Tables';
import { SEARCH_POST, UPDATE_ROOM } from '../../graphql/mutation';
import { SEARCH_ROOMS } from '../../graphql/query';

import { useLazyQuery, useMutation } from '@apollo/client';

const SingleRoomPage = (props) => {
  const roomId = props.match.params.id;
  const [getRoomDetail, { data: dataRoom, loading }] =
    useLazyQuery(SEARCH_ROOMS);

  const [searchPost, { data }] = useLazyQuery(SEARCH_POST);

  useEffect(() => {
    const fetchRoomDetail = () => {
      getRoomDetail({ variables: { search: roomId } });
    };
    searchPost({
      variables: {
        search: roomId,
        perPage: 20,
        page: 0,
        sortBy: 'desc',
        filters: { owner: '' },
      },
    });
    // const fetchPostDetail = () => {
    //     if (calledPost) refetchPosts()
    //     getPosts({ variables: { search: "", location: "", filters: { owner: username } } })
    // }

    fetchRoomDetail();
    // fetchPostDetail();
  }, [roomId, getRoomDetail, searchPost]);

  const [changeRoomStatus, { loading: loadingChangeRoom }] = useMutation(
    UPDATE_ROOM,
    {
      update(cache, { data: newDataMutation }) {
        const { updateRoom } = newDataMutation;

        const { searchRoom } = cache.readQuery({
          query: SEARCH_ROOMS,
          variables: { search: roomId },
        });

        const newHits = searchRoom.hits.map((res) => {
          if (res.id === updateRoom.id) {
            return {
              isDeactive: updateRoom.isDeactive,
              ...res,
            };
          }

          return res;
        });

        cache.writeQuery({
          query: SEARCH_ROOMS,
          data: {
            searchRoom: {
              hits: newHits,
              ...searchRoom,
            },
          },
        });
      },
    }
  );

  const singleRoom = dataRoom?.searchRoom?.hits.filter(
    (docs) => docs.id === roomId
  )[0];

  return (
    <div>
      <div className='mb-5'>
        <RoomDetailCard
          action={changeRoomStatus}
          data={singleRoom}
          loading={loading}
          statusLoading={loadingChangeRoom}
          title='Room Detail'
        />
      </div>
      <Table
        data={data?.searchPosts.hits}
        noAddNew
        pages={data?.searchPosts.nbPages}
        type='All Post'
      />
    </div>
  );
};

export default SingleRoomPage;
