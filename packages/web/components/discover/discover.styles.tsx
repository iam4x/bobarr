import styled from 'styled-components';

export const DiscoverStyles = styled.div`
  .wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding-right: 0 32px;
  }

  .flex {
    display: flex;
    justify-content: space-evenly;
  }

  .discover {
    &--filter {
      flex: 2;
      margin-right: 12px;
    }

    &--filter-genres {
      display: flex;
      flex-wrap: wrap;

      > label {
        width: 100%;
      }
    }

    &--filter-entertainment {
      label:first-of-type {
        margin-right: 32px;
      }
    }

    &--result {
      flex: 8;
    }

    &--pagination {
      text-align: center;
      margin: 20px 0;
    }

    &--result-cards-container {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      align-items: start;
      justify-content: space-around;

      > div {
        display: inline-block;
        padding-bottom: 20px;
      }
    }
  }
`;
