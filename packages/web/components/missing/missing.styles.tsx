import styled from 'styled-components';

export const MissingComponentStyles = styled.div`
  background: #a7dbd8;
  padding-top: 24px;
  padding-bottom: 24px;

  .wrapper {
    max-width: 1200px;
    margin: 0 auto;
  }

  .row {
    background: #fff;
    border-radius: 4px;
    align-items: center;
    padding: 5px 8px;
    font-size: 0.8em;
    margin-bottom: 8px;
    display: flex;
    width: 100%;
  }

  .title {
    font-weight: bold;
    margin-right: 4px;
  }

  .ant-tag {
    margin-left: auto;
  }
`;
