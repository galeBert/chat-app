import { useLazyQuery } from "@apollo/client";
import { GET_SINGLE_POST, GET_REPORTED_LIST } from 'graphql/query'
import { useEffect } from "react";

import Table from "components/Tables";
import UserDetailCard from "components/UserDetailCard";

const SingleReportedPostPage = props => {
  const postId = props.match.params.id
  const commentId = props.match.params.commentId
  const [getSinglePost, { data, loading }] = useLazyQuery(GET_SINGLE_POST, {})
  const [getReportedList, { data: dataReported, refetch }] = useLazyQuery(GET_REPORTED_LIST, {})

  useEffect(() => {
    if (postId) {
      getSinglePost({ variables: { id: postId, commentId } })
      getReportedList({ variables: { idPost: postId } })
    }
  }, [postId, commentId, getSinglePost, getReportedList]);

  const owner = data?.getSinglePost.owner || {}
  const post = data?.getSinglePost.post || {}

  const dataPost = {
    media: post?.media,
    id: post?.id,
    caption: post?.text
  };

  const reportedList = dataReported?.getReportedByIdPost?.hits || []

  return (
    <div className="grid grid-cols-2 gap-5">
      {loading ? (
        <div>Loading ...</div>
      ) : (
        <>
          <UserDetailCard data={owner} post={dataPost} title="Post Owner" />
          <div>
            <Table
              noAddNew
              noSearch
              pages={dataReported?.getReportedByIdPost?.nbPages - 1}
              data={reportedList}
              onRefetch={refetch}
              type="Reported List"
            />
          </div>
        </>
      )}
    </div>
  );
}

export default SingleReportedPostPage;