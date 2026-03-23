import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      
      {/* ❌ Navbar removed from Home */}

      <div className={styles.centerWrapper}>
        <div className={styles.card}>
          
          <h1 className={styles.heading}>
            WELCOME TO <span className={styles.highlight}>LEARNIX 🚀</span>
          </h1>

          <p className={styles.subtext}>
            Real-time coding + video collaboration platform
          </p>

          <div className={styles.buttonContainer}>
            <Link href="/auth/signup" className={styles.primaryBtn}>
              Sign Up
            </Link>

            <Link href="/auth/login" className={styles.secondaryBtn}>
              Login
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}