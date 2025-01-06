import React from "react";
import BasicCarousel from "../components/BasicCarousel";
import '../css/Home.css';

const Home = () => {
  return (
    <>
    <div>
      <img className="homeLogo d-flex w-100" src="public\Zabina.png" alt="Zabina Logo" />
    </div>
      <BasicCarousel />
    </>
  );
};

export default Home;