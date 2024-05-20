import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/authContext";

const CreateGPTButton = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const onClick = () => {
    console.log("Button was clicked to create a custom GPT");
    navigate(`editor`);
  };

  return (
    <div>
      <Button onClick={onClick}>Create</Button>
    </div>
  );
};

export default CreateGPTButton;
