import React, {useEffect, useState} from 'react';
import "./adProduct.scss";
import AdModalProduct from "./AdModalProduct";
import {IoAddCircleOutline, IoReload} from "react-icons/io5";
import {Spin} from "antd";
import {FaLongArrowAltDown, FaLongArrowAltUp} from "react-icons/fa";
import {GrStatusGood} from "react-icons/gr";
import {MdDelete, MdEdit, MdOutlineDangerous} from "react-icons/md";
import ReactPaginate from "react-paginate";
import {getAllProduct, setActiveField} from "../../../services/admin/productService";
import {toast} from "react-toastify";
import {formatCurrency} from "../../../utils/formatCurrency";
import AdModalDeleteProduct from "./AdModalDeleteProduct";

const AdProduct = () => {

    const [loading, setLoading] = useState(false);
    const [listProduct, setListProduct] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [numRows, setNumRows] = useState(5);

    const [searchKeyword, setSearchKeyword] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'DESC' });

    const handlePageClick = async (event) => {
        // console.log(event);
        setCurrentPage(+event.selected + 1);
    };

    const handleShowRows = async (numRows) => {
        setNumRows(numRows);
        setCurrentPage(1);
    }

    const handleSearch = (e) => {
        setSearchKeyword(e.target.value);
        setCurrentPage(1);
    }

    const handleSort = (key) => {
        let direction = 'DESC';
        if (sortConfig.key === key && sortConfig.direction === 'DESC') {
            direction = 'ASC';
        }
        setSortConfig({ key, direction });
    }

    const fetchAllProduct = async (currentPage, numRows, searchKeyword = "", sortConfig = {key: 'id', direction: 'DESC'}) => {
        setLoading(true);
        try {
            let res = await getAllProduct(currentPage, numRows, searchKeyword, sortConfig);
            if (res && res.EC === 0) {
                setListProduct(res.DT.products);
                setTotalPage(res.DT.totalPages);
            }
        } catch (error) {
            console.error(error);
            toast.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            await fetchAllProduct(currentPage, numRows, searchKeyword, sortConfig);
        }

        fetchData();
    }, [currentPage, numRows, searchKeyword, sortConfig]);

    const toggleProductStatus = async (id, field) => {
        setLoading(true);
        try {
            const validFields = ['isSale', 'isTrending', 'isActive'];
            if (!validFields.includes(field)) {
                toast.error("Lỗi, vui lòng thử lại sau!");
            }

            const res = await setActiveField(id, field);
            if (res && res.EC === 0) {
                toast.success(res.EM);
                await fetchAllProduct(currentPage, numRows, searchKeyword, sortConfig);
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

    const [isShowModalProduct, setIsShowModalProduct] = useState(false);
    const [dataUpdate, setDataUpdate] = useState({});

    const [actionModalProduct, setActionModalProduct] = useState("CREATE");

    const [isShowModalDelete, setIsShowModalDelete] = useState(false);
    const [dataDelete, setDataDelete] = useState({});

    const handleCloseModalProduct = () => {
        setIsShowModalProduct(false);
        setDataUpdate({});
    }

    const handleCloseModalDelete = () => {
        setIsShowModalDelete(false);
        setDataDelete({});
    }

    const handleEditProduct = async (product) => {
        setIsShowModalProduct(true);
        setActionModalProduct("EDIT");
        setDataUpdate(product);
    }

    const handleDeleteProduct = async (product) => {
        setIsShowModalDelete(true);
        setDataDelete(product);
    }

    const handleRefresh = () => {
        setCurrentPage(1);
        setSearchKeyword("");
        setSortConfig({ key: 'id', direction: 'DESC' });
    }

    return (
        <>
            <div className="page-inner">
                <div className="d-flex align-items-center mb-3">
                    <button
                        className="d-flex align-items-center justify-content-center gap-1 col-md-2 col-xl-2 col-5 btn btn-outline-success"
                        onClick={handleRefresh}
                        style={{width: "max-content", marginRight: "10px"}}
                    >
                        <IoReload size={22}/>
                        <span className="d-none d-sm-block">Làm mới</span>
                    </button>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Nhập tên sản phẩm..."
                        value={searchKeyword}
                        onChange={(e) => handleSearch(e)}
                    />
                    <div className="col-md-5 col-1"></div>
                    <button
                        className="d-flex align-items-center justify-content-center gap-1 col-md-3 col-xl-3 col-5 btn btn-outline-primary"
                        onClick={() => {
                            setIsShowModalProduct(true);
                            setActionModalProduct("CREATE");
                        }}
                        style={{width: "max-content"}}
                    >
                        <IoAddCircleOutline size={25}/>
                        <span className="d-none d-sm-block">Thêm sản phẩm</span>
                    </button>
                </div>

                <div className="table-product table-responsive">
                    <Spin spinning={loading}>
                        <table className="table table-hover">
                            <thead className="on-top">
                            <tr className="text-center table-active">
                                <th scope="col">STT</th>
                                <th scope="col" style={{cursor: "pointer"}} onClick={() => handleSort('id')}>
                                    Mã
                                    {
                                        sortConfig && sortConfig.key === 'id' && sortConfig.direction === 'ASC' &&
                                        <FaLongArrowAltDown/>
                                    }
                                    {
                                        sortConfig && sortConfig.key === 'id' && sortConfig.direction === 'DESC' &&
                                        <FaLongArrowAltUp/>
                                    }
                                </th>
                                <th scope="col" style={{cursor: "pointer"}} onClick={() => handleSort('name')}>
                                    Tên sản phẩm
                                    {
                                        sortConfig && sortConfig.key === 'name' && sortConfig.direction === 'ASC' &&
                                        <FaLongArrowAltDown/>
                                    }
                                    {
                                        sortConfig && sortConfig.key === 'name' && sortConfig.direction === 'DESC' &&
                                        <FaLongArrowAltUp/>
                                    }
                                </th>
                                <th scope="col">Giá</th>
                                <th scope="col">Giá sale</th>
                                <th scope="col">Ảnh</th>
                                <th scope="col">Sale</th>
                                <th scope="col">Trending</th>
                                <th scope="col">Trạng thái</th>
                                <th scope="col">Hành động</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                listProduct && listProduct.length > 0 ?
                                    <>
                                        {
                                            listProduct.map((item, index) => {
                                                const mainImage = item.Product_Images.find(image => image.isMainImage);

                                                return (
                                                    <tr className="text-center" key={index}>
                                                        <td>{(currentPage - 1) * numRows + index + 1}</td>
                                                        <td>{item.id}</td>
                                                        <td>{item.name}</td>
                                                        <td>{formatCurrency(item.price)}</td>
                                                        <td>{formatCurrency(item.price_sale)}</td>
                                                        <td>
                                                            <img
                                                                src={`${process.env.REACT_APP_URL_BACKEND}/${mainImage.image}`}
                                                                width={50} height={50} alt={item.image}/>
                                                        </td>
                                                        <td>
                                                            {item.isSale ?
                                                                <GrStatusGood size={25} title={"Trạng thái"} style={{color: "green", cursor: "pointer"}}
                                                                              onClick={() => toggleProductStatus(item.id, 'isSale')}/>
                                                                :
                                                                <MdOutlineDangerous size={25} title={"Trạng thái"} style={{color: "red", cursor: "pointer"}}
                                                                                    onClick={() => toggleProductStatus(item.id, 'isSale')}/>
                                                            }
                                                        </td>
                                                        <td>
                                                            {item.isTrending ?
                                                                <GrStatusGood size={25} title={"Trạng thái"} style={{color: "green", cursor: "pointer"}}
                                                                              onClick={() => toggleProductStatus(item.id, 'isTrending')}/>
                                                                :
                                                                <MdOutlineDangerous size={25} title={"Trạng thái"} style={{color: "red", cursor: "pointer"}}
                                                                                    onClick={() => toggleProductStatus(item.id, 'isTrending')}/>
                                                            }
                                                        </td>
                                                        <td>
                                                            {item.isActive ?
                                                                <GrStatusGood size={25} title={"Trạng thái"} style={{color: "green", cursor: "pointer"}}
                                                                              onClick={() => toggleProductStatus(item.id, 'isActive')}/>
                                                                :
                                                                <MdOutlineDangerous size={25} title={"Trạng thái"} style={{color: "red", cursor: "pointer"}}
                                                                                    onClick={() => toggleProductStatus(item.id, 'isActive')}/>
                                                            }
                                                        </td>
                                                        <td>
                                                            <div className="d-flex justify-content-center gap-2">
                                                                <MdEdit size={25} title={"Chỉnh sửa"}
                                                                        style={{color: "orange", cursor: "pointer"}}
                                                                        onClick={() => handleEditProduct(item)}
                                                                />
                                                                <MdDelete size={25} title={"Xóa"}
                                                                          style={{color: "red", cursor: "pointer"}}
                                                                          onClick={() => handleDeleteProduct(item)}
                                                                />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </>
                                    :
                                    <>
                                        <tr>
                                            <td colSpan={10}>Không tìm thấy dữ liệu</td>
                                        </tr>
                                    </>
                            }
                            </tbody>
                        </table>
                    </Spin>
                </div>

                {totalPage > 0 &&
                    <div className="team-footer mt-3 row">
                        <div className="col d-flex justify-content-sm-end justify-content-center align-items-center">
                            <div className="me-3">
                                <ReactPaginate
                                    nextLabel="Next"
                                    onPageChange={handlePageClick}
                                    pageRangeDisplayed={3}
                                    marginPagesDisplayed={2}
                                    pageCount={totalPage}
                                    previousLabel="Prev"
                                    pageClassName="page-item"
                                    pageLinkClassName="page-link"
                                    previousClassName="page-item"
                                    previousLinkClassName="page-link"
                                    nextClassName="page-item"
                                    nextLinkClassName="page-link"
                                    breakLabel="..."
                                    breakClassName="page-item"
                                    breakLinkClassName="page-link"
                                    containerClassName="pagination"
                                    activeClassName="active"
                                    renderOnZeroPageCount={null}
                                    forcePage={currentPage - 1}
                                />
                            </div>
                            <div className="mb-3">
                                <select className="form-select" aria-label="Default select example"
                                        onChange={(e) => handleShowRows(e.target.value)}
                                        value={numRows}>
                                    <option value={5}>Show 5</option>
                                    <option value={10}>Show 10</option>
                                    <option value={15}>Show 15</option>
                                </select>
                            </div>
                        </div>
                    </div>
                }
            </div>
            <AdModalProduct
                isShowModalProduct={isShowModalProduct}
                handleCloseModalProduct={handleCloseModalProduct}
                fetchAllProduct={fetchAllProduct}
                numRows={numRows}
                currentPage={currentPage}
                searchKeyword={searchKeyword}
                sortConfig={sortConfig}
                setSortConfig={setSortConfig}
                setCurrentPage={setCurrentPage}
                actionModalProduct={actionModalProduct}
                dataUpdate={dataUpdate}
            />

            <AdModalDeleteProduct
                isShowModalDelete={isShowModalDelete}
                handleCloseModalDelete={handleCloseModalDelete}
                dataDelete={dataDelete}
                fetchAllProduct={fetchAllProduct}
                numRows={numRows}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        </>
    );
};

export default AdProduct;