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
  last_publication_date: string | null;
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
  preview: boolean;
  navigationPosts: {
    previousPost: {
      uid: string | null;
      title: string | null;
    },
    nextPost: {
      uid: string | null;
      title: string | null;
    }
  }
}

export default function Post({ post, preview, navigationPosts }: PostProps) {
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
    return ( <h1>Carregando...</h1>); 
  
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
            <span>
              { `* editado em ${format( new Date(post.last_publication_date), 'd MMM y', { locale: ptBR })}, às ${format( new Date(post.last_publication_date), 'HH:mm', { locale: ptBR })}`}
            </span>
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
            
            { navigationPosts?.previousPost.uid ?
              (
                <span>
                  <p>{navigationPosts.previousPost.title}</p>
                  <Link href={`/post/${navigationPosts.previousPost.uid}`}>
                    <a>Post anterior</a>
                  </Link>
                </span>
              ) : (
                <span></span>
              )
            }
            
            { navigationPosts?.nextPost.uid ?
              (
                <span>
                  <p>{navigationPosts.nextPost.title}</p>
                  <Link href={`/post/${navigationPosts.nextPost.uid}`}>
                    <a>Próximo post</a>
                  </Link> 
                </span>
              ) : (
                <span></span>
              )
            }
          </div>

          <UtterancesComments />
          {
            preview &&
              <ButtonExitPreview  />
          }
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

export const getStaticProps: GetStaticProps = async ({ params, preview = false, previewData }) => {
 

  const { slug } = params;
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {
    ref: previewData?.ref ?? null,
  });

  const previousPost = (await prismic.query(
    Prismic.Predicates.at('document.type', 'posts'),
    {
      pageSize: 1,
      after: `${response.id}`,
      orderings: '[document.last_publication_date desc]'
    }
  )).results[0];

  const nextPost = (await prismic.query(
    Prismic.Predicates.at('document.type', 'posts'),
    {
      pageSize: 1,
      after: `${response.id}`,
      orderings: '[document.last_publication_date]'
    }
  )).results[0];

  const navigationPosts = {
    previousPost: {
      uid: previousPost?.uid ?? null,
      title: previousPost?.data.title ?? null,
    },
    nextPost: {
      uid: nextPost?.uid ?? null,
      title: nextPost?.data.title ?? null,
    }
  }

  return {
    props: {
      post: response,
      preview,
      navigationPosts,
    },
    redirect: 60 * 60, // 1 h
  }
};
