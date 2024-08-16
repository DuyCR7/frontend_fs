import axios from "../../config/customer/axios";

const getAllInfoProduct = (page, limit, filterCategory, filterTeam, filterSize, filterColor, sortOption, team) => {
    return axios.get("/api/v1/shop/get-all-infor-product", {
        params: {
            page,
            limit,
            filterCategory,
            filterTeam,
            filterSize,
            filterColor,
            sortOption,
            team
        }
    });
}

export {
    getAllInfoProduct,
}