import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from 'react-redux';



const PrivateRoute = () => {

  const isAuth = useSelector((state) => state.auth);
  let hotel_id=parseInt(localStorage.getItem('hotel_id'))

  return isAuth.isAuthenticated ? <Outlet /> : <Navigate to="/auth" />;
};

export default PrivateRoute;
