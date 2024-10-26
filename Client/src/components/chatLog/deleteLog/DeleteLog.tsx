import styles from "./DeleteLog.module.css";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, logActions, useAppSelector } from "@/redux";

type DeleteLogProps = {
  logId: string;
};

const DeleteLog = ({ logId }: DeleteLogProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { userId } = useAppSelector((state) => state.auth);

  const onDelete = (logId: string) => {
    try {
      if (userId) {
        dispatch(logActions.deleteLog({ logId }));
        navigate(`/${userId}`);
      }
    } catch (error) {
      console.error(`Error trying to delete log ${logId}: `, error);
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
