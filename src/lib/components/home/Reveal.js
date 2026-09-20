'use client';
import React from 'react';
import { useInView } from 'react-intersection-observer';

/*
Wraps a section so it fades/rises into place the first time it scrolls into
view. `triggerOnce` means it never animates again once seen, and the CSS
honours prefers-reduced-motion, so this stays a no-op for anyone who has
motion turned off.
*/
const Reveal = ({ children, as: Tag = 'div', className = '', delay = 0, ...rest }) => {
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: '-60px 0px' });

  return (
    <Tag
      ref={ref}
      className={`rm-reveal ${className}`.trim()}
      data-visible={inView ? 'true' : 'false'}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
