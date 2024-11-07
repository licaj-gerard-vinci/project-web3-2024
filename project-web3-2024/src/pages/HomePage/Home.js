import React from 'react';
import WelcomeBlock from './WelcomeBlock/WelcomeBlock';
import Test from './Testf/CarouselMuscles';
import Divider from './Divider/Divider';
import Anchor from '../Anchor/Anchor';

function Home() {
  return (
    <>
      <WelcomeBlock />
      <Divider />
      <Test />
      <Anchor />
    </>
  );
}

export default Home;
