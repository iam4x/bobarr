import styled from 'styled-components';

export const MovieDetailsStyles = styled.div`
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  max-height: 80vh;
  position: relative;

  .close-icon {
    position: absolute;
    color: #fff;
    cursor: pointer;
    top: 12px;
    right: 12px;
    z-index: 999;

    svg {
      font-size: 1.2em;
    }
  }

  .btn {
    display: inline-flex;
    align-items: center;
    border: 1px solid transparent;
    border-radius: 4px;
    cursor: pointer;
    color: #fff;
    padding: 3px 5px;
    transition: 0.1s linear;

    &:hover {
      border: 1px solid #fff;
    }

    svg {
      margin-right: 8px;
    }

    &.disabled {
      cursor: not-allowed;
      opacity: 0.8;
    }
  }

  .header-container {
    border-radius: 4px;
    overflow: hidden;
    position: relative;
    height: 100%;
    width: 100%;
  }

  .header-background {
    position: absolute;
    top: 0;
    left: 0;
    background-size: cover;
    background-repeat: no-repeat;
    height: 100%;
    width: 100%;
    z-index: 1;
  }

  .header-background-overlay {
    background-image: linear-gradient(
      to right,
      rgba(12.94%, 14.9%, 22.75%, 1) 150px,
      rgba(20.39%, 22.35%, 29.02%, 0.84) 100%
    );
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 2;
  }

  .header-content {
    display: flex;
    padding-top: 24px;
    padding-bottom: 24px;
    padding-left: 36px;
    padding-right: 36px;
    width: 100%;
    position: relative;
    z-index: 3;
  }

  .poster-container {
    height: 100%;
    width: 200px;

    .poster-image {
      border-radius: 4px;
      height: auto;
      width: 200px;
    }
  }

  .movie-details {
    flex: 1;
    margin-left: 36px;
    color: #fff;
  }

  .title {
    display: flex;
    align-items: center;
    font-size: 2.2em;
    font-weight: 700;

    .year {
      font-size: 0.8em;
      font-weight: 300;
      margin-left: 4px;
    }
  }

  .play-trailer {
    display: inline-flex;
    align-items: center;
    margin-top: 12px;
    margin-bottom: 12px;

    svg {
      margin-right: 8px;
    }
  }

  .informations-row {
    display: flex;
    align-items: center;
    margin-top: 8px;
    margin-bottom: 8px;

    .vote--container {
      margin-right: 24px;
    }
  }

  .overview {
    font-size: 1.2em;
    max-width: 780px;
  }

  .buttons {
    margin-top: 24px;
    display: flex;

    .btn {
      margin-right: 12px;
    }
  }
`;
