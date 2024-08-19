import React, {useEffect, useState} from 'react';
import _ from "lodash";
import {
    createProduct,
    getAllCategory,
    getAllColor,
    getAllSize,
    getAllTeam, updateProduct
} from "../../../services/admin/productService";
import {toast} from "react-toastify";
import {FiPlusCircle, FiMinusCircle} from "react-icons/fi";
import {MdDeleteOutline} from "react-icons/md";
import {Modal} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {Spin} from "antd";

const AdModalProduct = (props) => {

    const [loading, setLoading] = useState(false);

    const [categories, setCategories] = useState([]);
    const [teams, setTeams] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [colors, setColors] = useState([]);

    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);

    const [errors, setErrors] = useState({});

    const fetchAllCategories = async () => {
        try {
            let res = await getAllCategory();
            if (res && res.EC === 0) {
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
            if (res && res.EC === 0) {
                setTeams(res.DT);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const fetchAllColors = async () => {
        try {
            let res = await getAllColor();
            if (res && res.EC === 0) {
                setColors(res.DT);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const fetchAllSizes = async () => {
        try {
            let res = await getAllSize();
            if (res && res.EC === 0) {
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
        description: "",
        price: "",
        price_sale: "",
        categoryId: 0,
        teamId: 0
    }

    const [productData, setProductData] = useState(defaultProductData);

    const handleOnChangeInput = (value, name) => {
        let _productData = _.cloneDeep(productData);
        _productData[name] = value;
        setProductData(_productData);

        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: undefined
        }));
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

            setErrors(prevErrors => ({
                ...prevErrors,
                image: undefined
            }));
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

    let defauftProductDetails = [{
        colorId: '',
        image: null,
        imageName: '',
        sizes: [{sizeId: '', quantity: 1}]
    }];

    useEffect(() => {
        if(props.actionModalProduct === "EDIT" && props.dataUpdate && Object.keys(props.dataUpdate).length > 0) {
            const { Product_Images, Product_Details, ...productDataEdit } = props.dataUpdate;
            // console.log("Product_Images: " , Product_Images);
            // console.log("Product_Details: " , Product_Details);

            setProductData(productDataEdit);

            let updatedImages = Product_Images.map(img => ({
                file: null,
                isMainImage: img.isMainImage,
                url: `${process.env.REACT_APP_URL_BACKEND}/${img.image}`
            }));
            setImages(updatedImages);
            setPreviewImages(updatedImages.map(img => img.url));

            let updateProductDetails = Object.values(Product_Details.reduce((acc, curr) => {
                if (!acc[curr.colorId]) {
                    acc[curr.colorId] = {
                        colorId: curr.colorId,
                        image: null,
                        imageName: "",
                        imagePreview: `${process.env.REACT_APP_URL_BACKEND}/${curr.image}`,
                        sizes: []
                    };
                }
                acc[curr.colorId].sizes.push({ sizeId: curr.sizeId, quantity: curr.quantity });
                return acc;
            }, {}));
            setProductDetails(updateProductDetails);

        } else {
            setProductData(defaultProductData);
            setImages([]);
            setPreviewImages([]);
            setProductDetails([...defauftProductDetails]);
        }
    }, [props.actionModalProduct, props.dataUpdate]);

    const [productDetails, setProductDetails] = useState(defauftProductDetails);

    const addProductDetail = () => {
        setProductDetails([...productDetails, {
            colorId: '',
            image: null,
            imageName: '',
            sizes: [{sizeId: '', quantity: 1}]
        }]);
    };

    const validateForm = () => {
        let newErrors = {};
        let isValid = true;

        if (!productData.name.trim()) {
            newErrors.name = "Vui lòng nhập tên sản phẩm!";
            isValid = false;
        }

        if (!productData.price || productData.price <= 0) {
            newErrors.price = "Vui lòng nhập giá sản phẩm hợp lệ!";
            isValid = false;
        }

        if (!productData.price_sale || productData.price_sale <= 0) {
            newErrors.price_sale = "Vui lòng nhập giá sale hợp lệ!";
            isValid = false;
        }

        if (productData.price_sale && +productData.price_sale > +productData.price) {
            newErrors.price_sale = "Giá sale phải nhỏ hơn giá sản phẩm!";
            isValid = false;
        }

        if (!productData.categoryId || productData.categoryId === "0") {
            newErrors.categoryId = "Vui lòng chọn danh mục sản phẩm!";
            isValid = false;
        }

        if (!productData.teamId || productData.teamId === "0") {
            newErrors.teamId = "Vui lòng chọn đội bóng!";
            isValid = false;
        }

        if (images.length === 0) {
            newErrors.image = "Vui lòng chọn hình ảnh!";
            isValid = false;
        }

        // Validate product details
        let detailErrors = [];
        let usedColors = new Set();

        productDetails.forEach((detail, detailIndex) => {
            let detailError = {};
            if (!detail.colorId) {
                detailError.colorId = "Vui lòng chọn màu sắc!";
                isValid = false;
            } else if (usedColors.has(detail.colorId)) {
                detailError.colorId = "Màu sắc đã được chọn!";
                isValid = false;
            } else {
                usedColors.add(detail.colorId);
            }

            if(props.actionModalProduct === "CREATE") {
                if (!detail.image) {
                    detailError.image = "Vui lòng chọn hình ảnh!";
                    isValid = false;
                }
            }

            let sizeErrors = [];
            let usedSizes = new Set();
            detail.sizes.forEach((size, sizeIndex) => {
                let sizeError = {};
                if (!size.sizeId) {
                    sizeError.sizeId = "Vui lòng chọn kích thước!";
                    isValid = false;
                } else if (usedSizes.has(size.sizeId)) {
                    sizeError.sizeId = "Kích thước này đã được chọn cho màu này!";
                    isValid = false;
                } else {
                    usedSizes.add(size.sizeId);
                }

                if (!size.quantity || size.quantity <= 0) {
                    sizeError.quantity = "Vui lòng nhập số lượng hợp lệ!";
                    isValid = false;
                }

                if (Object.keys(sizeError).length > 0) {
                    sizeErrors[sizeIndex] = sizeError;
                }

            });

            if (sizeErrors.length > 0) {
                detailError.sizes = sizeErrors;
            }

            if (Object.keys(detailError).length > 0) {
                detailErrors[detailIndex] = detailError;
            }

        });

        if (detailErrors.length > 0) {
            newErrors.productDetails = detailErrors;
        }

        setErrors(newErrors);
        return isValid;
    };

    const updateProductDetail = (index, field, value) => {
        const updatedDetails = [...productDetails];
        if (field === 'image') {
            if (value) {
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

        setErrors(prevErrors => {
            const newErrors = {...prevErrors};
            if (newErrors.productDetails && newErrors.productDetails[index]) {
                newErrors.productDetails[index][field] = undefined;
            }
            return newErrors;
        });
    };

    const updateSize = (detailIndex, sizeIndex, field, value) => {
        const updatedDetails = [...productDetails];
        updatedDetails[detailIndex].sizes[sizeIndex][field] = value;
        setProductDetails(updatedDetails);

        setErrors(prevErrors => {
            const newErrors = {...prevErrors};
            if (newErrors.productDetails &&
                newErrors.productDetails[detailIndex] &&
                newErrors.productDetails[detailIndex].sizes &&
                newErrors.productDetails[detailIndex].sizes[sizeIndex]) {
                newErrors.productDetails[detailIndex].sizes[sizeIndex][field] = undefined;
            }
            return newErrors;
        });
    };

    const addSize = (detailIndex) => {
        const updatedDetails = [...productDetails];
        updatedDetails[detailIndex].sizes.push({sizeId: '', quantity: 1});
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

    const handleClickCloseModal = () => {
        props.handleCloseModalProduct();
        setProductData(defaultProductData);
        setImages([]);
        setPreviewImages([]);
        setProductDetails([...defauftProductDetails]);
        setErrors({});
    }

    const handleSubmit = async () => {
        let check = validateForm();
        if (check) {
            setLoading(true);
            try {
                let res = props.actionModalProduct === "CREATE" ?
                    await createProduct(productData.name, productData.description, productData.price, productData.price_sale,
                    productData.categoryId, productData.teamId, images, productDetails)
                    :
                    await updateProduct(productData.id, productData.name, productData.description, productData.price, productData.price_sale,
                        productData.categoryId, productData.teamId, images, productDetails);
                if (res && res.EC === 0) {
                    toast.success(res.EM);
                    handleClickCloseModal();

                    if(props.actionModalProduct === "CREATE") {
                        props.setCurrentPage(1);
                        props.setSortConfig({key: 'id', direction: 'DESC'});
                        await props.fetchAllProduct(1, props.numRows);
                    } else {
                        await props.fetchAllProduct(props.currentPage, props.numRows, props.searchKeyword, props.sortConfig);
                    }

                } else if (res && res.EC === 1) {
                    toast.error(res.EM);
                } else {
                    toast.error(res.EM);
                }
            } catch (e) {
                console.error(e);
                toast.error(e);
            } finally {
                setLoading(false);
            }
        }
    }

    const renderError = (error) => {
        return error ? <div className="text-danger mt-1">{error}</div> : null;
    };

    return (
        <Modal show={props.isShowModalProduct} onHide={handleClickCloseModal} size={"xl"} className="modal-product"
               centered>
            <Spin spinning={loading}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <span>
                            {props.actionModalProduct === "CREATE" ? "Thêm sản phẩm" : "Sửa sản phẩm"}
                        </span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="content-product">
                        <div className="row">
                            <div className="col-12 col-sm-6 form-group">
                                <label>Tên sản phẩm (<span style={{color: "red"}}>*</span>):</label>
                                <input
                                    type="text"
                                    placeholder={"Nhập tên sản phẩm..."}
                                    className={errors.name ? "form-control is-invalid" : "form-control"}
                                    value={productData.name || ""}
                                    onChange={(e) => handleOnChangeInput(e.target.value, "name")}
                                />
                                {renderError(errors.name)}
                            </div>

                            <div className="col-12 col-sm-6 form-group">
                                <label>Giá sản phẩm (<span style={{color: "red"}}>*</span>):</label>
                                <input
                                    type="number"
                                    placeholder={"Nhập giá sản phẩm..."}
                                    className={errors.price ? "form-control is-invalid" : "form-control"}
                                    value={productData.price || ""}
                                    onChange={(e) => handleOnChangeInput(e.target.value, "price")}
                                    min={1}
                                />
                                {renderError(errors.price)}
                            </div>

                            <div className="col-12 col-sm-6 form-group">
                                <label>Giá sale (<span style={{color: "red"}}>*</span>):</label>
                                <input
                                    type="number"
                                    placeholder={"Nhập giá sale..."}
                                    className={errors.price_sale ? "form-control is-invalid" : "form-control"}
                                    value={productData.price_sale || ""}
                                    onChange={(e) => handleOnChangeInput(e.target.value, "price_sale")}
                                    min={1}
                                />
                                {renderError(errors.price_sale)}
                            </div>

                            <div className="col-12 col-sm-6 form-group">
                                <label>Danh mục sản phẩm (<span style={{color: "red"}}>*</span>):</label>
                                <select
                                    className={errors.categoryId ? "form-select form-group is-invalid" : "form-select form-group"}
                                    value={productData.categoryId || ""}
                                    onChange={(e) => handleOnChangeInput(e.target.value, "categoryId")}
                                >
                                    <option value={0}>--- Chọn danh mục sản phẩm ---</option>
                                    {renderCategoryOptions(categories)}
                                </select>
                                {renderError(errors.categoryId)}
                            </div>

                            <div className="col-12 col-sm-6 form-group">
                                <label>Đội bóng (<span style={{color: "red"}}>*</span>):</label>
                                <select
                                    className={errors.teamId ? "form-select form-group is-invalid" : "form-select form-group"}
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
                                {renderError(errors.teamId)}
                            </div>

                            <div className="col-12 col-sm-6 form-group">
                                <label>Chọn ảnh (<span style={{color: "red"}}>*</span>):</label>
                                <input type="file"
                                       accept="image/*"
                                       className={errors.image ? "form-control is-invalid" : "form-control"}
                                       onChange={(e) => handleUploadImages(e)}
                                       multiple
                                />
                                {renderError(errors.image)}
                            </div>

                            <div className="col-12 form-group">
                                <div
                                    className="form-control d-flex flex-wrap gap-3 preview-images justify-content-center align-items-center text-center">
                                    {
                                        previewImages && previewImages.length > 0 ?
                                            previewImages.map((preview, index) => (
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
                                            ))
                                            :
                                            <div className="img-placeholder">
                                                <span>Ảnh preview</span>
                                            </div>
                                    }
                                </div>
                            </div>

                            <div className="col-12 form-group">
                                <label>Mô tả:</label>
                                <textarea value={productData.description || ""}
                                          className="form-control"
                                          placeholder="Nhập mô tả sản phẩm tại đây..."
                                          rows="4"
                                          onChange={(e) => handleOnChangeInput(e.target.value, "description")} />
                            </div>

                            <div className="ad-product-detail col-12 form-group">
                                <label className="mb-3">Chi tiết sản phẩm:</label>
                                {productDetails.map((detail, detailIndex) => (
                                    <div key={`${detailIndex}`} className="card mb-3">
                                        <div className="card-body">
                                            <div className="color-image row">
                                                <div className="col-sm-5 mb-3">
                                                    <label className="form-label">Màu sắc (<span
                                                        style={{color: "red"}}>*</span>):</label>
                                                    <select
                                                        value={detail.colorId}
                                                        onChange={(e) => updateProductDetail(detailIndex, 'colorId', e.target.value)}
                                                        className={errors.productDetails?.[detailIndex]?.colorId ? "form-group form-select is-invalid" : "form-group form-select"}
                                                    >
                                                        <option value="">--- Chọn màu ---</option>
                                                        {colors && colors.map(color => (
                                                            <option key={color.id}
                                                                    value={color.id}>{color.name}</option>
                                                        ))}
                                                    </select>
                                                    {renderError(errors.productDetails?.[detailIndex]?.colorId)}
                                                </div>
                                                <div className="col-sm-5 mb-3">
                                                    <label className="form-label">Hình ảnh (<span
                                                        style={{color: "red"}}>*</span>):</label>
                                                    <div className="input-group file-input-group">
                                                        <input
                                                            type="file"
                                                            onChange={(e) => updateProductDetail(detailIndex, 'image', e.target.files[0])}
                                                            className={errors.productDetails?.[detailIndex]?.image ? "form-control d-none is-invalid" : "form-control d-none"}
                                                            id={`file-input-${detailIndex}`}
                                                            accept="image/*"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={detail.imageName || ''}
                                                            readOnly
                                                            className={errors.productDetails?.[detailIndex]?.image ? "form-control file-name-input is-invalid" : "form-control file-name-input"}
                                                            placeholder="No file chosen"
                                                        />
                                                        <label
                                                            className={`btn btn-outline-secondary ${errors.productDetails?.[detailIndex]?.image ? 'is-invalid' : ''}`}
                                                            htmlFor={`file-input-${detailIndex}`}>
                                                            Choose File
                                                        </label>
                                                    </div>
                                                    {renderError(errors.productDetails?.[detailIndex]?.image)}
                                                </div>
                                                <div
                                                    className="col-sm-2 d-flex justify-content-center align-items-center">
                                                    <div className="img-preview-wrapper">
                                                        {detail.imagePreview ? (
                                                            <img
                                                                src={detail.imagePreview}
                                                                alt="Preview"
                                                                className="img-thumbnail"
                                                                width={80}
                                                                height={80}
                                                            />
                                                        ) : (
                                                            <span>Ảnh preview</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <label className="mt-3 mb-2">Kích thước và số lượng (<span
                                                style={{color: "red"}}>*</span>):</label>
                                            {detail.sizes.map((size, sizeIndex) => (
                                                <div key={sizeIndex} className="row mb-2">
                                                    <div className="col-sm-5">
                                                        <select
                                                            value={size.sizeId}
                                                            onChange={(e) => updateSize(detailIndex, sizeIndex, 'sizeId', e.target.value)}
                                                            className={errors.productDetails?.[detailIndex]?.sizes?.[sizeIndex]?.sizeId ? "form-group form-select is-invalid" : "form-group form-select"}
                                                        >
                                                            <option value="">--- Chọn size ---</option>
                                                            {sizes.map(s => (
                                                                <option key={s.id}
                                                                        value={s.id}>{s.name} ({s.code})</option>
                                                            ))}
                                                        </select>
                                                        {renderError(errors.productDetails?.[detailIndex]?.sizes?.[sizeIndex]?.sizeId)}
                                                    </div>
                                                    <div className="col-sm-5 mt-3 mt-sm-0">
                                                        <input
                                                            type="number"
                                                            value={size.quantity}
                                                            onChange={(e) => updateSize(detailIndex, sizeIndex, 'quantity', e.target.value)}
                                                            placeholder="Số lượng"
                                                            className={errors.productDetails?.[detailIndex]?.sizes?.[sizeIndex]?.quantity ? "form-control is-invalid" : "form-control"}
                                                            min={1}
                                                        />
                                                        {renderError(errors.productDetails?.[detailIndex]?.sizes?.[sizeIndex]?.quantity)}
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

                                            <div
                                                className="d-flex gap-3 justify-content-center justify-content-sm-end align-items-center mt-3">
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
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" disabled={loading} onClick={() => handleClickCloseModal()}>
                        Đóng
                    </Button>
                    <Button variant="primary" disabled={loading} onClick={() => handleSubmit()}>
                        Lưu
                    </Button>
                </Modal.Footer>
            </Spin>
        </Modal>
    );
};

export default AdModalProduct;