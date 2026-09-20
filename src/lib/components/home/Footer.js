import React from 'react';
import Link from 'next/link';

const columns = [
  {
    heading: 'Courses',
    links: [
      { label: 'Maths A Level', href: '/courses' },
      { label: 'Further Maths A Level', href: '/courses' },
      { label: 'GCSE Maths', href: '/courses' },
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
      { label: 'Log in', href: '/sign-in' },
      { label: 'Create account', href: '/sign-up' },
    ],
  },
];

const socials = [
  { label: 'Instagram', icon: 'bi-instagram' },
  { label: 'Facebook', icon: 'bi-facebook' },
  { label: 'Twitter', icon: 'bi-twitter' },
  { label: 'TikTok', icon: 'bi-tiktok' },
  { label: 'YouTube', icon: 'bi-youtube' },
];

const Footer = () => (
  <footer className="rm-footer">
    <div className="rm-container">
      <div className="rm-footer__grid">
        <div>
          <p className="rm-footer__brand">RootMath</p>
          <p className="rm-footer__tagline">
            Say hello to the end of hefty tuition fees.
          </p>
          <div className="rm-footer__socials">
            {socials.map((social) => (
              <a key={social.label} href="/" aria-label={social.label}>
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
        Copyright © Root Math Limited {new Date().getFullYear()}. Registered company in
        England and Wales (number: 10010657). VAT Reg. No GB 249 7670 58.
      </p>
    </div>
  </footer>
);

export default Footer;
