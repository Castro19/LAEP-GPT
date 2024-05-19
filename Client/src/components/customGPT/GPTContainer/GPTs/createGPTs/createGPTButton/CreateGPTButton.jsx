import React from "react";
import { Button } from "@/components/ui/button";
const CreateGPTButton = () => {
  const onClick = () => {
    console.log("Button was clicked to create a custom GPT");
  };

  return (
    <div>
      <Button onClick={onClick}>Create</Button>
    </div>
  );
};

export default CreateGPTButton;
