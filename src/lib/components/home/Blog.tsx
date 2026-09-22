// components/Blog.tsx — the /blog index.
import React from 'react';
import Link from 'next/link';
import Reveal from './Reveal';
import Footer from './Footer';
import { getPostsNewestFirst } from '@/lib/data/blogPosts';

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

export default function Blog() {
  const posts = getPostsNewestFirst();

  return (
    <div className="rm-landing">
      <header className="rm-ruled">
        <div className="rm-container">
          <div className="rm-section-head">
            <span className="rm-eyebrow">
              <i className="bi bi-pencil-fill" /> The blog
            </span>
            <h1 className="rm-display">
              Notes in the <span className="rm-underline">margin</span>
            </h1>
            <p className="rm-lead">
              Revision that works, how the exam boards actually differ, and what we are
              learning while we build RootMath.
            </p>
          </div>
        </div>
      </header>

      <section className="rm-section rm-container">
        <div className="rm-grid rm-grid--2">
          {/* The slot fades in, the link inside it is the card — the same
              wrapper pattern the landing page uses for its note cards. */}
          {posts.map((post, index) => (
            <Reveal key={post.slug} className="rm-cardslot" delay={index * 90}>
              <Link href={`/blog/${post.slug}`} className="rm-card rm-card--link">
                <span className="rm-card__meta">
                  <span className="rm-card__kicker">{post.tag}</span>
                  <span>{formatDate(post.date)}</span>
                  <span>· {post.readingTime}</span>
                </span>

                <h2 className="rm-h3">{post.title}</h2>
                <p className="rm-card__body">{post.excerpt}</p>

                <div className="rm-card__foot">
                  <span className="rm-link">Read the article →</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
