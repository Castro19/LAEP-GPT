import React from "react";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import styles from "./ChatLog.module.css";
import { useDispatch } from "react-redux";
import { deleteLog } from "../../redux/log/logSlice";
import { useAuth } from "../../contexts/authContext";

const DeleteLog = ({ logId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userId } = useAuth();

  const onDelete = (logId) => {
    console.log("Delete log: ", logId);
    try {
      dispatch(deleteLog({ logId, userId }));
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
