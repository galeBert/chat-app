import { CHANGE_POST_STATUS, SEARCH_POST } from '../graphql/mutation';
import { useModal } from '../hooks/useModal';

import { useMutation } from '@apollo/client';
import { parse } from 'querystring';
import { useHistory, useParams } from 'react-router-dom';

export const usePostStatus = () => {
  // shouldBeUpdateCache = true,
  // currentPages,
  // gqlSchema,
  // postId,
  // props

  const path = useParams();

  console.log('path', path);
  const modal = useModal();
  const queryString = useHistory().location.search;
  const username = useHistory().location.pathname.split('/')[2];
  const roomId = useHistory().location.pathname.split('/')[3];
  const parseQs = parse(queryString.replace('?', ''));

  const [changePostStatus, { loading }] = useMutation(CHANGE_POST_STATUS, {
    update(cache, { data: newDataMutation }) {
      const { setStatusPost } = newDataMutation;

      modal.actions.onSetSnackbar(setStatusPost.message);

      const { searchPosts } = cache.readQuery({
        query: SEARCH_POST,
        variables: {
          search: parseQs?.search || roomId || '',
          perPage: 20,
          page: 0,
          sortBy: 'desc',
          filters: { owner: !roomId ? username || '' : '' },
        },
      });

      const newHits = searchPosts?.hits?.map((res) => {
        if (res.id === setStatusPost.id) {
          return {
            ...res,
            status: setStatusPost.status,
          };
        }

        return res;
      });

      cache.writeQuery({
        query: SEARCH_POST,
        variables: {
          search: parseQs?.search || '',
          perPage: 20,
          page: 0,
          sortBy: 'desc',
          filters: { owner: !roomId ? username || '' : '' },
        },
        data: {
          searchPosts: {
            ...searchPosts,
            hits: newHits,
          },
        },
      });
    },
    onError(err) {
      modal.actions.onSetSnackbar(err.message);
    },
  });
  // const [changeUserStatus, { loading }] = useMutation(CHANGE_USER_STATUS, {
  //   update(cache, { data: newDataMutation }) {
  //     const { changeUserStatus: dataChangeUserStatus } = newDataMutation;

  //     modal.actions.onSetSnackbar(dataChangeUserStatus.message)

  //     if (shouldBeUpdateCache) {
  //       const { searchUser } = cache.readQuery({
  //         query: SEARCH_USER,
  //         variables: { search: (parseQs?.search || username) || '', perPage: 20, page: currentPage }
  //       });

  //       const newHits = searchUser.hits.map((res) => {

  //         if (res.id === dataChangeUserStatus.id) {
  //           return {
  //             ...res,
  //             status: dataChangeUserStatus.status
  //           }
  //         }

  //         return res
  //       });

  //       cache.writeQuery({
  //         query: SEARCH_USER,
  //         variables: { search: (parseQs?.search || username) || '', perPage: 20, page: currentPage },
  //         data: {
  //           searchUser: {
  //             ...searchUser,
  //             hits: newHits
  //           }
  //         }
  //       });
  //     } else {
  //       const data = cache.readQuery({
  //         query: gqlSchema,
  //         variables: {
  //           id: postId
  //         }
  //       });

  //       cache.writeQuery({
  //         query: gqlSchema,
  //         variables: {
  //           id: postId
  //         },
  //         data: {
  //           getSinglePost: {
  //             ...data,
  //             owner: dataChangeUserStatus.status
  //           }
  //         }
  //       });

  //     }

  //   }, onError(err) {
  //     alert(err)
  //   }
  // });

  return [changePostStatus, { loading }];
};
