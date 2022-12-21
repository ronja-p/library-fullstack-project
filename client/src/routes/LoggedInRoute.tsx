import React, { useEffect, useState } from 'react';
import { useAppSelector } from 'redux/hooks';
import { Outlet } from 'react-router-dom';
import { Login } from 'pages';
import { checkLogin } from 'services/UserService';

const LoggedInRoute = () => {
  // initialize isAuthorized state using redux state for initial value
  const [isAuthroized, setIsAuthorized] = useState(
    useAppSelector((state) => state.user.data.isLoggedIn)
  );

  const token = useAppSelector((state) => state.user.data.token);

  // make auth request to backend
  useEffect(() => {
    const authCheck = async () => {
      const data = await checkLogin(token);
      // update state based on response
      data.success ? setIsAuthorized(true) : setIsAuthorized(false);
    };
    authCheck();
  }, [token]);

  return isAuthroized ? <Outlet /> : <Login />;
};

export default LoggedInRoute;
