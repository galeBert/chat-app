import { Redirect, Route } from "react-router";

// Layout
import AppLayout from "pages/layouts/AppLayout";


const UserRoute = ({ component: Component, ...rest }) => {
  const token = localStorage.getItem("token");

  return (
    <Route
      {...rest}
      render={(props) => {
        return token ? (
          <AppLayout>
            <Component {...props} />
          </AppLayout>
        ) : (
          <Redirect to="/" />
        );
      }}
    />
  );
};

export default UserRoute;
