'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const aboutLinks = [
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/mission', label: 'Mission' },
  { href: '/blog', label: 'Blog' },
];

function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const aboutRef = useRef(null);

  // Close the About dropdown on an outside click or Escape.
  useEffect(() => {
    if (!aboutOpen) return;

    const onPointerDown = (event) => {
      if (aboutRef.current && !aboutRef.current.contains(event.target)) {
        setAboutOpen(false);
      }
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setAboutOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [aboutOpen]);

  const closeAll = () => {
    setMenuOpen(false);
    setAboutOpen(false);
  };

  return (
    <nav className="rm-nav">
      <div className="rm-container rm-nav__inner">
        <Link href="/" className="rm-nav__brand" onClick={closeAll}>
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
          <li>
            <Link href="/courses" className="rm-nav__link" onClick={closeAll}>
              Courses
            </Link>
          </li>
          <li>
            <Link href="/teachers" className="rm-nav__link" onClick={closeAll}>
              Teachers
            </Link>
          </li>

          <li className="rm-nav__dropdown" ref={aboutRef}>
            <button
              type="button"
              className="rm-nav__link"
              onClick={() => setAboutOpen((open) => !open)}
              aria-expanded={aboutOpen}
            >
              About <i className="bi bi-chevron-down" style={{ fontSize: '0.7rem' }} />
            </button>

            {aboutOpen && (
              <ul className="rm-nav__menu">
                {aboutLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} onClick={closeAll}>
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li className="rm-nav__divider" aria-hidden="true" />
                <li>
                  <Link href="/contact" onClick={closeAll}>
                    Contact us
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li>
            <Link href="/sign-in" className="rm-nav__link" onClick={closeAll}>
              Log in
            </Link>
          </li>
          <li>
            <Link
              href="/sign-up"
              className="rm-btn rm-btn--primary rm-nav__cta"
              onClick={closeAll}
            >
              Start free
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
