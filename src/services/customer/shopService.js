import axios from "../../config/customer/axios";

const getAllInfoProduct = (page, limit, filterCategory, filterTeam, filterSize, filterColor, sortOption, team, category, minSelectedPrice, maxSelectedPrice) => {
    return axios.get("/api/v1/shop/get-all-infor-product", {
        params: {
            page,
            limit,
            filterCategory,
            filterTeam,
            filterSize,
            filterColor,
            sortOption,
            team,
            category,
            minSelectedPrice,
            maxSelectedPrice,
        }
    });
}

const getSingleProduct = (slug) => {
    return axios.get(`/api/v1/shop/get-single-product/${slug}`);
}

export {
    getAllInfoProduct,
    getSingleProduct,
}