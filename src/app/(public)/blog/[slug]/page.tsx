import { notFound } from 'next/navigation';
import BlogArticle from '@/lib/components/home/BlogArticle';
import { blogPosts, getPost } from '@/lib/data/blogPosts';

// Static params so every article is prerendered at build time.
export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) return { title: 'Article not found' };
  return { title: `${post.title} | RootMath`, description: post.excerpt };
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  return <BlogArticle post={post} />;
}
