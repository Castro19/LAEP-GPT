import UserAvatar from "@/components/userProfile/UserAvatar.tsx";
import styles from "./CustomGPTCard.module.css";

type CustomGPTProps = {
  asst: string | undefined;
  urlPhoto: string | undefined;
  title: string;
  desc: string;
};
const CustomGPT = ({ asst, urlPhoto, title, desc }: CustomGPTProps) => {
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
