import moment from "moment";
import blank_profile_picture from 'assets/blank_profile_picture.png'

const AdminRoleTable = ({ data }) => {
  const tableHead = ["Name", "Role", "Timestamp", "Activity"]

  return (
    <table className="table-responsive w-full overflow-scroll h-4">
      <thead>
        <tr>
          {tableHead.map((label, idx) => (
            <th key={idx} className="p-1.5">{label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {(data && data.length) ? data.map(({ name, role, profileImage, createdAt, message }, idx) => {
          const datetime = moment(+createdAt).format('DD MMM YYYY hh:mm')
          return (
            <tr key={idx}>
              <td className="">
                <div className="flex row-username">
                  <img
                    alt="pp"
                    className='table-photo-container'
                    src={profileImage || blank_profile_picture}
                  />
                  <span>{name}</span>
                </div>
              </td>
              <td className="text-center">{role}</td>
              <td className="text-center">{datetime}</td>
              <td className="text-center">{message}</td>
            </tr>
          )
        }) : null}
      </tbody>
    </table>
  );
}

export default AdminRoleTable;
