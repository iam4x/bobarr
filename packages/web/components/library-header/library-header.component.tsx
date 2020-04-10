import React from 'react';
import styled from 'styled-components';

import { MissingComponent } from '../missing/missing.component';
import { DownloadingComponent } from '../downloading/downloading.component';

const LibraryHeaderComponentStyles = styled.div`
  background: #a4bcc2;
  padding: 24px 0;
`;

export function LibraryHeaderComponent({ types }: { types: string[] }) {
  return (
    <LibraryHeaderComponentStyles>
      <DownloadingComponent types={types} />
      <MissingComponent />
    </LibraryHeaderComponentStyles>
  );
}
