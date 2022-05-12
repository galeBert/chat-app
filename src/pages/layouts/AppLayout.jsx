import 'react-toastify/dist/ReactToastify.css';

import Nav from '../../components/Nav';
import Sidebar from '../../components/Sidebar';

// import { useModal } from 'hooks/useModal';
import { ToastContainer } from 'react-toastify';
// import LoadingScreen from "components/LoadingScreen";

export default function AppLayout({ children }) {
  // const modal = useModal()
  // const isLoadingScreen = modal.value.isLoadingScreen
  return (
    <div className='grid grid-cols-6 h-screen gap-3'>
      <div className='bg-dark-1 p-2 mr-4 z-40'>
        <Sidebar />
      </div>
      <main className='col-span-5 h-full overflow-x-scroll pr-2'>
        <div className=' h-16 mb-6'>
          <Nav />
        </div>
        <div className='pr-5 h-full'>
          {/* <LoadingScreen /> */}
          {children}
          <div>
            <ToastContainer
              autoClose={2500}
              closeOnClick={false}
              draggable
              hideProgressBar={false}
              newestOnTop={false}
              pauseOnFocusLoss
              pauseOnHover
              position='bottom-center'
              rtl={false}
              theme='dark'
            />
          </div>
        </div>
      </main>
    </div>
  );
}
