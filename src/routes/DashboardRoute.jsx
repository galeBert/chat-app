import { Route } from "react-router";

// Layout
import AppLayout from "pages/layouts/AppLayout";

// Pages
import SummaryPage from "pages/SummaryPage/SummaryPage";
import LoginPage from "pages/LoginPage/LoginPage";

const DashboardRoute = ({ component: Component, ...rest }) => {
  const token = localStorage.getItem("token");

  return (
    <Route
      {...rest}
      render={(props) => {
        return token ? (
          <AppLayout>
            <Route exact path="/" component={SummaryPage} />
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
