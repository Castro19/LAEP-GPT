import React from "react";
import GPTPageTitle from "./GPTPageTitle/GPTPageTitle";
import CreateGPTButton from "./GPTs/createGPTs/createGPTButton/CreateGPTButton";
import GPTList from "./GPTs/viewGPTs/GPTList/GPTList";

const GPTContainer = () => {
  return (
    <div>
      <GPTPageTitle />
      <GPTList />
      <CreateGPTButton />
    </div>
  );
};

export default GPTContainer;
