import React from 'react';

import { NavbarComponent } from '../navbar/navbar.component';
import { LayoutStyles } from './layout.styles';

export function LayoutComponent({ children }: { children?: React.ReactNode }) {
  return (
    <LayoutStyles>
      <NavbarComponent />
      {children}
    </LayoutStyles>
  );
}
