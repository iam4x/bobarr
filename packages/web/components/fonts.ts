import FontFaceObserver from 'fontfaceobserver';

export function loadFonts() {
  const link = document.createElement('link');
  link.href =
    'https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,500,700,900';
  link.rel = 'stylesheet';

  document.head.appendChild(link);

  new FontFaceObserver('Source Sans Pro').load().then(() => {
    document.documentElement.classList.add('source-sans-pro');
  });
}
