import styled from 'styled-components';

export const NavbarStyles = styled.div`
  background: ${({ theme }) => theme.colors.navbarBackground};
  color: #fff;
  height: ${({ theme }) => theme.navbarHeight}px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100vw;

  .wrapper {
    align-items: center;
    display: flex;
    height: 100%;
    margin-left: 48px;
    margin-right: 48px;
  }

  .logo {
    font-family: monospace;
    font-size: 2.8em;
    font-weight: bold;
    margin-right: 72px;
    text-shadow: -1px -1px 2px rgba(0, 0, 0, 0.8);
  }

  .links {
    display: flex;

    a {
      border: 1px solid transparent;
      border-radius: 2px;
      color: #fff;
      cursor: pointer;
      display: block;
      margin-right: 24px;
      padding: 3px 5px;
      text-shadow: -1px -1px 2px rgba(0, 0, 0, 0.8);
      text-decoration: none;
      transition: 0.1s linear;

      &.active,
      &:hover {
        border-color: #fff;
      }

      &:last-child {
        margin-right: 0;
      }
    }
  }

  .region-select {
    align-items: center;
    border-radius: 2px;
    border: 1px solid #fff;
    cursor: pointer;
    display: flex;
    font-size: 0.9em;
    justify-items: center;
    margin-left: auto;
    padding: 3px 5px;
    transition: 0.1s linear;

    &:hover {
      background: #fff;
      color: ${({ theme }) => theme.colors.navbarBackground};
    }
  }
`;
