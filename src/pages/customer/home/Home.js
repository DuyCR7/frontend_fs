import React from 'react';
import Banner from "./Banner.js";
import HomeCategory from "./HomeCategory.js";
import CategoryShowCate from "./CategoryShowCate.js";
import Register from "./Register.js";
import LocationSprade from "./LocationSprade.js";
import AboutUs from "./AboutUs.js";
import AppSection from "./AppSection.js";
import Sponsor from "./Sponsor.js";
import Slider from "./Slider";

const Home = () => {
    return (
        <div>
            <Slider />
            <Banner />
            <HomeCategory />
            <CategoryShowCate />
            <Register />
            <LocationSprade />
            <AboutUs />
            <AppSection />
            <Sponsor />
        </div>
    );
};

export default Home;