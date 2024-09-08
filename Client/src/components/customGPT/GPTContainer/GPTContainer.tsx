import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import GPTList from "../GPTList/GPTList";
import styles from "./GPTContainer.module.css";
import { useAppSelector } from "@/redux"; 

const GPTContainer = () => {
  const navigate = useNavigate();
  const userType = useAppSelector((state) => state.auth.userType);

  const onClick = () => {
    console.log("Button was clicked to create a custom GPT");
    navigate(`editor`);
  };

  return (
    <div>
      <h1 className={styles.pageTitle}>Select a CalPoly Assistant</h1>
      <GPTList />
      
      {/* only render the button if userType is not student */}
      {userType !== "student" && (
        <Button className="w-full" onClick={onClick}>
          Create A New Assistant
        </Button>
      )}
    </div>
  );
};

export default GPTContainer;
