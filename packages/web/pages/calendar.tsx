import React from 'react';
import Head from 'next/head';

import { LayoutComponent } from '../components/layout/layout.component';
import { withApollo } from '../components/with-apollo';
import { CalendarComponent } from '../components/calandar/calendar.component';

function CalendarPage() {
  return (
    <>
      <Head>
        <title>Bobarr - Calendar</title>
      </Head>
      <LayoutComponent>
        <CalendarComponent />
      </LayoutComponent>
    </>
  );
}

export default withApollo(CalendarPage);
