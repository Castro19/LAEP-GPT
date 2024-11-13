import { useAppDispatch, useAppSelector } from "@/redux";
import { updateUserProfile, updateUserData } from "../redux/user/userSlice";
import { MyUserInfo } from "../types";

export function useUserData() {
  const dispatch = useAppDispatch();
  const { loading, registerError } = useAppSelector((state) => state.auth);
  const userData = useAppSelector((state) => state.user.userData);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    dispatch(updateUserData({ [name]: value } as Partial<MyUserInfo>));
  };

  const handleAddItem = (field: keyof MyUserInfo, value: string) => {
    const currentArray = userData[field] as string[];
    if (!currentArray.includes(value)) {
      dispatch(updateUserData({ [field]: [...currentArray, value] }));
    }
  };

  const handleRemoveItem = (field: keyof MyUserInfo, value: string) => {
    const currentArray = userData[field] as string[];
    dispatch(
      updateUserData({ [field]: currentArray.filter((item) => item !== value) })
    );
  };

  const handleSave = () => {
    dispatch(updateUserProfile());
  };

  return {
    loading,
    registerError,
    handleAddItem,
    handleRemoveItem,
    handleChange,
    handleSave,
    userData, // Expose userData if needed
  };
}
