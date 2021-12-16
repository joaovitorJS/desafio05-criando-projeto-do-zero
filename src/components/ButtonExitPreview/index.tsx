import styles from './styles.module.scss';

export function ButtonExitPreview() {
  return (
    <button
      type='button'
      className={styles.buttonContainer}
    >
      Sair do modo Preview
    </button>
  )
}
