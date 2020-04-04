import styled from 'styled-components';

interface Props {
  posterPath: string;
  vote: number;
}

export const SearchResultCardStyles = styled.div<Props>`
  flex-shrink: 0;
  position: relative;
  width: 220px;

  .poster {
    background-color: #fecea8;
    background-image: url(${(props) => props.posterPath});
    border-radius: 12px;
    cursor: pointer;
    margin-bottom: 24px;
    height: 330px;
    width: 220px;
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
