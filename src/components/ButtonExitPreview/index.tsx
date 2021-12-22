import { useRouter } from 'next/router';
import styles from './styles.module.scss';

export function ButtonExitPreview() {
  const router = useRouter();
  
  function hanldePreviewMode () {
    router.push('/api/exit-preview');
  }
  
  return (
    <button
      type='button'
      className={styles.buttonContainer}
      onClick={hanldePreviewMode}
    >
      Sair do modo Preview
    </button>
  )
}
