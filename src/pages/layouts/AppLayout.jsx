import './AppLayout.css';
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
    <div className='app-grid-layout'>
      <div className='app-layout-left'>
        <Sidebar />
      </div>
      <main className='app-layout-main'>
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
