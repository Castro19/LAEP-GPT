// useUserData.ts
import { useAppDispatch, useAppSelector } from "@/redux";
import { updateUserProfile, updateUserData } from "../redux/auth/authSlice";
import { MyUserInfo, Availability } from "../types";
import { RootState } from "@/redux/store";

export function useUserData() {
  const dispatch = useAppDispatch();
  const { userData, loading, registerError } = useAppSelector(
    (state: RootState) => state.auth
  );

  const handleAddInterest = (value: string) => {
    if (userData) {
      if (userData?.interests) {
        if (!userData?.interests.includes(value)) {
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
    userData,
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
