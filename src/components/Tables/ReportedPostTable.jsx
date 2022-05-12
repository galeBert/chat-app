import { useState } from 'react';

import blank_profile_picture from '../../assets/blank_profile_picture.png';
import NewDropdown from '../../components/DropDown/DropdownResponsive';
import { ReportedPostSkeleton } from '../../components/Skeleton/Skeleton';
import StatusContainer from '../../components/StatusContainer';
import {
  CHANGE_COMMENT_STATUS,
  CHANGE_POST_STATUS,
} from '../../graphql/mutation';
import {
  GET_COMMENTS_REPORTED,
  SEARCH_REPORTED_POST,
} from '../../graphql/query';

import Media from './Media';

import { useMutation } from '@apollo/client';
import { DateTime } from 'luxon';
import { Link } from 'react-router-dom';

const ReportedPostTable = ({
  data,
  useReportedComment,
  isLoading,
  ...rest
}) => {
  const tableHead =
    rest.type === 'Reported Post'
      ? ['Details', 'Timestamp', 'Owner', 'Media', 'Report', 'Status', 'Action']
      : [
          'Comment',
          'Timestamp',
          'Owner',
          'Media',
          'Report',
          'Status',
          'Action',
        ];
  const [postId, setPostId] = useState('');

  const [changePostStatus, { loading }] = useMutation(CHANGE_POST_STATUS, {
    update(cache, { data: newDataMutation }) {
      const { setStatusPost } = newDataMutation;

      const datas = cache.readQuery({
        query: SEARCH_REPORTED_POST,
        variables: { search: '', perPage: 5, page: 0 },
      });

      const { searchPosts } = datas;

      const newHits = searchPosts.hits.map((res) => {
        if (res.id === setStatusPost.id) {
          return {
            ...res,
            status: setStatusPost.status,
          };
        }

        return res;
      });

      cache.writeQuery({
        query: SEARCH_REPORTED_POST,
        data: {
          searchPosts: {
            ...searchPosts,
            hits: newHits,
          },
        },
      });
    },
  });

  const [changeCommentStatus] = useMutation(CHANGE_COMMENT_STATUS, {
    update(cache, { data: newDataMutation }) {
      const { setStatusComment } = newDataMutation;

      const datas = cache.readQuery({
        query: GET_COMMENTS_REPORTED,
        variables: { search: '', perPage: 5, page: 0 },
      });

      const { searchCommentReported } = datas;

      const newHits = searchCommentReported.hits.map((res) => {
        if (res.id === setStatusComment.id) {
          return {
            status: setStatusComment.status,
            ...res,
          };
        }

        return res;
      });

      cache.writeQuery({
        query: GET_COMMENTS_REPORTED,
        data: {
          searchCommentReported: {
            hits: newHits,
            ...searchCommentReported,
          },
        },
      });
    },
  });

  const handleChangeUserStatus = (status, currentPostId) => {
    // useReportedComment
    setPostId(currentPostId);
    const payload = {
      variables: {
        active: status === 'active',
        flags: [],
        postId: currentPostId,
        takedown: status === 'takedown',
        idComment: currentPostId,
      },
    };

    if (useReportedComment) {
      changeCommentStatus(payload);

      return;
    }
    changePostStatus(payload);
  };

  return (
    <table className='w-full h-full pl-5 pb-5 pr-5 pt-4 bg-dark-1 rounded-xl'>
      <thead>
        <tr>
          {tableHead.map((labelHeader, idx) => {
            return <th key={idx}>{labelHeader}</th>;
          })}
        </tr>
      </thead>
      <tbody>
        {isLoading && <ReportedPostSkeleton />}
        {data &&
          data.map((reportedPost, idx) => {
            const { markdownContent } = JSON.parse(reportedPost.text);
            return (
              <tr key={idx} className='text-center'>
                <td>
                  <Link to={`/reported-post/${reportedPost?.id}`}>
                    {markdownContent}
                  </Link>
                </td>
                <td>
                  {DateTime.now(reportedPost.createdAt).toFormat(
                    'dd MMM yyyy hh:mm'
                  )}
                </td>
                <td className='text-left'>
                  <div className='flex' style={{ alignItem: 'center' }}>
                    <img
                      alt=''
                      className='w-10 h-10 rounded object-cover m-1 mr-3'
                      src={reportedPost?.photoProfile || blank_profile_picture}
                    />
                    <span>
                      {reportedPost?.owner}
                      <br />
                      {reportedPost?.email}
                    </span>
                  </div>
                </td>
                <td>
                  <Media media={reportedPost?.media?.content || []} />
                </td>
                <td>{reportedPost.likeCount}</td>
                <td>
                  <div className='flex justify-center items-center'>
                    <StatusContainer
                      loading={loading && postId === reportedPost?.id}
                    >
                      {reportedPost?.status?.active ? 'active' : 'takedown'}
                    </StatusContainer>
                  </div>
                </td>
                <td className='p-3'>
                  <NewDropdown
                    options={[
                      {
                        label: 'Active',
                        onClick: () =>
                          handleChangeUserStatus('active', reportedPost.id),
                      },
                      {
                        label: 'Take Down',
                        onClick: () =>
                          handleChangeUserStatus('takedown', reportedPost.id),
                      },
                      {
                        label: 'See Detail',
                        to: `/reported-post/${reportedPost?.id}`,
                      },
                    ]}
                    uniqueId={idx}
                  />
                </td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
};

export default ReportedPostTable;
