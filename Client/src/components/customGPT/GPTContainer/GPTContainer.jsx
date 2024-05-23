import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import GPTList from "../GPTList/GPTList";
import styles from "./GPTContainer.module.css";

const GPTContainer = () => {
  const navigate = useNavigate();
  const onClick = () => {
    console.log("Button was clicked to create a custom GPT");
    navigate(`editor`);
  };
  return (
    <div>
      <h1 className={styles.pageTitle}>Select a CalPoly Assistant</h1>
      <GPTList />
      <Button className="w-full" onClick={onClick}>
        Create
      </Button>{" "}
    </div>
  );
};

export default GPTContainer;
