import React from 'react';

import { LayoutStyles } from './layout.styles';
import { NavbarComponent } from '../navbar/navbar.component';

export function LayoutComponent({ children }: { children?: React.ReactNode }) {
  return (
    <LayoutStyles>
      <NavbarComponent />
      {children}
    </LayoutStyles>
  );
}
