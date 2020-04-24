import React, { ReactNode } from 'react';
import { DiscoverFilterSectionStyles } from './discover-filter-section.styles';

interface DiscoverFilterSectionComponentProps {
  title: string;
  children: ReactNode;
}
export function DiscoverFilterSectionComponent(
  props: DiscoverFilterSectionComponentProps
) {
  const { title, children } = props;
  return (
    <DiscoverFilterSectionStyles>
      <h6>{title}</h6>
      {children}
    </DiscoverFilterSectionStyles>
  );
}
