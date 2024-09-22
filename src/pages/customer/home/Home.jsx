import React from 'react';
import Search from "./search/Search.jsx";
import TeamCategory from "./teamCategory/TeamCategory.jsx";
import Trending from "./trending/Trending.jsx";
import Slider from "./slider/Slider";
import AllSalesProducts from "./allSalesProducts/AllSalesProducts";
import Countdown from "./countdown/Countdown";
import Category from "./category/Category";
import BestSeller from "./bestSeller/BestSeller";
import NationAndClub from "./nationAndClub/NationAndClub";
import AboutUs from "./aboutUs/AboutUs";
import Blog from "./blog/Blog";

const Home = () => {
    return (
        <div>
            <Slider />
            {/*<Search />*/}
            <TeamCategory />
            <Countdown />
            <Trending />
            <Category />
            <AllSalesProducts />
            <NationAndClub />
            <BestSeller />
            <Blog />
            <AboutUs />
        </div>
    );
};

export default Home;