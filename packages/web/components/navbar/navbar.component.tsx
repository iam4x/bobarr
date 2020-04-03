import React from 'react';
import cx from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { NavbarStyles } from './navbar.styles';

const links = [
  ['Movies', '/library/movies'],
  ['TV Shows', '/library/tvshows'],
  ['Search', '/search'],
];

export function NavbarComponent() {
  const router = useRouter();

  return (
    <NavbarStyles>
      <div className="wrapper">
        <div className="logo">bobarr</div>
        <div className="links">
          {links.map(([name, url]) => (
            <Link key={url} href={url} passHref={true}>
              <a className={cx({ active: url === router.pathname })}>{name}</a>
            </Link>
          ))}
        </div>
        <div className="region-select">US</div>
      </div>
    </NavbarStyles>
  );
}
