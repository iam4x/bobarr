import styled from 'styled-components';

interface Props {
  rating: number;
}

export const RatingStyles = styled.div<Props>`
  color: #fff;
  font-size: 11px;
  position: relative;
  width: 38px;
  height: 38px;

  .vote {
    border: 2px solid ${({ theme }) => theme.colors.navbarBackground};
    background: ${(props) => (props.rating >= 70 ? '#21d07a' : '#d2d531')};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    height: 100%;
    width: 100%;

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
    top: 0;
    left: 0;
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
  }
`;
