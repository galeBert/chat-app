import Nav from "components/Nav";
import Sidebar from "components/Sidebar";
// import { useModal } from 'hooks/useModal';
import { ToastContainer } from 'react-toastify';
import "./AppLayout.css";
import 'react-toastify/dist/ReactToastify.css';
// import LoadingScreen from "components/LoadingScreen";

export default function AppLayout({ children }) {
    // const modal = useModal()
    // const isLoadingScreen = modal.value.isLoadingScreen
    return (
        <div className="app-grid-layout">

            <div className="app-layout-left">
                <Sidebar />
            </div>
            <main className="app-layout-main">
                <div className=" h-16 mb-6">
                    <Nav />

                </div>
                <div className="pr-5 h-full">
                    {/* <LoadingScreen /> */}
                    {children}
                    <div>
                        <ToastContainer
                            position="bottom-center"
                            autoClose={2500}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick={false}
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                            theme="dark"
                        />
                    </div>
                </div>
            </main>


        </div>
    )
}