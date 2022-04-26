import { useEffect } from 'react';

import UserDetailCard from '../../components/UserDetailCard';
import { GET_SINGLE_POST } from '../../graphql/query';
import { useUserStatus } from '../../hooks/useUsersStatus';

import { useLazyQuery } from '@apollo/client';

const SinglePostPage = (props) => {
  const postId = props.match.params.id;
  const [getSinglePost, { data, loading }] = useLazyQuery(GET_SINGLE_POST);
  const [changeUserStatus, { loading: loadingUserStatus }] = useUserStatus(
    false,
    '',
    GET_SINGLE_POST,
    postId
  );

  useEffect(() => {
    if (postId) {
      getSinglePost({ variables: { id: postId } });
    }
  }, [postId, getSinglePost]);

  const owner = data?.getSinglePost.owner || {};
  const post = data?.getSinglePost.post || {};

  const dataPost = {
    media: post?.media,
    id: post?.id,
    caption: post?.text,
  };
  return (
    <div>
      <UserDetailCard
        action={changeUserStatus}
        data={owner}
        loading={loading}
        post={dataPost}
        statusLoading={loadingUserStatus}
        title='Post Owner'
      />
    </div>
  );
};

export default SinglePostPage;
