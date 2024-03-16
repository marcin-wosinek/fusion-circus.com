import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1>Fusion Circus</h1>
        <h2>Traveling group of fusion events organizers</h2>
      </div>
    </main>
  );
}
