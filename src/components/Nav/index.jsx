import './style.css'
import { useState, useEffect, useMemo } from 'react';
import { Autocomplete } from 'components/Autocomplete';
import { BellIcon } from '@heroicons/react/outline';
import NewDropdown from "components/DropDown/DropdownResponsive";
import { ChevronDownIcon } from '@heroicons/react/solid';
import { Link, useHistory } from 'react-router-dom';
import { auth } from 'utils/firebase';
import { observeSnapshot } from "functions/auth";
import { useAdminContext } from 'hooks/useAdmin';

// const searchClient = algoliasearch('X3DO93E2H0', 'a95bc441f3391e56089fb3abedecc24a');


export default function Nav() {
  const admin = useAdminContext();
  const history = useHistory()
  const handleLogout = () => {
    auth.signOut().then(() => {
      localStorage.removeItem("token")
      localStorage.removeItem("admin")
      history.push('/')
    }).catch(err => console.log(err))
  }

  const [total, setTotal] = useState(0);

  const onReceived = (doc = []) => {
    setTotal(doc.length || 0);
  }
  const adminRole = useMemo(
    () => {
      if (admin?.value?.level === 1) return "Super Admin"
      if (admin?.value?.level === 2) return "Co-Super Admin"
      if (admin?.value?.level === 3) return "Admin User"
      if (admin?.value?.level === 4) return "Admin Post"
    },
    [admin]
  );

  useEffect(() => {
    observeSnapshot('notifications', 'isVerify', false, onReceived, () => { })
  }, [])
  return (
    <div className=" fixed  w-full left-0 -top-1 p-4 bg-dark-300 z-30">
      <div className="flex justify-between ">
        <div className=" lg:ml-52 xl:ml-80 w-full">
          <Autocomplete />
        </div>

        <div className=" text-right flex w-full">
          <div className="nav-right flex items-center justify-end w-full">
            <div className="">
              <Link to="/notification" style={{ position: 'relative' }}>
                <div style={{ marginRight: 12 }}>
                  <BellIcon className="  w-6 h-6  inline " />
                </div>
                {total ? (
                  <div style={{
                    width: 15,
                    fontSize: 11,
                    height: 15,
                    backgroundColor: "red",
                    borderRadius: '50%',
                    textAlign: 'center',
                    top: 0,
                    position: 'absolute',
                    right: 0
                  }}>{total}</div>
                ) : null}
              </Link>
            </div>
            <div className="inline  text-left border-l-2 ml-7 pl-7 pr-2 border-solid border-white">
              <span>{admin?.value?.name}</span><br />
              <span className='text-xs'>{adminRole}</span>
            </div>
            <div className='w-4 p-3'>
              <NewDropdown
                left
                uniqueId={1}
                Icon={ChevronDownIcon}
                options={[
                  { label: 'Logout', onClick: handleLogout }
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}
