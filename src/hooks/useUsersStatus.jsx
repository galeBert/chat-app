import { useMutation } from '@apollo/client';
import { CHANGE_USER_STATUS, SEARCH_USER } from 'graphql/mutation';
import { useModal } from 'hooks/useModal';
import { parse } from 'querystring';
import { useHistory, useParams } from 'react-router';

export const useUserStatus = (
  shouldBeUpdateCache = true,
  currentPage,
  gqlSchema,
  postId
) => {
  const modal = useModal();
  const queryString = useHistory().location.search;
  const username = useHistory().location.pathname.split('/')[2];
  const parseQs = parse(queryString.replace('?', ''));

  const [changeUserStatus, { loading }] = useMutation(CHANGE_USER_STATUS, {
    update(cache, { data: newDataMutation }) {
      const { changeUserStatus: dataChangeUserStatus } = newDataMutation;

      modal.actions.onSetSnackbar(dataChangeUserStatus.message);

      if (shouldBeUpdateCache) {
        const { searchUser } = cache.readQuery({
          query: SEARCH_USER,
          variables: {
            search: parseQs?.search || username || '',
            perPage: 20,
            page: currentPage,
          },
        });

        const newHits = searchUser.hits.map((res) => {
          if (res.id === dataChangeUserStatus.id) {
            return {
              ...res,
              status: dataChangeUserStatus.status,
            };
          }

          return res;
        });

        cache.writeQuery({
          query: SEARCH_USER,
          variables: {
            search: parseQs?.search || username || '',
            perPage: 20,
            page: currentPage,
          },
          data: {
            searchUser: {
              ...searchUser,
              hits: newHits,
            },
          },
        });
      } else {
        const data = cache.readQuery({
          query: gqlSchema,
          variables: {
            id: postId,
          },
        });

        cache.writeQuery({
          query: gqlSchema,
          variables: {
            id: postId,
          },
          data: {
            getSinglePost: {
              ...data,
              owner: dataChangeUserStatus.status,
            },
          },
        });
      }
    },
    onError(err) {
      alert(err);
    },
  });

  return [changeUserStatus, { loading }];
};
