import Blank from '../assets/blank_profile_picture.png';

import Dropdown from './DropDown/DropdownResponsive';
import Media from './Tables/Media';
import StatusContainer from './StatusContainer';

import { ChevronLeftIcon } from '@heroicons/react/outline';
import { useHistory } from 'react-router-dom';

const RoomDetailCard = ({ data, title, post, ...props }) => {
  const history = useHistory();
  const RoomList = [
    { name: 'Name', data: data?.roomName || '-' },
    { name: 'Center Location', data: 'Bandung' || '-' },
    { name: 'Start Date', data: data?.startingDate || '-' },
    { name: 'Coverage Radius', data: '10KM' || '-' },
    { name: 'End Date', data: data?.tillDate || '-' },
    { name: 'Total Post', data: data?.totalPost || '0' },
  ];

  const caption = post?.caption && JSON.parse(post.caption).markdownContent;

  // const actionVariabels = data?.__typename === "Room" ? [
  //     { label: 'Active', onClick: () => props.action({ variables: { roomId: currentRoomId, isDeactive: status === 'deactive' ? true : false, isDeleted: status === 'delete' ? true : false } }) }

  // ] : [
  //     { label: 'Active', onClick: () => props.action({ variables: { status: 'active', username: data?.username } }, true) },
  //     { label: 'Banned', onClick: () => props.action({ variables: { status: 'banned', username: data?.username } }, true) }
  // ]

  const handleChangeStatus = (type, status, target, action) => {
    let variables;
    if (type !== 'Room') variables = { status, username: target };
    else if (type === 'Room') {
      variables = {
        roomId: target,
        isDeactive: status !== 'active',
        isDelete: false,
      };
      action({ variables }, true);
    }
  };

  return (
    <div className='card'>
      <div
        className='flex justify-start items-center p-1 w-full cursor-pointer -mt-5'
        onClickCapture={() => history.goBack()}
      >
        <ChevronLeftIcon className='w-4 h-4 ' />
        <h1 className=' font-thin p-1'>{title}</h1>
      </div>
      <div className='flex w-full justify-between flex-wrap'>
        <div className='flex gap-9'>
          <div className=' text-center min-w-36'>
            {props.loading ? (
              <div className='skeleton w-36 h-36 rounded-3xl' />
            ) : (
              <img
                alt=''
                className=' w-36  h-36 object-cover rounded-3xl'
                src={data?.profilePicture || data?.displayPicture || Blank}
              />
            )}
            <span>{data?.owner}</span>
          </div>

          <div>
            <div
              className='grid grid-cols-2'
              style={{ width: 400, wordBreak: 'break-word' }}
            >
              {RoomList.map((datas, key) => {
                return (
                  <div key={key} className=' w-60'>
                    <span className=' font-semibold'>{datas.name}</span>
                    <br />
                    {props.loading ? (
                      <div className='skeleton w-24 h-4' />
                    ) : (
                      <span className='w-24'>{datas.data}</span>
                    )}
                    <br />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className='flex gap-9'>
          <div className='text-center'>
            <span>Status</span>
            <StatusContainer loading={props.loading}>
              {data?.status ||
                (data?.isDeactive ? 'Deactive' : 'Active') ||
                'active'}
            </StatusContainer>
          </div>

          <div className='text-center'>
            <span>Action</span>
            <div>
              <Dropdown
                options={[
                  {
                    label: 'Active',
                    onClick: () =>
                      handleChangeStatus(
                        data.__typename,
                        'active',
                        data.username || data.id,
                        props.action
                      ),
                  },
                  {
                    label: 'Banned',
                    onClick: () =>
                      handleChangeStatus(
                        data.__typename,
                        'banned',
                        data.username || data.id,
                        props.action
                      ),
                  },
                ]}
                uniqueId={1}
              />
            </div>
          </div>
        </div>
      </div>
      {post && (
        <div className='border-2 border-solid border-gray-600 rounded-md p-4 mt-4'>
          <div>Post Detail</div>
          {post?.media && (
            <Media gap={4} height={112} media={post.media} width={112} />
          )}

          <div className=' text-center'>
            <div className='pt-3'>{caption}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomDetailCard;
