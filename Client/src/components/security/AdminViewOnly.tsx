import ComingSoonPage from "@/pages/ComingSoonPage";
import { useAppSelector } from "@/redux";
import React from "react";

const AdminViewOnly = ({ children }: { children: React.ReactNode }) => {
  const { userData } = useAppSelector((state) => state.user);

  if (userData.userType !== "admin") {
    return <ComingSoonPage />;
  }
  return children;
};

export default AdminViewOnly;
