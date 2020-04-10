import styled from 'styled-components';

export const DownloadingComponentStyles = styled.div`
  background: #cff09e;
  padding-top: 24px;
  padding-bottom: 24px;

  .wrapper {
    margin: 0 auto;
    max-width: 1200px;
  }

  .download-row {
    background: #fff;
    border-radius: 4px;
    align-items: center;
    padding: 5px 8px;
    font-size: 0.8em;
    margin-bottom: 8px;
    display: flex;
    width: 100%;

    &:last-child {
      margin-bottom: 0;
    }

    .speed {
      font-size: 0.7em;
      margin-left: auto;
      margin-right: 12px;
    }

    .progress {
      width: 250px;
    }

    .name {
      text-transform: uppercase;
      font-weight: 600;
    }

    .torrent-name {
      font-size: 0.7em;
      margin-left: 4px;
      text-transform: uppercase;
    }
  }
`;
