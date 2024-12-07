import { useAppDispatch, useAppSelector } from "@/redux";
import { updateUserProfile, updateUserData } from "../redux/user/userSlice";
import { UserData } from "@polylink/shared/types";

export function useUserData() {
  const dispatch = useAppDispatch();
  const { loading, registerError } = useAppSelector((state) => state.auth);
  const userData = useAppSelector((state) => state.user.userData);

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    dispatch(updateUserData({ [name]: value } as Partial<UserData>));
  };

  const handleChange = <K extends keyof UserData>(
    name: K,
    value: UserData[K]
  ) => {
    dispatch(updateUserData({ [name]: value } as Partial<UserData>));
  };

  const handleAddItem = (field: keyof UserData, value: string) => {
    const currentArray = userData[field] as string[];
    if (!currentArray.includes(value)) {
      dispatch(updateUserData({ [field]: [...currentArray, value] }));
    }
  };

  const handleRemoveItem = (field: keyof UserData, value: string) => {
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
    handleTextChange,
    handleSave,
    userData, // Expose userData if needed
  };
}
