import { useState } from 'react';

import { useMutation } from '@apollo/client';
import blank_profile_picture from 'assets/blank_profile_picture.png';
import NewDropdown from 'components/DropDown/DropdownResponsive';
// import { DotsHorizontalIcon } from "@heroicons/react/outline";
// import { Link } from "react-router-dom";
import StatusContainer from 'components/StatusContainer';
import { SEARCH_ADMINS, SET_STATUS_ADMIN } from 'graphql/mutation';

const AdminTable = ({ data, isLoading }) => {
  const [adminId, setAdmiId] = useState('');
  const tableHead = ['Name', 'Email', 'Role', 'Status', 'Action'];

  const [changeAdminStatus, { loading }] = useMutation(SET_STATUS_ADMIN, {
    update(cache, { data: newDataMutation }) {
      const { setStatusAdmin } = newDataMutation;

      const test = cache.readQuery({
        query: SEARCH_ADMINS,
        variables: { page: 0, perPage: 10 },
      });
      console.log(test);
      // console.log("data adminnya", getAdmin);
      // const newHits = getAdmin.map((res) => {
      //   console.log(res, "sat set", setStatusAdmin);
      //   if (res.id === setStatusAdmin.id) {
      //     return {
      //       ...res,
      //       isActive: setStatusAdmin.isActive,
      //       isBanned: setStatusAdmin.isBanned
      //     }
      //   }

      //   return res
      // });

      // cache.writeQuery({
      //   query: SEARCH_ADMINS,
      //   data: {
      //     getAdmin: {
      //       ...getAdmin,
      //       ...newHits
      //     }
      //   }
      // });
    },
    onError(err) {
      console.log('err', err);
    },
  }); // TODO: need to update cache https://www.howtographql.com/react-apollo/6-more-mutations-and-updating-the-store/

  const handleChangeUserStatus = (id, status) => {
    const statusAdmin = {};
    if (status === 'active') statusAdmin.isActive = true;
    if (status === 'banned') statusAdmin.isBanned = true;

    setAdmiId(id);
    changeAdminStatus({ variables: { ...statusAdmin, adminId: id } });
  };

  const adminRole = (data) => {
    if (data === 1) return 'Super Admin';
    if (data === 2) return 'Co-Super Admin';
    if (data === 3) return 'Admin User';
    if (data === 4) return 'Admin Post';
  };
  return (
    <table className='table-responsive w-full overflow-scroll h-4'>
      <thead>
        <tr>
          {tableHead.map((label, key) => (
            <th key={key} className='p-1.5'>
              {label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data && !data.length ? (
          <h1>test</h1>
        ) : (
          data &&
          data.map(
            (
              {
                name,
                level,
                profileImage,
                email,
                id,
                isDeleted,
                isActive,
                isBanned,
              },
              idx
            ) => {
              return (
                <tr>
                  <td className='p-5'>
                    <div className='flex row-username'>
                      <img
                        alt='pp'
                        className='table-photo-container'
                        src={profileImage || blank_profile_picture}
                      />
                      <span>{name}</span>
                    </div>
                  </td>
                  <td className='text-center'>{email}</td>

                  <td className='text-center'>{adminRole(level)}</td>
                  <td className='text-center flex justify-center items-center h-full'>
                    <StatusContainer
                      active={isActive}
                      id={name}
                      loading={id === adminId && loading}
                    >
                      {isBanned
                        ? 'Banned'
                        : isActive
                        ? 'Active'
                        : isDeleted && 'Deleted'}
                    </StatusContainer>
                  </td>
                  <td className='row-action'>
                    <NewDropdown
                      options={[
                        {
                          label: 'Active',
                          onClick: () => handleChangeUserStatus(id, 'active'),
                        },
                        {
                          label: 'Banned',
                          onClick: () => handleChangeUserStatus(id, 'banned'),
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

export default AdminTable;
