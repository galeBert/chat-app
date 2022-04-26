import NewDropdown from 'components/DropDown/DropdownResponsive';
import allRoom from 'components/fakeDB/allRoom';
// import blank_profile_picture from 'assets/blank_profile_picture.png'
// import { DotsHorizontalIcon } from "@heroicons/react/outline";
// import { Link } from "react-router-dom";
import StatusContainer from 'components/StatusContainer';

const ReportedListTable = ({ data }) => {
  const tableHead = ['Reporter Name', 'Reason'];

  const handleChangeUserStatus = () => {
    console.log('hi');
  };
  return (
    <table className='table-responsive w-full overflow-scroll h-4'>
      <thead>
        <tr>
          {tableHead.map((label) => (
            <th className='p-1.5'>{label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data &&
          !!data.length &&
          data.map(({ username, content }, idx) => {
            return (
              <tr className='h-full'>
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
