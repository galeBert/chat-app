import blank_profile_picture from '../../assets/blank_profile_picture.png';

import { DateTime } from 'luxon';

const AdminRoleTable = ({ data }) => {
  const tableHead = ['Name', 'Role', 'Timestamp', 'Activity'];

  return (
    <table className='table-responsive w-full overflow-scroll h-4 text-typography-1'>
      <thead>
        <tr>
          {tableHead.map((label, idx) => (
            <th key={idx} className='p-1.5'>
              {label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data && data.length
          ? data.map(
              ({ name, role, profileImage, createdAt, message }, idx) => {
                const datetime = DateTime.now(+createdAt).toFormat(
                  'dd-MM-yyyy'
                );
                return (
                  <tr key={idx}>
                    <td className=''>
                      <div className='flex items-center gap-x-2'>
                        <img
                          alt='pp'
                          className='w-10 h-10 rounded object-cover m-1 mr-3'
                          src={profileImage || blank_profile_picture}
                        />
                        <span>{name}</span>
                      </div>
                    </td>
                    <td className='text-center'>{role}</td>
                    <td className='text-center'>{datetime}</td>
                    <td className='text-center'>{message}</td>
                  </tr>
                );
              }
            )
          : null}
      </tbody>
    </table>
  );
};

export default AdminRoleTable;
