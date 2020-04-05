// import original module declarations
import 'styled-components';

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme {
    navbarHeight: number;
    tmdbCardHeight: number;
    colors: {
      navbarBackground: string;
      coral: string;
      blue: string;
    };
  }
}
