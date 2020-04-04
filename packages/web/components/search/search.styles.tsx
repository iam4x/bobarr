import styled from 'styled-components';

export const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

export const SearchStyles = styled.div`
  .spacer {
    height: 32px;
  }

  .search-bar {
    &--input {
      border: none;
      border-radius: 20px;
      color: ${({ theme }) => theme.colors.navbarBackground};
      font-size: 1.2em;
      outline: none;
      padding: 8px 18px;
      height: 40px;
      width: 100%;

      &-container {
        position: relative;
      }

      &-submit {
        display: flex;
        align-items: center;
        justify-content: center;
        background: #e84a5f;
        border: none;
        border-radius: 20px;
        color: #fff;
        cursor: pointer;
        font-size: 1.2em;
        height: 40px;
        padding: 8px 18px;
        position: absolute;
        right: 0;
        top: 0;
      }
    }

    &--container {
      background-color: ${({ theme }) => theme.colors.coral};
      padding-top: 64px;
      padding-bottom: 64px;
    }

    &--title {
      color: #fff;
      font-size: 2em;
      font-weight: 600;
      margin-bottom: 5px;
    }

    &--subtitle {
      color: #fff;
      font-size: 1.6em;
      font-weight: 500;
      margin-bottom: 48px;
    }
  }

  .search-results {
    &--container {
      margin-top: 48px;
    }

    &--category {
      font-weight: 500;
      font-size: 1.3em;
      margin-bottom: 24px;
      margin-left: 32px;
    }

    &--row {
      display: flex;
    }
  }

  .carrousel {
    &--container {
      padding-left: 32px;
      padding-right: 32px;
      width: 100%;
      position: relative;

      .arrow-right,
      .arrow-left {
        position: absolute;
        outline: none;
        border: none;
        top: 44%;
      }

      .arrow-left {
        left: 2px;
      }

      .arrow-right {
        right: 2px;
      }
    }
  }
`;
