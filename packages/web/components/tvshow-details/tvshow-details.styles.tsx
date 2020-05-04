import styled from 'styled-components';
import { MovieDetailsStyles } from '../movie-details/movie-details.styles';

export const TVShowSeasonsModalComponentStyles = styled(MovieDetailsStyles)`
  .seasons {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
  }

  .season-row {
    align-items: center;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    margin-bottom: 8px;
    margin-right: 4px;
    margin-left: 4px;
    padding: 8px 10px;
    transition: 0.1s linear;
    max-width: 145px;

    &.selected {
      border-color: #fff;
    }

    &.in-library {
      cursor: not-allowed;
      border-color: #fff;
    }
  }

  .season-number {
    font-size: 1.1em;
    font-weight: 600;
  }

  .season-episodes-count {
    font-size: 0.9em;
  }
`;
