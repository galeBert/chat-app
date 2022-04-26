const ReportedListTable = ({ data }) => {
  const tableHead = ['Reporter Name', 'Reason'];

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
        {data &&
          !!data.length &&
          data.map(({ username, content }, idx) => {
            return (
              <tr key={idx} className='h-full'>
                <td className=''>{username}</td>
                <td className='text-center'>{content}</td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
};

export default ReportedListTable;
