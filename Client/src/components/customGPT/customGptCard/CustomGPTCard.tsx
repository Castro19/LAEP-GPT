import { Avatar, AvatarImage } from "@/components/ui/avatar";
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
        <Avatar className="w-10 h-10 rounded-full overflow-hidden transition-transform hover:scale-110">
          <AvatarImage
            src={urlPhoto || "/imgs/test.png"}
            alt="Assistant Photo"
          />
        </Avatar>
        <div className={styles.title}>{title}</div>
        <p className={styles.description}>{desc}</p>
      </div>
    </button>
  );
};

export default CustomGPT;
