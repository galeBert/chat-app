import './style.css';

import { useState } from 'react';

import { useMutation } from '@apollo/client';
import { XCircleIcon } from '@heroicons/react/outline';
import noPhoto from 'assets/blank_profile_picture.png';
import NewDropdown from 'components/DropDown/DropdownResponsive';
import { AllUserSkeleton } from 'components/Skeleton/Skeleton';
import StatusContainer from 'components/StatusContainer';
import { CHANGE_USER_STATUS, SEARCH_USER } from 'graphql/mutation';
import { useUserStatus } from 'hooks/useUsersStatus';
import moment from 'moment';
import { parse } from 'querystring';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

const headers = [
  'Username',
  'Join Date',
  'Email / Mobile Number',
  'Status',
  'Action',
];

const AllUserTable = ({ data, props, ...rest }) => {
  const [statusId, setstatusId] = useState();

  const [changeUserStatus, { loading }] = useUserStatus(
    true,
    props.currentPage
  );

  const handleChangeUserStatus = (status, username) => {
    setstatusId(username);
    changeUserStatus({ variables: { status, username } });
  };
  const skeletonLoop = [1, 2, 3, 4, 5];
  return (
    <table className='table-container  h-4'>
      <thead>
        <tr>
          {headers.map((label, key) => (
            <th key={key} className='p-1.5'>
              {label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className='relative'>
        {rest.isLoading ? (
          skeletonLoop.map((_, key) => <AllUserSkeleton key={key} />)
        ) : data && !data.length ? (
          <tr className='bg-red-100 text-center'>
            <td className='p-2' colSpan={5}>
              <div className='flex justify-center'>
                <XCircleIcon className='w-7 h-7' />
              </div>
              <span>Result Not Found</span>
            </td>
          </tr>
        ) : (
          data &&
          data.map(
            (
              {
                profilePicture,
                email,
                mobileNumber,
                status,
                username,
                joinDate,
              },
              idx
            ) => {
              const datetime = moment(joinDate)
                .utc()
                .format('DD MMM YYYY hh:mm');
              return (
                <tr key={idx}>
                  <td className=''>
                    <div className='flex row-username'>
                      <img
                        alt='pp'
                        className='table-photo-container'
                        src={profilePicture || noPhoto}
                      />
                      <Link to={`/user/${username}`}>
                        <span>{username}</span>
                      </Link>
                    </div>
                  </td>
                  <td className='text-center'>{datetime}</td>
                  <td className='text-center'>{email || mobileNumber}</td>
                  <td className='text-center flex justify-center items-center h-full'>
                    <StatusContainer
                      id={username}
                      loading={loading && statusId === username}
                    >
                      {status}
                    </StatusContainer>
                  </td>
                  <td className='row-action'>
                    <NewDropdown
                      options={[
                        {
                          label: 'Active',
                          onClick: () =>
                            handleChangeUserStatus('active', username),
                        },
                        {
                          label: 'Banned',
                          onClick: () =>
                            handleChangeUserStatus('banned', username),
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

export default AllUserTable;
