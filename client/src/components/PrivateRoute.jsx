import { useSelector } from "react-redux";
import { Outlet, Navigate } from 'react-router-dom';

export default function PrivateRoute() {
    const { currentUser } = useSelector((state) => state.user);
// using outlet as a component allows the rendering of child components when the parent component is used in the Routes 
  return (
    currentUser ? <Outlet/> : <Navigate to="/signin"/>
  )
}
