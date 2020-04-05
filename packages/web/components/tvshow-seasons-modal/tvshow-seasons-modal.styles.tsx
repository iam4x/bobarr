import styled from 'styled-components';

export const TVShowSeasonsModalComponentStyles = styled.div`
  color: ${({ theme }) => theme.colors.navbarBackground};

  .tv-show {
    display: flex;
    align-items: center;
    margin-bottom: 12px;

    .title {
      font-size: 1.5em;
      font-weight: bold;
    }

    .status {
      margin-left: auto;
    }
  }

  .season-row {
    align-items: center;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    margin-bottom: 8px;
    padding: 8px 10px;
    transition: 0.1s linear;
    width: 100%;

    &.selected {
      border: 1px solid ${({ theme }) => theme.colors.blue};
    }
  }

  .season-number {
    font-size: 1.1em;
    font-weight: 600;
  }

  .season-episodes-count {
    font-size: 0.9em;
  }
`;
