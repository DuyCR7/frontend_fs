import React from 'react';
import Banner from "./Banner.js";
import HomeCategory from "./HomeCategory.js";
import AllProducts from "./AllProducts.js";
import LocationSprade from "./LocationSprade.js";
import AboutUs from "./AboutUs.js";
import AppSection from "./AppSection.js";
import Sponsor from "./Sponsor.js";
import Slider from "./Slider";
import BestSeller from "./BestSeller";
import Countdown from "./Countdown";

const Home = () => {
    return (
        <div>
            <Slider />
            <Banner />
            <HomeCategory />
            <Countdown />
            <AllProducts />
            <BestSeller />
            <LocationSprade />
            <AboutUs />
            <AppSection />
            <Sponsor />
        </div>
    );
};

export default Home;