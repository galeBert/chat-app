// Layout
import AppLayout from 'pages/layouts/AppLayout';
import LoginPage from 'pages/LoginPage/LoginPage';
// Pages
import SummaryPage from 'pages/SummaryPage/SummaryPage';
import { Route } from 'react-router';

const DashboardRoute = ({ component: Component, ...rest }) => {
  const token = localStorage.getItem('token');

  return (
    <Route
      {...rest}
      render={(props) => {
        return token ? (
          <AppLayout>
            <Route component={SummaryPage} exact path='/' />
          </AppLayout>
        ) : (
          <LoginPage>
            <Component {...props} />
          </LoginPage>
        );
      }}
    />
  );
};

export default DashboardRoute;
