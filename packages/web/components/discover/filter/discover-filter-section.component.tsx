import React, { ReactNode } from 'react';
import { FilterDiscoverySectionStyles } from './discover-filter-section.styles';

interface FilterDiscoverySectionComponentProps {
  title: string;
  children: ReactNode;
}
export function FilterDiscoverySectionComponent(
  props: FilterDiscoverySectionComponentProps
) {
  const { title, children } = props;
  return (
    <FilterDiscoverySectionStyles>
      <h6>{title}</h6>
      {children}
    </FilterDiscoverySectionStyles>
  );
}
