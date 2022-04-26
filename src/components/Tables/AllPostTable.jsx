import { useState } from 'react';

import Media from './Media';

import { useMutation } from '@apollo/client';
import { XCircleIcon } from '@heroicons/react/outline';
import blank_profile_picture from 'assets/blank_profile_picture.png';
import NewDropdown from 'components/DropDown/DropdownResponsive';
import { AllPostSkeleton } from 'components/Skeleton/Skeleton';
import StatusContainer from 'components/StatusContainer';
import { usePostStatus } from 'hooks/usePostStatus';
import moment from 'moment';
import { parse } from 'querystring';
import { Link, useHistory } from 'react-router-dom';

const tableHead = [
  'Location',
  'Timestamp',
  'ID',
  'Owner',
  'Caption',
  'Media',
  'Like',
  'Comment',
  'Repost',
  'Rating',
  'Status',
  'Action',
];

const AllPostTable = ({ data, isLoading, props, ...rest }) => {
  const [postId, setPostId] = useState('');

  const [changePostStatus, { loading }] = usePostStatus(
    true,
    props.currentPages
  );

  const handleChangeUserStatus = (status, currentPostId) => {
    setPostId(currentPostId);
    changePostStatus({
      variables: {
        active: status === 'active',
        flags: [],
        postId: currentPostId,
        takedown: status === 'takedown',
        deleted: status === 'delete',
      },
    });
  };
  const handleAddUserFlag = (status, currentPostId) => {
    setPostId(currentPostId);
    changePostStatus({
      variables: {
        active: true,
        flags: [status],
        postId: currentPostId,
        takedown: status === 'takedown',
      },
    });
  };
  const skeletonLoop = [1, 2, 3, 4, 5];

  return (
    <table className='table-container'>
      <tr>
        {tableHead.map((dataHeader, idx) => {
          return <th key={idx}>{dataHeader}</th>;
        })}
      </tr>
      {isLoading ? (
        skeletonLoop.map((_, key) => <AllPostSkeleton key={key} />)
      ) : data && !data.length ? (
        <tr className='bg-red-100 text-center'>
          <td className='p-2' colSpan={12}>
            <div className='flex justify-center'>
              <XCircleIcon className='w-7 h-7' />
            </div>
            <span>Result Not Found</span>
          </td>
        </tr>
      ) : (
        data &&
        data.map((post, idx) => {
          const datetime = moment(post.createdAt)
            .utc()
            .format('DD MMM YYYY hh:mm');
          const { markdownContent } = JSON.parse(post.text);
          return (
            <tr key={idx} className='text-center h-8'>
              <td className=''>
                <span>
                  {post?.location?.detail?.streetName},
                  {post?.location?.detail?.district}
                </span>
              </td>
              <td className=''>
                <span>{datetime}</span>
              </td>
              <td className=''>
                <span>{post.id}</span>
              </td>
              <td className='text-left'>
                <div className='flex' style={{ alignItems: 'center' }}>
                  <img
                    alt='pp'
                    className='table-photo-container'
                    src={post.photoProfile || blank_profile_picture}
                  />
                  <span>
                    {post.owner}
                    <br />
                    <span className='email-span'>{post.email}</span>
                  </span>
                </div>
              </td>
              <td className=''>
                <Link to={`/all-post/${post.id}`}>
                  <span>{markdownContent}</span>
                </Link>
              </td>
              <td className=''>
                <Media media={post?.media} />
              </td>
              <td className=''>
                <span>{post.likeCount}</span>
              </td>
              <td className=''>
                <span>{post.commentCount}</span>
              </td>
              <td className=''>
                <span>{post.repostCount}</span>
              </td>
              <td className=''>
                <span>{post.rank}</span>
              </td>
              <td className=''>
                <div className='flex justify-center items-center'>
                  <StatusContainer loading={loading && postId === post.id}>
                    {post.status.flags?.length
                      ? post.status.flags[0]
                      : post.status.active
                      ? 'active'
                      : 'takedown'}
                  </StatusContainer>
                </div>
              </td>
              <td className='p-5'>
                <NewDropdown
                  options={[
                    {
                      label: 'Active',
                      onClick: () => handleChangeUserStatus('active', post.id),
                    },
                    {
                      label: 'Take Down',
                      onClick: () =>
                        handleChangeUserStatus('takedown', post.id),
                    },
                    {
                      label: 'Set Flag',
                      onClick: null,
                      child: [
                        {
                          label: 'Disturbing',
                          onClick: () =>
                            handleAddUserFlag('Disturbing', post.id),
                        },
                        {
                          label: 'Sensitive',
                          onClick: () => handleAddUserFlag('takedown', post.id),
                        },
                        {
                          label: 'Pornography',
                          onClick: () => handleAddUserFlag('takedown', post.id),
                        },
                        {
                          label: 'Racist',
                          onClick: () => handleAddUserFlag('takedown', post.id),
                        },
                      ],
                    },
                    { label: 'Detail Post', to: `all-post/${post.id}` },
                  ]}
                  uniqueId={idx}
                />
              </td>
            </tr>
          );
        })
      )}
    </table>
  );
};

export default AllPostTable;
