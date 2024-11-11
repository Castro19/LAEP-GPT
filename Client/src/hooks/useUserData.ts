// useUserData.ts
import { useAppDispatch, useAppSelector } from "@/redux";
import { updateUserProfile, updateUserData } from "../redux/user/userSlice";
import { MyUserInfo, Availability } from "../types";
import { RootState } from "@/redux/store";

export function useUserData() {
  const dispatch = useAppDispatch();
  const { loading, registerError } = useAppSelector(
    (state: RootState) => state.auth
  );
  const userData = useAppSelector((state: RootState) => state.user.userData);

  const handleAddCourse = (value: string) => {
    if (!userData.courses.includes(value)) {
      const updatedCourses = [...userData.courses, value];
      dispatch(updateUserData({ courses: updatedCourses }));
    }
  };

  const handleRemoveCourse = (value: string) => {
    const updatedCourses = userData.courses.filter(
      (course) => course.split(": ")[0] !== value
    );
    dispatch(updateUserData({ courses: updatedCourses }));
  };

  const handleAddInterest = (value: string) => {
    if (!userData.interests.includes(value)) {
      const updatedInterests = [...userData.interests, value];
      dispatch(updateUserData({ interests: updatedInterests }));
    }
  };

  const handleRemoveInterest = (value: string) => {
    const updatedInterests = userData.interests.filter(
      (interest) => interest !== value
    );
    dispatch(updateUserData({ interests: updatedInterests }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    dispatch(updateUserData({ [name]: value } as Partial<MyUserInfo>));
  };

  const handleAvailabilityChange = (newAvailability: Availability) => {
    dispatch(updateUserData({ availability: newAvailability }));
  };

  const handleShareData = (value: boolean) => {
    dispatch(updateUserData({ canShareData: value }));
  };

  const handleSave = () => {
    dispatch(updateUserProfile(userData));
  };

  return {
    loading,
    registerError,
    handleAddInterest,
    handleRemoveInterest,
    handleAddCourse,
    handleRemoveCourse,
    handleChange,
    handleAvailabilityChange,
    handleShareData,
    handleSave,
  };
}
