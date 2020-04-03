import axios from 'axios';

const tmdbApiKey = 'c8eeff686ad913601c151cd0bc59c2e6';

class TMDBClient {
  private client = axios.create({
    // eslint-disable-next-line @typescript-eslint/camelcase
    params: { api_key: tmdbApiKey, language: 'fr' },
    baseURL: 'https://api.themoviedb.org/3/',
  });

  public popularMovies(region = 'fr') {
    return this.client.get('/movie/popular', { params: { region } });
  }

  public popularTVShows(region = 'fr') {
    return this.client.get('/tv/popular', { params: { region } });
  }
}

export const tmdb = new TMDBClient();
