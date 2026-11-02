import React from 'react';
import Link from 'next/link';
import { SOCIALS } from '@/lib/socials';

const columns = [
  {
    heading: 'Courses',
    /* Each course links to its own section on the courses page — the ids match
       the `id` field of the course array in CouresesPage.tsx. */
    links: [
      { label: 'Maths A Level', href: '/courses#a-level-maths' },
      { label: 'Further Maths A Level', href: '/courses#a-level-further-maths' },
      { label: 'GCSE Maths', href: '/courses#gcse-maths' },
      { label: 'STEP', href: '/courses#step' },
      { label: 'TMUA', href: '/courses#tmua' },
      { label: 'Pricing', href: '/pricing' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'Our mission', href: '/mission' },
      { label: 'Features', href: '/features' },
      { label: 'For teachers', href: '/teachers' },
      { label: 'Blog', href: '/blog' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { label: 'Contact us', href: '/contact' },
      { label: 'Privacy policy', href: '/privacy' },
    ],
  },
];

const Footer = () => (
  <footer className="rm-footer">
    <div className="rm-container">
      <div className="rm-footer__grid">
        <div>
          <p className="rm-footer__brand">RadixMaths</p>
          <p className="rm-footer__tagline">
            Say hello to the end of hefty tuition fees.
          </p>
          <div className="rm-footer__socials">
            {SOCIALS.map((social) => (
              <a key={social.label} href={social.href} aria-label={social.label}>
                <i className={`bi ${social.icon}`} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        {columns.map((column) => (
          <div key={column.heading}>
            <h4>{column.heading}</h4>
            <ul>
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="rm-footer__legal">
        {/* add the company and VAT numbers here once RadixMaths is registered (the old ones were Up Learn's) */}
        Copyright © RadixMaths {new Date().getFullYear()}.
      </p>
    </div>
  </footer>
);

export default Footer;
