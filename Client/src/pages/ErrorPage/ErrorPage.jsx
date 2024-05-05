import { Link } from "react-router-dom";
import styles from "./ErrorPage.module.css";
import errorImage from "./imgs/errorPic.png";

const ErrorPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>SORRY</div>
      <img className={styles.errImg} src={errorImage} />
      <div className={styles.subtitle}>We couldn't find that page</div>
      <div className={styles.message}>
        <p>404: Go back to</p>
        <Link to="/">Homepage</Link>
      </div>
    </div>
  );
};

export default ErrorPage;
