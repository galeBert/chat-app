import Dropdown from './DropDown/DropdownResponsive';
import Media from './Tables/Media';

import { ChevronLeftIcon } from '@heroicons/react/outline';
import Blank from 'assets/blank_profile_picture.png';
import StatusContainer from 'components/StatusContainer';
import { useHistory } from 'react-router';

const UserDetailCard = ({ data, title, post, ...props }) => {
  console.log('data', data);
  const history = useHistory();
  const detailList =
    data?.__typename === 'Room'
      ? [
          { name: 'Name', data: data?.roomName || '-' },
          { name: 'Center Location', data: 'Bandung' || '-' },
          { name: 'Start Date', data: data?.startingDate || '-' },
          { name: 'Coverage Radius', data: '10KM' || '-' },
          { name: 'End Date', data: data?.tillDate || '-' },
          { name: 'Total Post', data: data?.totalPost || '0' },
        ]
      : [
          { name: 'Email', data: data?.email || '-' },
          { name: 'ID', data: data?.id || '-' },
          { name: 'Mobile Number', data: data?.mobileNumber || '-' },
          { name: 'Created', data: data?.created || '-' },
          { name: 'Username', data: data?.username || '-' },
          { name: 'Last Active', data: data?.created || '-' },
          { name: 'Date of Birth', data: data?.dob || '-' },
          {
            name: 'Interest',
            data: data?.interest
              ? data?.interest.map(
                  (doc, key) =>
                    doc + (data.interest.length - 1 !== key ? ', ' : '')
                ) || '-'
              : '-',
          },
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
    else
      variables = {
        roomId: target,
        isDeactive: status !== 'active',
        isDelete: false,
      };
    action({ variables }, true);
  };

  return (
    <div className='card'>
      <div
        className='flex justify-start items-center p-1 w-full cursor-pointer -mt-5'
        onClick={() => history.goBack()}
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
              {detailList.map((data, key) => {
                return (
                  <div key={key} className=' w-60'>
                    <span className=' font-semibold'>{data.name}</span>
                    <br />
                    {props.loading ? (
                      <div className='skeleton w-24 h-4' />
                    ) : (
                      <span className='w-24'>{data.data}</span>
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

export default UserDetailCard;
