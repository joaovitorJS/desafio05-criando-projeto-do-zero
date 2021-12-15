import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';
import Header from '../components/Header';

import { FiCalendar, FiUser } from 'react-icons/fi';

import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home() {
  
  return (
    <>
      <Header />
      <main className={styles.container}>
        <div className={styles.postContent}>
          <a>
            <strong>Como utilizar Hooks</strong>
            <p>Pensando em sincronização em vez de ciclos de vida</p>
            <div> 
              <span>
                <FiCalendar />
                <time>15 Mar 2021</time>
              </span>
              <span>
                <FiUser />
                Joseph Oliveira
              </span>
            </div>
          </a>

          <a>
            <strong>Como utilizar Hooks</strong>
            <p>Pensando em sincronização em vez de ciclos de vida</p>
            <div> 
              <span>
                <FiCalendar />
                <time>15 Mar 2021</time>
              </span>
              <span>
                <FiUser />
                Joseph Oliveira
              </span>
            </div>
          </a>

          <a>
            <strong>Como utilizar Hooks</strong>
            <p>Pensando em sincronização em vez de ciclos de vida</p>
            <div> 
              <span>
                <FiCalendar />
                <time>15 Mar 2021</time>
              </span>
              <span>
                <FiUser />
                Joseph Oliveira
              </span>
            </div>
          </a>
        </div>

        <button type="button">
          Carregar mais posts
        </button>
      </main>
    </>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };
