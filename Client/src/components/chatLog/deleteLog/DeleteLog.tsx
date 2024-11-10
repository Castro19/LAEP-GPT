import styles from "./DeleteLog.module.css";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import {
  useAppDispatch,
  logActions,
  useAppSelector,
  messageActions,
} from "@/redux";

type DeleteLogProps = {
  logId: string;
};

const DeleteLog = ({ logId }: DeleteLogProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { userId } = useAppSelector((state) => state.auth);
  const isDeleting = useAppSelector((state) =>
    state.log.deletingLogIds.includes(logId)
  );

  const onDelete = () => {
    if (isDeleting) return; // Prevent multiple deletion attempts
    try {
      if (userId) {
        dispatch(logActions.deleteLog({ logId }))
          .unwrap()
          .then(() => {
            navigate(`/chat`);
            dispatch(messageActions.resetMsgList());
            dispatch(messageActions.toggleNewChat(true));
          })
          .catch((error) =>
            console.error(`Error trying to delete log ${logId}: `, error)
          );
      }
    } catch (error) {
      console.error(`Error trying to delete log ${logId}: `, error);
    }
  };

  return (
    <div>
      <button
        className={`${styles.deleteButton} ${isDeleting ? styles.deleting : ""}`}
        onClick={onDelete}
        aria-label={isDeleting ? "Deleting..." : "Delete log"}
        disabled={isDeleting}
      >
        <MdDelete />
      </button>
    </div>
  );
};

export default DeleteLog;
