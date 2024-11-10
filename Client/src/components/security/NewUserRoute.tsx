import { useAppSelector } from "@/redux";
import { Navigate, Outlet } from "react-router-dom";

const NewUserRoute = () => {
  const { userLoggedIn, loading, isNewUser } = useAppSelector(
    (state) => state.auth
  );

  if (loading) {
    return <div>Loading...</div>; // Display a loading indicator instead of returning null
  }

  if (!userLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!isNewUser) {
    return <Navigate to="/chat" replace />;
  }

  return <Outlet />; // Render child routes
};

export default NewUserRoute;
