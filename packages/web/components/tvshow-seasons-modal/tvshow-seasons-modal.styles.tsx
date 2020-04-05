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

  .seasons {
    display: flex;
    flex-wrap: wrap;
  }

  .season-row {
    align-items: center;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    margin-bottom: 8px;
    margin-right: 4px;
    margin-left: 4px;
    padding: 8px 10px;
    transition: 0.1s linear;
    width: calc(33% - 8px);

    &.selected {
      color: #1890ff;
      background: #e6f7ff;
      border-color: #91d5ff;
    }

    &.in-library {
      cursor: not-allowed;
      color: #52c41a;
      background-color: #f6ffed;
      border: 1px solid #b7eb8f;
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
