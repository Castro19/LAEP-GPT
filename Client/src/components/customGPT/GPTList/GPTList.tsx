import { useEffect } from "react";
import { useAppSelector } from "@/redux";

import CustomGPT from "../customGptCard/CustomGPTCard";

const GPTList = () => {
  const gptList = useAppSelector((state) => state.gpt.gptList);

  useEffect(() => {
    console.log("GPTLIST: ", gptList);
  }, [gptList]);

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
