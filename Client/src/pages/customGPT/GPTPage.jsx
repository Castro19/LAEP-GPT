import React from "react";
import styles from "./GPTPage.module.css";
import { Outlet } from "react-router-dom";

import GPTContainer from "../../components/customGPT/GPTContainer/GPTContainer";

const GPTPage = () => {
  return (
    <div className={styles.container}>
      <GPTContainer />
      <Outlet />
    </div>
  );
};

export default GPTPage;
