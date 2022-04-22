import { BrowserRouter as Router, Switch } from "react-router-dom";

// Routes
import DashboardRoute from "./DashboardRoute";

// Pages
import LoginPage from "pages/LoginPage/LoginPage";
import UsersPage from "pages/UsersPage/UsersPage";
import UserRoute from "./UserRoute";
import SingleUserPage from "pages/SingleUserPage/SingleUserPage";
import AllPostPage from "pages/AllPostPage/AllPostPage";
import ReportedPostPage from "pages/ReportedPostPage/ReportedPostPage";

// Importing Provider
import UserProvider from "context/UserContext";
import ModalProvider from "context/ModalContext";
import AdminPage from "pages/AdminPage/AdminPage";
import RandomizationPage from "pages/RadomizationPage/RandomizationPage";
import RandomizationContentPage from "pages/RandomizationContentPage/RandomizationContentPage";
import AvailableRoomPage from "pages/AvailableRoomPage/AvailableRoomPage";

import AvaliableRoomForm from "pages/AvalilableRoomForm";
import SingleReportedPostPage from "pages/SingleReportedPostPage/SingleReportedPostPage";
import SinglePostPage from "pages/SinglePostPage/SinglePostPage";
import NotificationPage from "pages/NotificationPage/NotificationPage";
import SingleRoomPage from "pages/SingleRoomPage/SingleRoomPage";


export default function AppRoute() {
  return (
    <Router>
      <UserProvider>
        <ModalProvider>
          <Switch>
            <DashboardRoute exact path="/" component={LoginPage} />
            <UserRoute exact path="/user" component={UsersPage} />
            <UserRoute exact path="/notification" component={NotificationPage} />
            <UserRoute exact path="/user/:username" component={SingleUserPage} />
            <UserRoute exact path="/all-post/:id" component={SinglePostPage} />
            <UserRoute exact path="/reported-post/:id" component={SingleReportedPostPage} />
            <UserRoute exact path="/all-post" component={AllPostPage} />
            <UserRoute exact path="/reported-post" component={ReportedPostPage} />
            <UserRoute exact path="/inapp-purchase" component={LoginPage} />
            <UserRoute exact path="/randomization" component={RandomizationPage} />
            <UserRoute exact path="/randomization/:content" component={RandomizationContentPage} />
            <UserRoute exact path="/admin" component={AdminPage} />
            <UserRoute exact path="/available-room" component={AvailableRoomPage} />
            <UserRoute exact path="/available-room/add" component={AvaliableRoomForm} />
            <UserRoute exact path="/available-room/edit/:id" component={AvaliableRoomForm} />
            <UserRoute exact path="/available-room/:room/:id" component={SingleRoomPage} />
          </Switch>
        </ModalProvider>
      </UserProvider>
    </Router>
  );
}
