import { useAppSelector } from "@/redux";
import { Navigate } from "react-router-dom";
import SignInFlow from "../register/SignInFlow";

const NewUserRoute = () => {
  const { userLoggedIn, loading, isNewUser } = useAppSelector(
    (state) => state.auth
  );
  const { userData } = useAppSelector((state) => state.user);

  if (loading) {
    return <div>Loading...</div>; // Display a loading indicator instead of returning null
  }

  if (!userLoggedIn) {
    return <Navigate to="/register/login" replace />;
  }

  if (!isNewUser) {
    if (userData.userType !== "admin") return <Navigate to="/chat" replace />;
  }

  return (
    <>
      <SignInFlow />
    </>
  ); // Render child routes
};

export default NewUserRoute;
