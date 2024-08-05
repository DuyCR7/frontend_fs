import React, {useEffect, useState} from 'react';
import _ from "lodash";
import {getAllCategory, getAllColor, getAllSize, getAllTeam} from "../../../services/admin/productService";
import {toast} from "react-toastify";
import { FiPlusCircle, FiMinusCircle } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { v4 as uuidv4 } from 'uuid';
import "./adProduct.scss";

const AdProduct = () => {

    const [loading, setLoading] = useState(false);

    const [categories, setCategories] = useState([]);
    const [teams, setTeams] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [colors, setColors] = useState([]);

    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);

    const fetchAllCategories = async () => {
        try {
            let res = await getAllCategory();
            if(res && res.EC === 0) {
                setCategories(res.DT);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const renderCategoryOptions = (categories, level = 0) => {
        return categories.map(category => (
            <React.Fragment key={category.id}>
                <option value={category.id}>
                    {Array(level).fill().map((_, i) => (
                        '--'
                    ))}
                    {category.name}
                </option>
                {category.children && category.children.length > 0 && renderCategoryOptions(category.children, level + 1)}
            </React.Fragment>
        ));
    };

    const fetchAllTeams = async () => {
        try {
            let res = await getAllTeam();
            if(res && res.EC === 0) {
                setTeams(res.DT);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const fetchAllColors = async () => {
        try {
            let res = await getAllColor();
            if(res && res.EC === 0) {
                setColors(res.DT);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const fetchAllSizes = async () => {
        try {
            let res = await getAllSize();
            if(res && res.EC === 0) {
                setSizes(res.DT);
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchAllCategories();
        fetchAllTeams();
        fetchAllColors();
        fetchAllSizes();
    }, []);

    const defaultProductData = {
        name: "",
        price: 0,
        price_sale: 0,
        isSale: false,
        isBestSeller: false,
        isTrending: false,
        isActive: true,
        categoryId: 0,
        teamId: 0
    }

    const [productData, setProductData] = useState(defaultProductData);

    const defaultValidInputs = {
        name: true,
        price: true,
        image: true,
        categoryId: true,
        teamId: true,
    }

    const [objCheckInputs, setObjCheckInputs] = useState(defaultValidInputs);

    const handleOnChangeInput = (value, name) => {
        let _productData = _.cloneDeep(productData);
        _productData[name] = value;
        setProductData(_productData);

        if(!objCheckInputs.name) {
            setObjCheckInputs({...objCheckInputs, name: true});
        }

        if(!objCheckInputs.price) {
            setObjCheckInputs({...objCheckInputs, price: true});
        }

        if(!objCheckInputs.categoryId) {
            setObjCheckInputs({...objCheckInputs, categoryId: true});
        }

        if(!objCheckInputs.teamId) {
            setObjCheckInputs({...objCheckInputs, teamId: true});
        }
    }

    const handleUploadImages = (e) => {
        let _productData = _.cloneDeep(productData);
        const files = e.target.files;

        if (files && files.length > 0) {
            const newImages = Array.from(files).map((file, index) => ({
                file,
                isMainImage: index === 0,
            }));
            const newPreviews = newImages.map(image => URL.createObjectURL(image.file));

            setImages(newImages);
            setPreviewImages(newPreviews);

            _productData.images = newImages;
            _productData.mainImage = newImages[0].file;
            setProductData(_productData);

            if (!objCheckInputs.image) {
                setObjCheckInputs({ ...objCheckInputs, image: true });
            }
        } else {
            setImages([]);
            setPreviewImages([]);

            _productData.images = [];
            _productData.mainImage = null;
            setProductData(_productData);
        }
    };

    const handleSetMainImage = (index) => {
        const updatedImages = images.map((image, idx) => ({
            ...image,
            isMainImage: idx === index,
        }));

        setImages(updatedImages);
        let _productData = _.cloneDeep(productData);
        _productData.images = updatedImages;
        _productData.mainImage = images[index].file;
        setProductData(_productData);
    };

    const isValidInputs = () => {
        setObjCheckInputs(defaultValidInputs);
        if(!productData.name){
            setObjCheckInputs({...defaultValidInputs, name: false});
            toast.error("Vui lòng nhập tên sản phẩm!");
            return false;
        }

        if(!productData.price){
            setObjCheckInputs({...defaultValidInputs, price: false});
            toast.error("Vui lòng nhập giá sản phẩm!");
            return false;
        }

        if(!productData.categoryId || productData.categoryId === "0"){
            setObjCheckInputs({...defaultValidInputs, categoryId: false});
            toast.error("Vui lòng chọn danh mục sản phẩm!");
            return false;
        }

        if(!productData.teamId || productData.teamId === "0"){
            setObjCheckInputs({...defaultValidInputs, teamId: false});
            toast.error("Vui lòng chọn đội bóng!");
            return false;
        }

        if(images.length === 0){
            setObjCheckInputs({...defaultValidInputs, image: false});
            toast.error("Vui lòng chọn hình ảnh!");
            return false;
        }

        return true;
    }

    const [productDetails, setProductDetails] = useState([{
        colorId: '',
        image: null,
        imageName: '',
        sizes: [{ sizeId: '', quantity: 1 }]
    }]);

    const addProductDetail = () => {
        setProductDetails([...productDetails, {
            colorId: '',
            image: null,
            imageName: '',
            sizes: [{ sizeId: '', quantity: 1 }]
        }]);
    };

    const updateProductDetail = (index, field, value) => {
        const updatedDetails = [...productDetails];
        if (field === 'image') {
            if(value) {
                updatedDetails[index].image = value;
                updatedDetails[index].imagePreview = URL.createObjectURL(value);
                updatedDetails[index].imageName = value.name;
            } else {
                updatedDetails[index].image = null;
                updatedDetails[index].imagePreview = null;
                updatedDetails[index].imageName = '';
            }
        } else {
            updatedDetails[index][field] = value;
        }
        setProductDetails(updatedDetails);
    };

    const updateSize = (detailIndex, sizeIndex, field, value) => {
        const updatedDetails = [...productDetails];
        updatedDetails[detailIndex].sizes[sizeIndex][field] = value;
        setProductDetails(updatedDetails);
    };

    const addSize = (detailIndex) => {
        const updatedDetails = [...productDetails];
        updatedDetails[detailIndex].sizes.push({ sizeId: '', quantity: 1 });
        setProductDetails(updatedDetails);
    };

    const removeProductDetail = (indexToRemove) => {
        setProductDetails(productDetails.filter((_, index) => index !== indexToRemove));
    };

    const removeSize = (detailIndex, sizeIndexToRemove) => {
        const updatedDetails = [...productDetails];
        updatedDetails[detailIndex].sizes = updatedDetails[detailIndex].sizes.filter((_, index) => index !== sizeIndexToRemove);
        setProductDetails(updatedDetails);
    };

    const handleSubmit = async () => {
        let check = isValidInputs();
    }

    return (
        <div className="page-inner content-product">
            <div className="row">
                <div className="col-12 col-sm-6 form-group">
                    <label>Tên sản phẩm (<span style={{color: "red"}}>*</span>):</label>
                    <input
                        type="text"
                        placeholder={"Nhập tên sản phẩm..."}
                        className={objCheckInputs.name ? "form-control" : "form-control is-invalid"}
                        value={productData.name || ""}
                        onChange={(e) => handleOnChangeInput(e.target.value, "name")}
                    />
                </div>

                <div className="col-12 col-sm-6 form-group">
                    <label>Giá sản phẩm (<span style={{color: "red"}}>*</span>):</label>
                    <input
                        type="number"
                        placeholder={"Nhập giá sản phẩm..."}
                        className={objCheckInputs.price ? "form-control" : "form-control is-invalid"}
                        value={productData.price || ""}
                        onChange={(e) => handleOnChangeInput(e.target.value, "price")}
                        min={1}
                    />
                </div>

                <div className="col-12 col-sm-6 form-group">
                    <label>Giá sale:</label>
                    <input
                        type="number"
                        placeholder={"Nhập giá sale..."}
                        className="form-control"
                        value={productData.price_sale || ""}
                        onChange={(e) => handleOnChangeInput(e.target.value, "price_sale")}
                        min={1}
                    />
                </div>

                <div className="col-12 col-sm-6 form-group">
                    <label>Danh mục sản phẩm (<span style={{color: "red"}}>*</span>):</label>
                    <select
                        className={objCheckInputs.categoryId ? "form-select form-group" : "form-select form-group is-invalid"}
                        value={productData.categoryId || ""}
                        onChange={(e) => handleOnChangeInput(e.target.value, "categoryId")}
                    >
                        <option value={0}>--- Chọn danh mục sản phẩm ---</option>
                        {renderCategoryOptions(categories)}
                    </select>
                </div>

                <div className="col-12 col-sm-6 form-group">
                    <label>Đội bóng (<span style={{color: "red"}}>*</span>):</label>
                    <select
                        className={objCheckInputs.teamId ? "form-select form-group" : "form-select form-group is-invalid"}
                        value={productData.teamId || ""}
                        onChange={(e) => handleOnChangeInput(e.target.value, "teamId")}
                    >
                        <option value={0}>--- Chọn đội bóng ---</option>
                        {
                            teams && teams.length > 0 &&
                            teams.map(team => (
                                <option key={team.id} value={team.id}>{team.name}</option>
                            ))
                        }
                    </select>
                </div>

                <div className="col-12 col-sm-6 form-group">
                    <label>Chọn ảnh (<span style={{color: "red"}}>*</span>):</label>
                    <input type="file"
                           accept="image/*"
                           className={objCheckInputs.image ? "form-control" : "form-control is-invalid"}
                           onChange={(e) => handleUploadImages(e)}
                           multiple
                    />
                </div>
                {
                    previewImages && previewImages.length > 0 &&
                    <div
                        className="d-flex flex-wrap gap-3 justify-content-center align-items-center col-12 form-group text-center">
                        {previewImages.map((preview, index) => (
                            <div key={index} className="img-content">
                                <img
                                    src={preview}
                                    alt="preview"
                                    className={`img-thumbnail ${images[index].isMainImage ? 'img-main' : ''}`}
                                    width={120}
                                    height={120}
                                    onClick={() => handleSetMainImage(index)}
                                    style={{cursor: "pointer"}}/>

                                {images[index].isMainImage && (
                                    <div className="img-label">
                                        Ảnh chính
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                }

                <div className="col-12 form-group">
                    <label className="mb-3">Chi tiết sản phẩm:</label>
                    {productDetails.map((detail, detailIndex) => (
                        <div key={`${detailIndex}`} className="card mb-3">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-5 mb-3">
                                        <label className="form-label">Màu sắc:</label>
                                        <select
                                            value={detail.colorId}
                                            onChange={(e) => updateProductDetail(detailIndex, 'colorId', e.target.value)}
                                            className="form-group form-select"
                                        >
                                            <option value="">--- Chọn màu ---</option>
                                            {colors && colors.map(color => (
                                                <option key={color.id} value={color.id}>{color.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-sm-5 mb-3">
                                        <label className="form-label">Hình ảnh:</label>
                                        <div className="input-group file-input-group">
                                            <input
                                                type="file"
                                                onChange={(e) => updateProductDetail(detailIndex, 'image', e.target.files[0])}
                                                className="form-control d-none"
                                                id={`file-input-${detailIndex}`}
                                                accept="image/*"
                                            />
                                            <input
                                                type="text"
                                                value={detail.imageName || ''}
                                                readOnly
                                                className="form-control file-name-input"
                                                placeholder="No file chosen"
                                            />
                                            <label className="btn btn-outline-secondary" htmlFor={`file-input-${detailIndex}`}>
                                                Choose File
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-sm-2 d-flex justify-content-center align-items-center">
                                    {detail.imagePreview && (
                                            <img
                                                src={detail.imagePreview}
                                                alt="Preview"
                                                className="img-thumbnail"
                                                width={80}
                                                height={80}
                                            />
                                        )}
                                    </div>
                                </div>

                                <label className="mt-3 mb-2">Kích thước và số lượng:</label>
                                {detail.sizes.map((size, sizeIndex) => (
                                    <div key={sizeIndex} className="row mb-2">
                                        <div className="col-sm-5">
                                            <select
                                                value={size.sizeId}
                                                onChange={(e) => updateSize(detailIndex, sizeIndex, 'sizeId', e.target.value)}
                                                className="form-group form-select"
                                            >
                                                <option value="">--- Chọn size ---</option>
                                                {sizes.map(s => (
                                                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-sm-5 mt-3 mt-sm-0">
                                            <input
                                                type="number"
                                                value={size.quantity}
                                                onChange={(e) => updateSize(detailIndex, sizeIndex, 'quantity', e.target.value)}
                                                placeholder="Số lượng"
                                                className="form-control"
                                                min={1}
                                            />
                                        </div>
                                        <div
                                            className="d-flex gap-3 justify-content-end justify-content-sm-center align-items-center col-sm-2 mt-3 mt-sm-0 mb-1 mb-sm-0">
                                            {detail.sizes.length > 1 && (
                                                <FiMinusCircle size={30} style={{color: "red"}}
                                                               onClick={() => removeSize(detailIndex, sizeIndex)}/>
                                            )}
                                            <FiPlusCircle size={30} style={{color: "#1178f2"}}
                                                          onClick={() => addSize(detailIndex)}/>
                                        </div>
                                    </div>
                                ))}

                                <div className="d-flex gap-3 justify-content-center justify-content-sm-end align-items-center mt-3">
                                    <div>
                                        {productDetails.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeProductDetail(detailIndex)}
                                                className="d-flex gap-1 justify-content-center align-items-center btn btn-outline-danger"
                                            >
                                                <MdDeleteOutline size={25}/>Xóa chi tiết
                                            </button>
                                        )}
                                    </div>

                                    <div>
                                        <button
                                            type="button"
                                            onClick={addProductDetail}
                                            className="d-flex gap-1 justify-content-center align-items-center btn btn-outline-primary"
                                        >
                                            <FiPlusCircle size={25}/>Thêm chi tiết
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>

                <div className="d-flex justify-content-center align-items-center">
                    <button className="btn btn-outline-success" onClick={() => handleSubmit()}>
                        Thêm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdProduct;