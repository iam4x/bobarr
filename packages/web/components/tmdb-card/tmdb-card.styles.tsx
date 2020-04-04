import styled from 'styled-components';

interface Props {
  posterPath: string;
  vote: number;
}

export const TMDBCardStyles = styled.div<Props>`
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
      background-image: url(${(props) => props.posterPath});
    }

    .overlay {
      display: flex;
      background: rgba(0, 0, 0, 0.7);
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
    color: #fff;
    font-size: 0.65em;
    position: absolute;
    top: 310px;
    left: 14px;

    .vote {
      border: 2px solid ${({ theme }) => theme.colors.navbarBackground};
      background: ${(props) => (props.vote >= 70 ? '#21d07a' : '#d2d531')};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      height: 38px;
      width: 38px;

      &::before {
        content: ' ';
        background: ${({ theme }) => theme.colors.navbarBackground};
        border-radius: 50%;
        top: 0;
        left: 0;
        height: calc(100% - 4px);
        width: calc(100% - 4px);
      }
    }

    .percent {
      position: absolute;
      top: 14px;
      left: 9px;
    }
  }
`;
