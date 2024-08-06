import axios from "../../config/admin/axios";

const getAllCategory = () => {
    return axios.get('/api/v1/admin/product/get-category');
}

const getAllTeam = () => {
    return axios.get('/api/v1/admin/product/get-team');
}

const getAllColor = () => {
    return axios.get('/api/v1/admin/product/get-color');
}

const getAllSize = () => {
    return axios.get('/api/v1/admin/product/get-size');
}

const createProduct = (name, price, price_sale, categoryId, teamId, images, productDetails) => {
    const data = new FormData();
    data.append("name", name);
    data.append("price", price);
    data.append("price_sale", price_sale);
    data.append("categoryId", categoryId);
    data.append("teamId", teamId);

    const imageInfo = images.map((image, index) => {
        data.append('images', image.file);
        return { isMainImage: image.isMainImage };
    });
    data.append('imageInfo', JSON.stringify(imageInfo));

    const detailsForSubmit = productDetails.map(detail => {
        const { image, ...rest} = detail;
        if(image) {
            data.append("detailImages", image);
            return {...rest, hasImage: true };
        }
        return {...rest, hasImage: false };
    })

    data.append("productDetails", JSON.stringify(detailsForSubmit));

    return axios.post("/api/v1/admin/product/create", data);
}

export {
    getAllCategory,
    getAllTeam,
    getAllColor,
    getAllSize,
    createProduct
}