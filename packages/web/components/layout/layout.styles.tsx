import styled from 'styled-components';

export const LayoutStyles = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
    Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';

  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }

  padding-top: ${({ theme }) => theme.navbarHeight};
`;
