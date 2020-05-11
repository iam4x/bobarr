import styled from 'styled-components';

export const RatingDetailsStyles = styled.div`
  display: flex;

  li {
    display: flex;
    align-items: center;
    padding-right: 20px;
  }

  img {
    width: 30px;
    height: 30px;
    margin-right: 6px;
  }

  .rating-details--rate {
    font-size: 20px;
  }

  .rating-details--rate-suffix {
    font-size: 15px;
    opacity: 0.6;
  }
`;
