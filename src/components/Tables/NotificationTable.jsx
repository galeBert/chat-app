import './style.css';

import { useMutation } from '@apollo/client';
import { CheckIcon, XIcon } from '@heroicons/react/outline';
import noPhoto from 'assets/blank_profile_picture.png';
import StatusContainer from 'components/StatusContainer';
import { APPROVED_REQUEST_ADMIN, SEARCH_USER } from 'graphql/mutation';
import { useModal } from 'hooks/useModal';
import { parse } from 'querystring';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

const headers = ['Admin', 'Role', 'Request', 'User', 'Status', 'Action'];

const NotificationTable = ({ data }) => {
  const modal = useModal();
  const queryString = useHistory().location.search;
  const parseQs = parse(queryString.replace('?', ''));

  const [approveRequst] = useMutation(APPROVED_REQUEST_ADMIN, {
    update(cache, { data: newDataMutation }) {
      const { approveAdminAction: dataApproval } = newDataMutation;
      const readQuery = cache.readQuery({
        query: SEARCH_USER,
        variables: { search: parseQs?.search || '', perPage: 20, page: 0 },
      });
      const data = readQuery?.searchUser;

      modal.actions.onSetSnackbar(true, dataApproval.message);
      console.log(data);
      // if (Object.keys(dataApproval).length) {
      //   const newHits = data.hits.map((res) => {
      //     if (res.id === dataApproval.id) {
      //       return {
      //         ...res,
      //         status: dataApproval.status
      //       }
      //     }

      //     return res
      //   });

      //   cache.writeQuery({
      //     query: SEARCH_USER,
      //     variables: { search: parseQs?.search || '', perPage: 20, page: 0 },
      //     data: {
      //       searchUser: {
      //         ...data,
      //         hits: newHits
      //       }
      //     }
      //   });
      // }
    },
  });

  const handleApproveRequest = (id, approve) => () => {
    approveRequst({ variables: { notifId: id, approve } });
  };

  return (
    <table className='table-responsive w-full overflow-scroll h-4'>
      <thead>
        <tr>
          {headers.map((label, idx) => (
            <th key={idx} className='p-1.5'>
              {label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className='relative'>
        {!!data &&
          !!data.length &&
          data.map(
            ({ adminName, adminRole, action, data: dataNotif, id }, idx) => (
              <tr key={idx}>
                <td className='text-center'>
                  <span>{adminName}</span>
                </td>
                <td className='text-center'>{adminRole}</td>
                <td className='text-center flex justify-center items-center h-full'>
                  {action}
                </td>
                <td className=''>
                  <div className='flex row-username'>
                    <img
                      alt='pp'
                      className='table-photo-container'
                      src={noPhoto}
                    />
                    <Link to='/user/user1'>
                      <span>{dataNotif.username}</span>
                    </Link>
                  </div>
                </td>
                <td className='text-center flex justify-center items-center h-full'>
                  <StatusContainer id={1} loading={false}>
                    active
                  </StatusContainer>
                </td>
                <td className='row-action'>
                  <div className='flex justify-center gap-6'>
                    <button
                      className='w-4 h-4'
                      onClick={handleApproveRequest(id, false)}
                    >
                      <XIcon />
                    </button>
                    <button
                      className='w-4 h-4'
                      onClick={handleApproveRequest(id, true)}
                    >
                      <CheckIcon />
                    </button>
                  </div>
                </td>
              </tr>
            )
          )}
      </tbody>
    </table>
  );
};

export default NotificationTable;
