// Routes
import DashboardRoute from './DashboardRoute';
import UserRoute from './UserRoute';

import ModalProvider from 'context/ModalContext';
// Importing Provider
import UserProvider from 'context/UserContext';
import AdminPage from 'pages/AdminPage/AdminPage';
import AllPostPage from 'pages/AllPostPage/AllPostPage';
import AvailableRoomPage from 'pages/AvailableRoomPage/AvailableRoomPage';
import AvaliableRoomForm from 'pages/AvalilableRoomForm';
// Pages
import LoginPage from 'pages/LoginPage/LoginPage';
import NotificationPage from 'pages/NotificationPage/NotificationPage';
import RandomizationPage from 'pages/RadomizationPage/RandomizationPage';
import RandomizationContentPage from 'pages/RandomizationContentPage/RandomizationContentPage';
import ReportedPostPage from 'pages/ReportedPostPage/ReportedPostPage';
import SinglePostPage from 'pages/SinglePostPage/SinglePostPage';
import SingleReportedPostPage from 'pages/SingleReportedPostPage/SingleReportedPostPage';
import SingleRoomPage from 'pages/SingleRoomPage/SingleRoomPage';
import SingleUserPage from 'pages/SingleUserPage/SingleUserPage';
import UsersPage from 'pages/UsersPage/UsersPage';
import { BrowserRouter as Router, Switch } from 'react-router-dom';

export default function AppRoute() {
  return (
    <Router>
      <UserProvider>
        <ModalProvider>
          <Switch>
            <DashboardRoute component={LoginPage} exact path='/' />
            <UserRoute component={UsersPage} exact path='/user' />
            <UserRoute
              component={NotificationPage}
              exact
              path='/notification'
            />
            <UserRoute
              component={SingleUserPage}
              exact
              path='/user/:username'
            />
            <UserRoute component={SinglePostPage} exact path='/all-post/:id' />
            <UserRoute
              component={SingleReportedPostPage}
              exact
              path='/reported-post/:id'
            />
            <UserRoute component={AllPostPage} exact path='/all-post' />
            <UserRoute
              component={ReportedPostPage}
              exact
              path='/reported-post'
            />
            <UserRoute component={LoginPage} exact path='/inapp-purchase' />
            <UserRoute
              component={RandomizationPage}
              exact
              path='/randomization'
            />
            <UserRoute
              component={RandomizationContentPage}
              exact
              path='/randomization/:content'
            />
            <UserRoute component={AdminPage} exact path='/admin' />
            <UserRoute
              component={AvailableRoomPage}
              exact
              path='/available-room'
            />
            <UserRoute
              component={AvaliableRoomForm}
              exact
              path='/available-room/add'
            />
            <UserRoute
              component={AvaliableRoomForm}
              exact
              path='/available-room/edit/:id'
            />
            <UserRoute
              component={SingleRoomPage}
              exact
              path='/available-room/:room/:id'
            />
          </Switch>
        </ModalProvider>
      </UserProvider>
    </Router>
  );
}
