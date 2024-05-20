import React from "react";
import UserAvatar from "@/components/userProfile/UserAvatar";
import styles from "./CustomGPT.module.css";

const CustomGPT = ({ asst, urlPhoto, title, desc }) => {
  const onCardClick = () => {
    console.log("Assistant ID: ", asst);
  };

  return (
    <button onClick={onCardClick} className={styles.cardButton}>
      <div className={styles.card}>
        <UserAvatar userPhoto={urlPhoto} />
        <div className={styles.title}>{title}</div>
        <p className={styles.description}>{desc}</p>
      </div>
    </button>
  );
};

export default CustomGPT;
