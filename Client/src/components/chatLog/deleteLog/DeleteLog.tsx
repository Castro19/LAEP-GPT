import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import styles from "./DeleteLog.module.css";
import { useAppDispatch, logActions } from "@/redux";
import { useAuth } from "../../../contexts/authContext";

type DeleteLogProps = {
  logId: string;
};

const DeleteLog = ({ logId }: DeleteLogProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { userId } = useAuth();

  const onDelete = (logId: string) => {
    console.log("Delete log: ", logId);
    try {
      dispatch(logActions.deleteLog({ logId, userId }));
      navigate(`/${userId}`);
    } catch (error) {
      console.log(`Error trying to delete log ${logId}: `, error);
    }
  };

  return (
    <div>
      <button className={styles.deleteButton} onClick={() => onDelete(logId)}>
        <MdDelete />
      </button>
    </div>
  );
};

export default DeleteLog;
