import React from 'react';
import AboutBanner from '../components/about-banner/AboutBanner';
import PageWrapper from '../components/page-wrapper/PageWrapper';

const About = (): JSX.Element => (
  <PageWrapper title="About">
    <>
      <AboutBanner />
    </>
  </PageWrapper>
);

export default About;
