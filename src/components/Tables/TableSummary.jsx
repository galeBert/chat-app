import moment from 'moment';

const headers = ['Name', 'Role', 'Timestamp', 'Activity'];

const AllUserTable = ({ data }) => {
  return (
    <table className='table-responsive w-full overflow-scroll h-4'>
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
        {!!data.length &&
          data.map(({ name, message, createdAt, role }, key) => (
            <tr key={key}>
              <td className='p-5'>
                <div className='flex row-username'>
                  <img
                    alt='pp'
                    className='table-photo-container'
                    src='https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832__340.jpg'
                  />
                  <div>{name}</div>
                </div>
              </td>
              <td className='p-5 text-center'>{role}</td>
              <td className='p-5 text-center'>
                {moment(createdAt).format('DD MMM YYYY hh:mm')}
              </td>
              <td className='p-5 flex-wrap w-3/12'>{message}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default AllUserTable;
