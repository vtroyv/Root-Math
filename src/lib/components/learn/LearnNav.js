'use client'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useClerk } from '@clerk/nextjs';
import { useGetCoursesQuery, useGetDueReviewsQuery } from '@/lib/redux/slices/apiSlice';
import { localToday } from '@/lib/reviews/localDay';
import { courseLabel } from '@/lib/courses/courses';

/*
The learn area's nav bar. Same markup and `rm-nav` classes as the home nav (src/lib/components/home/Navigation.js),
in teal (.rm-nav--learn in globals.css). The page you're on is a filled white pill (aria-current="page").
COURSES lists the student's own courses (GET /api/courses), grouped by qualification.
On phones the links fold into the ☰ menu, as on the home page.
*/

// questions + lessons with review cards due, across all courses (src/lib/docs/reviews-page.md)
function useReviewsDue() {
  const [today] = useState(localToday)
  const { data } = useGetDueReviewsQuery(today)
  return [...(data?.questions ?? []), ...(data?.lessons ?? [])].filter((entry) => entry.cardsDue > 0).length
}

export default function LearnNav() {
  const pathname = usePathname()
  const { signOut } = useClerk()
  const { data } = useGetCoursesQuery()
  const reviewsDue = useReviewsDue()

  const [menuOpen, setMenuOpen] = useState(false)    // the phone menu
  const [dropdown, setDropdown] = useState(null)     // 'courses' | 'account' | null
  const navRef = useRef(null)

  // close everything when the page changes
  useEffect(() => {
    setMenuOpen(false)
    setDropdown(null)
  }, [pathname])

  // close a dropdown on an outside click or Escape (same as the home nav)
  useEffect(() => {
    if (!dropdown) return
    const onPointerDown = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) setDropdown(null)
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setDropdown(null)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [dropdown])

  const isActive = (href) => (href === '/learn' ? pathname === '/learn' : pathname.startsWith(href))
  const toggle = (name) => setDropdown((open) => (open === name ? null : name))

  const navLink = (href, text) => (
    <li>
      <Link href={href} className="rm-nav__link" aria-current={isActive(href) ? 'page' : undefined}>
        {text}
      </Link>
    </li>
  )

  // [['A level Maths', [course, ...]], ...]
  const courseGroups = Object.entries(
    (data?.courses ?? []).reduce((groups, course) => {
      (groups[course.qualification] ??= []).push(course)
      return groups
    }, {})
  )
  const inACourse = (data?.courses ?? []).some((course) => pathname.startsWith(`/learn/${course.id}`))

  return (
    <nav className="rm-nav rm-nav--learn" ref={navRef}>
      <div className="rm-container rm-nav__inner">
        <Link href="/" className="rm-nav__brand">
          RootMath
        </Link>

        <button
          type="button"
          className="rm-nav__toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation menu"
        >
          <i className={menuOpen ? 'bi bi-x' : 'bi bi-list'} />
        </button>

        <ul className="rm-nav__links" data-open={menuOpen}>
          {navLink('/learn', 'Learn')}
          <li>
            <span className="rm-nav__link">Exams</span>
          </li>
          {navLink('/learn/questions', 'Questions')}
          {navLink('/learn/progress', 'Progress')}
          {navLink('/learn/reviews', <>Reviews{reviewsDue > 0 && <span className="rm-nav__count">{reviewsDue}</span>}</>)}

          <li className="rm-nav__dropdown">
            <button
              type="button"
              className="rm-nav__link"
              onClick={() => toggle('courses')}
              aria-expanded={dropdown === 'courses'}
              aria-current={inACourse ? 'page' : undefined}
            >
              Courses <i className="bi bi-chevron-down" style={{ fontSize: '0.7rem' }} />
            </button>
            {dropdown === 'courses' && (
              <ul className="rm-nav__menu">
                {!data && <li className="rm-nav__menu-note">Loading your courses…</li>}
                {courseGroups.map(([qualification, courses], i) => (
                  <Fragment key={qualification}>
                    {i > 0 && <li className="rm-nav__divider" aria-hidden="true" />}
                    <li className="rm-nav__menu-label">{qualification}</li>
                    {courses.map((course) => (
                      <li key={course.id}>
                        {course.lessons.total > 0 ? (
                          <Link href={`/learn/${course.id}`}>{courseLabel(course)}</Link>
                        ) : (
                          <span className="rm-nav__menu-note">{courseLabel(course)} · coming soon</span>
                        )}
                      </li>
                    ))}
                  </Fragment>
                ))}
              </ul>
            )}
          </li>

          <li className="rm-nav__dropdown">
            <button
              type="button"
              className="rm-nav__link"
              onClick={() => toggle('account')}
              aria-expanded={dropdown === 'account'}
              aria-current={isActive('/learn/account') ? 'page' : undefined}
            >
              Account <i className="bi bi-chevron-down" style={{ fontSize: '0.7rem' }} />
            </button>
            {dropdown === 'account' && (
              <ul className="rm-nav__menu">
                <li>
                  <Link href="/learn/account">Profile</Link>
                </li>
                <li className="rm-nav__divider" aria-hidden="true" />
                <li>
                  <button type="button" onClick={() => signOut({ redirectUrl: '/' })}>
                    Sign out
                  </button>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </nav>
  )
}
