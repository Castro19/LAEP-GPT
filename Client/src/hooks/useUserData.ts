// useUserData.ts
import { useAppDispatch, useAppSelector } from "@/redux";
import {
  updateUserProfile,
  updateUserData,
  setUserData,
} from "../redux/user/userSlice";
import { MyUserInfo, Availability } from "../types";
import { RootState } from "@/redux/store";
import { useEffect } from "react";

export function useUserData() {
  const dispatch = useAppDispatch();
  const { loading, registerError } = useAppSelector(
    (state: RootState) => state.auth
  );
  const userData = useAppSelector((state: RootState) => state.user.userData);

  useEffect(() => {
    if (!userData) {
      dispatch(
        setUserData({
          bio: "",
          year: "",
          interests: null,
          availability: null,
          canShareData: false,
          name: "",
          email: "",
          major: "",
        })
      );
    }
  }, [dispatch, userData]);

  const handleAddInterest = (value: string) => {
    if (userData) {
      if (userData.interests) {
        if (!userData.interests.includes(value)) {
          const updatedInterests = [...userData.interests, value];
          dispatch(updateUserData({ interests: updatedInterests }));
        }
      } else {
        dispatch(updateUserData({ interests: [value] }));
      }
    }
  };

  const handleRemoveInterest = (value: string) => {
    if (userData && userData?.interests) {
      const updatedInterests = userData.interests.filter(
        (interest) => interest !== value
      );
      dispatch(updateUserData({ interests: updatedInterests }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (userData) {
      const { name, value } = e.target;
      dispatch(updateUserData({ [name]: value } as Partial<MyUserInfo>));
    }
  };

  const handleAvailabilityChange = (newAvailability: Availability) => {
    if (userData) {
      dispatch(updateUserData({ availability: newAvailability }));
    }
  };

  const handleShareData = (value: boolean) => {
    if (userData) {
      dispatch(updateUserData({ canShareData: value }));
    }
  };

  const handleSave = () => {
    if (userData) {
      dispatch(updateUserProfile(userData));
    }
  };

  return {
    loading,
    registerError,
    handleAddInterest,
    handleRemoveInterest,
    handleChange,
    handleAvailabilityChange,
    handleShareData,
    handleSave,
  };
}
