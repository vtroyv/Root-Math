'use client'
import React from 'react';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { findCourse, courseLabel, chapterTitle, titleFromSlug } from '@/lib/courses/courses';

/*
Learn breadcrumbs: a pale-teal box under the nav, lined up with the page content, built from the URL, e.g.
  /learn/edx-maths-1/binomial-expansion/pascals-triangle
  -> ⌂ Learn › Pure Mathematics · Year 12 › Binomial Expansion › Pascals Triangle
The last crumb is the page you're on, so it's plain text rather than a link (like Up Learn's).
Hidden on /learn itself, where the nav bar and page title already say where you are.
*/

const LABELS = { learn: 'Learn', questions: 'Questions', reviews: 'Reviews', progress: 'Progress', account: 'Account' };

// segments: ['learn', course id, chapter, lesson] on course pages
function crumbLabel(segment, i, segments) {
  const course = findCourse(segment);
  if (course) return courseLabel(course);
  if (i === 2 && findCourse(segments[1])) return chapterTitle(segments[1], segment);
  if (LABELS[segment]) return LABELS[segment];
  return titleFromSlug(segment);
}

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length < 2) return null;

  return (
    <div className="learn-crumbs-bar rm-container">
      <Breadcrumb listClassName="learn-crumbs">
        {segments.map((segment, i) => {
          const href = `/${segments.slice(0, i + 1).join('/')}`;
          const isCurrent = i === segments.length - 1;
          const label = (
            <>
              {i === 0 && <i className="bi bi-house-door" aria-hidden="true" />}
              {crumbLabel(segment, i, segments)}
            </>
          );
          return (
            <BreadcrumbItem key={href} active={isCurrent}>
              {isCurrent ? label : <Link href={href}>{label}</Link>}
            </BreadcrumbItem>
          );
        })}
      </Breadcrumb>
    </div>
  );
}
