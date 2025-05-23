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

  const handleChangeDemographic = <
    K extends keyof UserData["demographic"],
    V extends UserData["demographic"][K],
  >(
    name: K,
    value: V
  ) => {
    dispatch(
      updateUserData({
        demographic: { ...userData.demographic, [name]: value },
      })
    );
  };

  const handleChangeFlowchartInformation = <
    K extends keyof UserData["flowchartInformation"],
    V extends UserData["flowchartInformation"][K],
  >(
    name: K,
    value: V
  ) => {
    dispatch(
      updateUserData({
        flowchartInformation: {
          ...userData.flowchartInformation,
          [name]: value,
        },
      })
    );
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
    handleChangeDemographic,
    handleChangeFlowchartInformation,
    handleTextChange,
    handleSave,
    userData, // Expose userData if needed
  };
}
