import React from "react";
import CustomGPT from "../CustomGPT/CustomGPT";
import styles from "./GPTList.module.css";

const asst_ids = [1, 2, 3, 4, 5];
const GPTList = () => {
  return (
    <div>
      {asst_ids.map((asst, index) => (
        <CustomGPT key={index} asst_id={asst} />
      ))}
    </div>
  );
};

export default GPTList;
