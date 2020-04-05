import React, { useEffect } from 'react';
import { NextPageContext } from 'next';
import { useRouter } from 'next/router';

import { redirect } from '../utils/redirect';

const redirectPath = '/search';

function IndexPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/search');
  }, []);
  return <noscript />;
}

IndexPage.getInitialProps = (ctx: NextPageContext) => {
  redirect(ctx, redirectPath);
  return {};
};

export default IndexPage;
