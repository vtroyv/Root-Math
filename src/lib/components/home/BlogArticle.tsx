// components/BlogArticle.tsx — a single article at /blog/<slug>.
// A client component because BlockRenderer reaches ImageWithEnlarge, which
// holds state.
'use client';

import React from 'react';
import Link from 'next/link';
import BlockRenderer from '@/lib/components/learn/lessons/BlockRenderer';
import Footer from './Footer';

type Post = {
  slug: string;
  title: string;
  date: string;
  readingTime: string;
  tag: string;
  excerpt: string;
  blocks: any[];
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

export default function BlogArticle({ post }: { post: Post }) {
  return (
    <div className="rm-landing">
      <header className="rm-ruled">
        <div className="rm-container">
          <div className="rm-article">
            <Link href="/blog" className="rm-link">
              ← All articles
            </Link>

            <h1 className="rm-h2" style={{ marginBlock: '1.25rem 1rem' }}>
              {post.title}
            </h1>

            <p className="rm-card__meta" style={{ margin: 0 }}>
              <span className="rm-card__kicker">{post.tag}</span>
              <span>{formatDate(post.date)}</span>
              <span>· {post.readingTime}</span>
            </p>
          </div>
        </div>
      </header>

      <article className="rm-section rm-container">
        <div className="rm-article">
          <p className="rm-lead" style={{ marginBottom: '2rem' }}>
            {post.excerpt}
          </p>

          {post.blocks.map((block, index) => (
            <BlockRenderer key={index} block={block} />
          ))}

          <div
            style={{
              marginTop: '3rem',
              paddingTop: '1.75rem',
              borderTop: '2px dashed var(--rm-teal-soft)',
            }}
          >
            <Link href="/blog" className="rm-btn">
              ← Back to all articles
            </Link>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
