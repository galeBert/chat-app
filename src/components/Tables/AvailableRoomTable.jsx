import { useState } from 'react';

import { useMutation } from '@apollo/client';
import Blank from 'assets/blank_profile_picture.png';
import NewDropdown from 'components/DropDown/DropdownResponsive';
import { AvailableRoomSkeleton } from 'components/Skeleton/Skeleton';
import StatusContainer from 'components/StatusContainer';
import { DELETE_ROOM, UPDATE_ROOM } from 'graphql/mutation';
import { SEARCH_ROOMS } from 'graphql/query';
import { Link, useHistory } from 'react-router-dom';

const AvailableTable = ({ data, isLoading }) => {
  const [roomId, setRoomId] = useState('');
  const tableHead = [
    'Photo',
    'Name',
    'Description',
    'Start from',
    'Till date',
    'Status',
    'Action',
  ];
  const history = useHistory();

  const [changeRoomStatus, { loading }] = useMutation(UPDATE_ROOM, {
    update(cache, { data: newDataMutation }) {
      const { updateRoom } = newDataMutation;

      const { searchRoom } = cache.readQuery({
        query: SEARCH_ROOMS,
        variables: { name: '', perPage: 5, page: 0 },
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
  });

  const [deleteRoom, { loading: loadingDeleteRoom }] = useMutation(
    DELETE_ROOM,
    {
      update(cache, { data: newDataMutation }) {
        const { deleteRoom } = newDataMutation;

        const { searchRoom } = cache.readQuery({
          query: SEARCH_ROOMS,
          variables: { name: '', perPage: 5, page: 0 },
        });
        const newHits = searchRoom.hits.filter(
          (res) => res.id !== deleteRoom.id
        );
        cache.writeQuery({
          query: SEARCH_ROOMS,
          variables: { name: '', perPage: 5, page: 0 },
          data: {
            searchRoom: {
              ...searchRoom,
              hits: newHits,
            },
          },
        });
      },
    }
  );

  const handleChangeRoomStatus = (status, currentRoomId) => {
    setRoomId(currentRoomId);
    if (status === 'delete')
      deleteRoom({ variables: { roomId: currentRoomId } });
    else
      changeRoomStatus({
        variables: {
          roomId: currentRoomId,
          isDeactive: status === 'deactive',
          isDeleted: status === 'delete',
        },
      });
  };

  return (
    <table className='table-responsive w-full overflow-scroll h-4'>
      <thead>
        <tr>
          {tableHead.map((label, idx) => (
            <th key={idx} className='p-1.5'>
              {label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <AvailableRoomSkeleton />
        ) : (
          data &&
          data.length &&
          data.map(
            (
              {
                displayPicture,
                roomName,
                description,
                startingDate,
                tillDate,
                isDeactive,
                id,
              },
              idx
            ) => {
              return (
                <tr key={idx} className='h-full hover:bg-dark-300'>
                  <td className=''>
                    <div className='flex justify-center items-center h-full p-2 '>
                      <img
                        alt='display_picture'
                        className=' w-20 h-20 rounded-full object-cover'
                        src={displayPicture || Blank}
                      />
                    </div>
                  </td>

                  <td className='text-center'>
                    <Link to={`/available-room/${roomName}/${id}`}>
                      {roomName}
                    </Link>
                  </td>
                  <td className='text-center'>{description}</td>
                  <td className='text-center'>{startingDate}</td>
                  <td className='text-center'>{tillDate}</td>
                  <td className=''>
                    <div className='h-full text-center flex justify-center items-center'>
                      <StatusContainer
                        id={roomName}
                        loading={loading && roomId === id}
                      >
                        {isDeactive ? 'Deactive' : 'Active'}
                      </StatusContainer>
                    </div>
                  </td>
                  <td className='row-action'>
                    <NewDropdown
                      options={[
                        {
                          label: isDeactive ? 'Active' : 'Deactive',
                          onClick: () =>
                            handleChangeRoomStatus(
                              isDeactive ? 'active' : 'deactive',
                              id
                            ),
                        },
                        {
                          label: 'Edit',
                          onClick: () =>
                            history.push(`/available-room/edit/${id}`),
                        },
                        {
                          label: 'Delete',
                          onClick: () => handleChangeRoomStatus('delete', id),
                        },
                      ]}
                      uniqueId={idx}
                    />
                  </td>
                </tr>
              );
            }
          )
        )}
      </tbody>
    </table>
  );
};

export default AvailableTable;
