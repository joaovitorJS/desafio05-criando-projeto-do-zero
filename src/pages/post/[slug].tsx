import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import { getPrismicClient } from '../../services/prismic';
import Prismic from '@prismicio/client';
import PrismicDOM from 'prismic-dom';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { RichText } from 'prismic-dom';
import { useRouter } from 'next/router';
import { ButtonExitPreview } from '../../components/ButtonExitPreview';
import { UtterancesComments } from '../../components/UtterancesComments';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const router = useRouter();

  function timeReadingCalculation(content: {heading: string, body: {text: string}[]}[]) {
    const numberWords = content.reduce((acc, element, index) => {
      const countWords = element.heading.split(' ').length + PrismicDOM.RichText.asText(element.body).split(' ').length;
      return acc + countWords;
    }, 0);

    
    const time = Math.floor(numberWords / 200) + 1; // 200 palavras por minuto.
    
    return time;
  }
 
  if (router.isFallback)  
    return ( <h1>Carregando...</h1>) 
  else 
    return (
    <>
      <Head>
        <title> {post.data.title} | Spacetraveling </title>
      </Head>

      <main className={styles.container}>
        <img src={post.data.banner.url} alt="" />

        <article className={styles.post}>
          <header>
            <h1>{post.data.title}</h1>
            <div className={commonStyles.infos}> 
              <span>
                <FiCalendar />
                <time>{format( new Date(post.first_publication_date), 'd MMM y', { locale: ptBR })}</time>
              </span>
              <span>
                <FiUser />
                {post.data.author}
              </span>
              <span>
                <FiClock />
                {timeReadingCalculation(post.data.content)} min
              </span>
            </div>
          </header>

          {post.data.content.map((contentSection, index) => (
            <section key={index}>
              <h2>{contentSection.heading}</h2>
              <div
                dangerouslySetInnerHTML={{ __html: RichText.asHtml(contentSection.body)}}
              />
            </section>
          ))}
        </article>

        <div className={styles.footer}>
          <div>
            <span>
              <p>Como utilizar Hooks</p>
              <Link href="/">
                <a>Post anterior</a>
              </Link>
            </span>
            <span>
              <p>Criando um app CRA do Zero</p>
              <Link href="/">
                <a>Próximo post</a>
              </Link> 
            </span>
          </div>

          <UtterancesComments />
          <ButtonExitPreview />
        </div>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')], {
      fetch: ['posts.title'],
      pageSize: 2, 
    }
  );
  
  
  let paths = posts.results.map(post => {
    return {
      params: {
        slug: post.uid,
      }
    }
  });

  return {
    paths,
    fallback: true, 
    // true, false, blocking
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
 

  const { slug } = params;
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {});

  return {
    props: {
      post: response,
    },
    redirect: 60 * 60, // 1 h
  }
};
