import React from "react";
import { useDispatch } from "react-redux";
import { initGptList } from "../../redux/gpt/gptSlice";
import { Outlet, useLoaderData } from "react-router-dom";

import GPTContainer from "../../components/customGPT/GPTContainer/GPTContainer";

const GPTPage = () => {
  const dispatch = useDispatch();
  const gptLoadedData = useLoaderData();
  const gptList = gptLoadedData.gptList;
  console.log("GPT LIST FETCHED: ", gptList);
  dispatch(initGptList(gptList));
  return (
    <div>
      <GPTContainer />
      <Outlet />
    </div>
  );
};

export default GPTPage;
