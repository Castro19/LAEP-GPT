import { Link } from "react-router-dom";
import styles from "./ErrorPage.module.css";

const ErrorPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>SORRY</div>
      <img className={styles.errImg} src="/imgs/errorPic.png" />
      <div className={styles.subtitle}>We couldnt find that page</div>
      <div className={styles.message}>
        <p>404: Go back to</p>
        <Link to="/">Homepage</Link>
      </div>
    </div>
  );
};

export default ErrorPage;
