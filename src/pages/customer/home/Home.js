import React from 'react';
import Banner from "./Banner.js";
import TeamCategory from "./TeamCategory.js";
import AllProducts from "./AllProducts.js";
import Slider from "./Slider";
import BestSellerClothing from "./BestSellerClothing";
import Countdown from "./Countdown";
import Category from "./Category";
import BestSellerGifts from "./BestSellerGifts";
import NationAndHat from "./NationAndHat";
import AboutUs from "./AboutUs";
import Sponsor from "./Sponsor";

const Home = () => {
    return (
        <div>
            <Slider />
            <Banner />
            <TeamCategory />
            <Countdown />
            <AllProducts />
            <Category />
            <BestSellerClothing />
            <NationAndHat />
            <BestSellerGifts />
            <AboutUs />
            <Sponsor />
        </div>
    );
};

export default Home;