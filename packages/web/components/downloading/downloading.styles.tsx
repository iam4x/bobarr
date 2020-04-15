import styled from 'styled-components';

export const DownloadingComponentStyles = styled.div`
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

    .speed {
      flex-shrink: 0;
      font-size: 0.7em;
      margin-left: auto;
      margin-right: 12px;
    }

    .progress {
      flex-shrink: 0;
      width: 250px;
    }

    .name {
      text-transform: uppercase;
      font-weight: 600;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }

    .torrent-name {
      font-size: 0.7em;
      margin-left: 4px;
      margin-right: 12px;
      text-transform: uppercase;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }
`;
