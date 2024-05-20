import React, { useEffect } from "react";
import { useSelector } from "react-redux";

import CustomGPT from "../CustomGPT/CustomGPT";

const GPTList = () => {
  const gptList = useSelector((state) => state.gpt.gptList);
  console.log("GPTTTTT: ", gptList);
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
