import styled from 'styled-components';

export const TMDBCardStyles = styled.div`
  flex-shrink: 0;
  position: relative;
  width: 220px;

  .poster--container {
    border-radius: 12px;
    cursor: pointer;
    height: 330px;
    margin-bottom: 24px;
    position: relative;
    overflow: hidden;
    width: 220px;

    .poster,
    .overlay {
      height: 330px;
      width: 220px;
      left: 0;
      top: 0;
      position: absolute;
    }

    .poster {
      background: #fecea8;
    }

    .overlay {
      display: flex;
      background: rgba(0, 0, 0, 0.8);
      align-items: center;
      justify-content: center;
      flex-direction: column;
      transition: 0.1s linear;
      opacity: 0;

      &:hover {
        opacity: 1;
      }

      .anticon {
        color: #fff;
        font-size: 2em;
      }
    }

    .action-label {
      color: #fff;
      font-size: 1em;
      text-transform: uppercase;
      font-weight: 900;
      font-family: monospace;
      margin-top: 10px;
    }
  }

  .name {
    font-weight: 700;
    margin-bottom: 2px;
  }

  .date {
    text-transform: lowercase;
    font-size: 0.8em;
    font-weight: 300;
    color: rgba(0, 0, 0, 0.5);
  }

  .vote--container {
    position: absolute;
    top: 310px;
    left: 14px;
  }
`;
