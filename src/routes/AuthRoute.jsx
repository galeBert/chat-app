import LoginPage from 'pages/LoginPage/LoginPage';
import { Redirect, Route } from 'react-router';

export default function AuthRoute({ component: Component, ...rest }) {
  const token = localStorage.getItem('token');

  return (
    <Route
      {...rest}
      render={(props) =>
        token ? (
          <Redirect to='/' />
        ) : (
          <LoginPage>
            {' '}
            <Component {...props} />{' '}
          </LoginPage>
        )
      }
    />
  );
}
