import React from 'react';
import Hero from '../components/hero/Hero';
import PageWrapper from '../components/page-wrapper/PageWrapper';

const Home = (): JSX.Element => (
  <PageWrapper title="Home">
    <>
      <Hero />
    </>
  </PageWrapper>
);

export default Home;
