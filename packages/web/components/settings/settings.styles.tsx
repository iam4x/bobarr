import styled from 'styled-components';

export const SettingsComponentStyles = styled.div`
  padding-top: 48px;

  .wrapper {
    max-width: 1200px;
    margin: 0 auto;
  }

  .flex {
    display: flex;
    justify-content: space-evenly;
  }

  .row {
    width: 500px;
  }

  .actions {
    .ant-btn {
      display: block;
      margin-bottom: 8px;
      width: 100%;
    }
  }

  .quality-preference {
    margin-top: 24px;

    .ant-btn {
      margin-bottom: 4px;
      width: 100%;
    }

    .save-btn {
      margin-top: 12px;
    }
  }
`;
