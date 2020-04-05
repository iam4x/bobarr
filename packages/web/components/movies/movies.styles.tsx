import styled from 'styled-components';

export const MoviesComponentStyles = styled.div`
  padding-top: 64px;

  .wrapper {
    max-width: 1200px;
    margin: 0 auto;
  }

  .flex {
    display: flex;
    flex-wrap: wrap;
    margin-left: -12px;
    margin-right: -12px;
  }

  .movie-card,
  .tvshow-card {
    margin-left: 12px;
    margin-right: 12px;
    height: ${({ theme }) => theme.tmdbCardHeight}px;
  }
`;
