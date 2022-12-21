import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { Outlet } from 'react-router-dom';
import { checkAdmin } from 'services/UserService';

import { updateAdmin } from 'features/user/userSlice';
import { Home } from 'pages';

const AdminRoute = () => {
  //
  const dispatch = useAppDispatch();

  // initialize isAuthorized state using redux state for initial value
  const [isAuthroized, setIsAuthorized] = useState(false);
  const token = useAppSelector((state) => state.user.data.token);

  // make auth request to backend
  useEffect(() => {
    const authCheck = async () => {
      const data = await checkAdmin(token);
      // update state based on response
      if (data.success) {
        setIsAuthorized(true);
        dispatch(updateAdmin(true));
      } else {
        setIsAuthorized(false);
        dispatch(updateAdmin(false));
      }
    };
    authCheck();
  }, [token]);

  return isAuthroized ? <Outlet /> : <Home />;
};

export default AdminRoute;
