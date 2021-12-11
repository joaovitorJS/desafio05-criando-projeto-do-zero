import styles from './header.module.scss';

export default function Header() {
  return (
    <header className={styles.container}>
      <div className={styles.content}>
        <img src="/images/logo.svg" alt="Spacetraveling" />
      </div>
    </header>
  );
}
