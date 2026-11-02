import React from 'react';

/*
Used to fade sections in as they scrolled into view. Removed so a page appears complete
the moment you arrive, and because scroll animations go against the site's no-animation
preference. Kept as a plain wrapper so the sections using it don't all have to change;
`delay` is ignored.
*/
const Reveal = ({ children, as: Tag = 'div', delay: _delay = 0, ...rest }) => <Tag {...rest}>{children}</Tag>;

export default Reveal;
