import React from 'react';
import Search from "./search/Search.jsx";
import TeamCategory from "./teamCategory/TeamCategory.jsx";
import Trending from "./trending/Trending.jsx";
import Slider from "./slider/Slider";
import BestSellerClothing from "./bestSellerClothing/BestSellerClothing";
import Countdown from "./countdown/Countdown";
import Category from "./category/Category";
import BestSellerGifts from "./bestSellerGifts/BestSellerGifts";
import NationAndClub from "./nationAndClub/NationAndClub";
import AboutUs from "./aboutUs/AboutUs";
import Sponsor from "./sponsor/Sponsor";

const Home = () => {
    return (
        <div>
            <Slider />
            <Search />
            <TeamCategory />
            <Countdown />
            <Trending />
            <Category />
            <BestSellerClothing />
            <NationAndClub />
            <BestSellerGifts />
            <AboutUs />
            <Sponsor />
        </div>
    );
};

export default Home;