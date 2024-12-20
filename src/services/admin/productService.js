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

const createProduct = (name, description, price, price_sale, categoryId, teamId, images, productDetails) => {
    const data = new FormData();
    data.append("name", name);
    data.append("description", description);
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

const updateProduct = (id, name, description, price, price_sale, categoryId, teamId, images, productDetails) => {
    const data = new FormData();
    data.append("id", id);
    data.append("name", name);
    data.append("description", description);
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
        const { image,...rest} = detail;
        if(image) {
            data.append("detailImages", image);
            return {...rest, hasImage: true };
        }
        return {...rest, hasImage: false };
    })

    data.append("productDetails", JSON.stringify(detailsForSubmit));

    return axios.put("/api/v1/admin/product/update", data);
}

const getAllProduct = (page, limit, search = "", teamId = "", sort = {}) => {
    let query = `/api/v1/admin/product/read?page=${page}&limit=${limit}`;

    if (search) {
        query += `&search=${encodeURIComponent(search)}`;
    }

    if (teamId) {
        query += `&teamId=${encodeURIComponent(teamId)}`;
    }

    if (sort && sort.key && sort.direction) {
        const sortQuery = JSON.stringify(sort);
        query += `&sort=${encodeURIComponent(sortQuery)}`;
    }

    return axios.get(query);
}

const setActiveField = (id, field) => {
    return axios.put(`/api/v1/admin/product/set-active-field`, { id: id, field: field });
}

const deleteProduct = (product) => {
    return axios.delete(`/api/v1/admin/product/delete`, { data: {id: product.id} });
}

export {
    getAllCategory,
    getAllTeam,
    getAllColor,
    getAllSize,
    createProduct,
    getAllProduct,
    setActiveField,
    updateProduct,
    deleteProduct
}