import React from 'react';
import Banner from "./banner/Banner.js";
import TeamCategory from "./teamCategory/TeamCategory.js";
import AllProducts from "./allProducts/AllProducts.js";
import Slider from "./slider/Slider";
import BestSellerClothing from "./bestSellerClothing/BestSellerClothing";
import Countdown from "./countdown/Countdown";
import Category from "./category/Category";
import BestSellerGifts from "./bestSellerGifts/BestSellerGifts";
import NationAndHat from "./nationAndHat/NationAndHat";
import AboutUs from "./aboutUs/AboutUs";
import Sponsor from "./sponsor/Sponsor";

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