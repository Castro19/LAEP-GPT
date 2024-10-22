import { useEffect } from "react";
import { gptActions, useAppDispatch, useAppSelector } from "@/redux";

import CustomGPT from "../customGptCard/CustomGPTCard";
import { viewGPTs } from "@/redux/gpt/crudGPT";

const GPTList = () => {
  const gptList = useAppSelector((state) => state.gpt.gptList);
  const userId = useAppSelector((state) => state.auth.userId);
  const dispatch = useAppDispatch();

  // FIX: Maybe put this into a thunk (gptListener)
  useEffect(() => {
    const fetchGptList = async () => {
      if (userId) {
        try {
          const fetchedGptList = await viewGPTs(userId);
          console.log("FGL: ", fetchedGptList.gptList);
          dispatch(gptActions.initGptList(fetchedGptList.gptList));
        } catch (error) {
          console.error("Error fetching GPT list: ", error);
        }
      }
    };
    fetchGptList();
  }, [userId, dispatch]);

  return (
    <div>
      {gptList.map((asst, index) => (
        <CustomGPT
          key={index}
          asst={asst.id}
          urlPhoto={asst.urlPhoto}
          title={asst.title}
          desc={asst.desc}
        />
      ))}
    </div>
  );
};

export default GPTList;
