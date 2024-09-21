import React, {useEffect, useState} from 'react';
import "./adBanner.scss";
import {IoAddCircleOutline, IoReload} from "react-icons/io5";
import AdModalBanner from "./AdModalBanner";
import {toast} from "react-toastify";
import {deleteManyBanners, getAllBanner, setActiveBanner} from "../../../services/admin/bannerService";
import {Spin} from "antd";
import {FaLongArrowAltDown, FaLongArrowAltUp} from "react-icons/fa";
import {GrStatusGood} from "react-icons/gr";
import {MdDelete, MdEdit, MdOutlineDangerous} from "react-icons/md";
import ReactPaginate from "react-paginate";
import AdModalDeleteBanner from "./AdModalDeleteBanner";
import useDebounce from "../../../utils/useDebounce";

const AdBanner = () => {
    const [loading, setLoading] = useState(false);
    const [listBanner, setListBanner] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [numRows, setNumRows] = useState(5);

    const [searchKeyword, setSearchKeyword] = useState("");
    const debouncedSearchInput = useDebounce(searchKeyword, 500);

    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'DESC' });

    const [selectedIds, setSelectedIds] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

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

    const fetchAllBanner = async (currentPage, numRows, searchKeyword = "", sortConfig = {key: 'id', direction: 'DESC'}) => {
        setLoading(true);
        try {
            let res = await getAllBanner(currentPage, numRows, searchKeyword.trim(), sortConfig);
            if (res && res.EC === 0) {
                setListBanner(res.DT.banners);
                setTotalPage(res.DT.totalPages);
            }
        } catch (e) {
            console.error(e);
            toast.error(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            await fetchAllBanner(currentPage, numRows, debouncedSearchInput, sortConfig);
        };

        if(debouncedSearchInput === searchKeyword) {
            fetchData();
        }
        setSelectedIds([]);
        setSelectAll(false);
    }, [currentPage, numRows, debouncedSearchInput, sortConfig]);

    const toggleCheckbox = (id) => {
        const currentIndex = selectedIds.indexOf(id);
        const newSelectedIds = [...selectedIds];
        if (currentIndex === -1) {
            newSelectedIds.push(id);
        } else {
            newSelectedIds.splice(currentIndex, 1);
        }
        setSelectedIds(newSelectedIds);
        setSelectAll(newSelectedIds.length === listBanner.length);
    };

    const toggleSelectAll = () => {
        if (selectAll) {
            setSelectedIds([]);
        } else {
            const ids = listBanner.map(item => item.id);
            setSelectedIds(ids);
        }
        setSelectAll(!selectAll);
    };

    const handleDeleteManyBanners = async (selectedIds) => {
        setLoading(true);
        try {
            let res = await deleteManyBanners(selectedIds);
            if (res && res.EC === 0) {
                toast.success(res.EM);
                setSelectedIds([]);
                setSelectAll(false);
                setCurrentPage(1);
                setSearchKeyword("");
                setSortConfig({ key: 'id', direction: 'DESC' });
                await fetchAllBanner(currentPage, numRows, searchKeyword, sortConfig);
            } else {
                toast.error(res.EM);
            }
        } catch (e) {
            console.log(e);
            toast.error(e);
        } finally {
            setLoading(false);
        }
    }

    const toggleBannerStatus = async (id) => {
        setLoading(true);
        try {
            let res = await setActiveBanner(id);
            if (res && res.EC === 0) {
                await fetchAllBanner(currentPage, numRows, debouncedSearchInput, sortConfig);
                toast.success(res.EM);
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

    const [isShowModalBanner, setIsShowModalBanner] = useState(false);
    const [dataUpdate, setDataUpdate] = useState({});

    const [actionModalBanner, setActionModalBanner] = useState("CREATE");

    const [isShowModalDelete, setIsShowModalDelete] = useState(false);
    const [dataDelete, setDataDelete] = useState({});

    const handleCloseModalBanner = () => {
        setIsShowModalBanner(false);
        setDataUpdate({});
    }

    const handleEditBanner = async (banner) => {
        setIsShowModalBanner(true);
        setActionModalBanner("EDIT");
        setDataUpdate(banner);
    }

    const handleCloseModalDelete = () => {
        setIsShowModalDelete(false);
        setDataDelete({});
    }

    const handleDeleteBanner = async (banner) => {
        setIsShowModalDelete(true);
        setDataDelete(banner);
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
                    {
                        selectedIds.length > 0 &&
                        <button className="btn btn-outline-danger d-flex align-items-center justify-content-center gap-1 me-2 col-md-2 col-xl-2 col-5"
                                disabled={loading}
                                onClick={() => handleDeleteManyBanners(selectedIds)}
                                style={{width: "max-content"}}
                        >
                            <MdDelete size={22}/>
                            <span className="d-none d-sm-block">Xóa tất cả</span>
                        </button>
                    }
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
                        placeholder="Nhập tên banner..."
                        value={searchKeyword}
                        onChange={(e) => handleSearch(e)}
                    />
                    <div className="col-md-3 col-1"></div>
                    <button
                        className="d-flex align-items-center justify-content-center gap-1 col-md-3 col-xl-3 col-5 btn btn-outline-primary"
                        onClick={() => {
                            setIsShowModalBanner(true);
                            setActionModalBanner("CREATE");
                        }}
                        style={{width: "max-content"}}
                    >
                        <IoAddCircleOutline size={25}/>
                        <span className="d-none d-sm-block">Thêm banner</span>
                    </button>
                </div>

                <div className="table-banner table-responsive">
                    <Spin spinning={loading}>
                        <table className="table table-hover">
                            <thead className="on-top">
                            <tr className="text-center table-active">
                                <th scope="col">
                                    <input
                                        type="checkbox"
                                        checked={selectAll}
                                        onChange={toggleSelectAll}
                                    />
                                </th>
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
                                    Tên banner
                                    {
                                        sortConfig && sortConfig.key === 'name' && sortConfig.direction === 'ASC' &&
                                        <FaLongArrowAltDown/>
                                    }
                                    {
                                        sortConfig && sortConfig.key === 'name' && sortConfig.direction === 'DESC' &&
                                        <FaLongArrowAltUp/>
                                    }
                                </th>
                                <th scope="col">Ảnh desktop</th>
                                <th scope="col">Ảnh mobile</th>
                                <th scope="col">Đường dẫn</th>
                                <th scope="col">Trạng thái</th>
                                <th scope="col">Hành động</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                listBanner && listBanner.length > 0 ?
                                    <>
                                        {
                                            listBanner.map((item, index) => {
                                                return (
                                                    <tr className="text-center" key={item.id}>
                                                        <td>
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedIds.includes(item.id)}
                                                                onChange={() => toggleCheckbox(item.id)}
                                                            />
                                                        </td>
                                                        <td>{(currentPage - 1) * numRows + index + 1}</td>
                                                        <td>{item.id}</td>
                                                        <td>{item.name}</td>
                                                        <td>
                                                            <img
                                                                src={`${process.env.REACT_APP_URL_BACKEND}/${item.imageDesktop}`}
                                                                width={50} height={50} alt={item.image}/>
                                                        </td>
                                                        <td>
                                                            <img
                                                                src={`${process.env.REACT_APP_URL_BACKEND}/${item.imageMobile}`}
                                                                width={50} height={50} alt={item.image}/>
                                                        </td>
                                                        <td>{item.url}</td>
                                                        <td>
                                                            {item.isActive ?
                                                                <GrStatusGood size={25} title={"Trạng thái"} style={{
                                                                    color: "green",
                                                                    cursor: "pointer"
                                                                }}
                                                                              onClick={() => toggleBannerStatus(item.id)}/>
                                                                :
                                                                <MdOutlineDangerous size={25} title={"Trạng thái"}
                                                                                    style={{
                                                                                        color: "red",
                                                                                        cursor: "pointer"
                                                                                    }}
                                                                                    onClick={() => toggleBannerStatus(item.id)}/>
                                                            }
                                                        </td>
                                                        <td>
                                                            <div className="d-flex justify-content-center gap-2">
                                                                <MdEdit size={25} title={"Chỉnh sửa"}
                                                                        style={{color: "orange", cursor: "pointer"}}
                                                                        onClick={() => handleEditBanner(item)}/>
                                                                <MdDelete size={25} title={"Xóa"}
                                                                          style={{color: "red", cursor: "pointer"}}
                                                                          onClick={() => handleDeleteBanner(item)}/>
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
                                            <td colSpan={9}>Không tìm thấy dữ liệu</td>
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

            <AdModalBanner
                isShowModalBanner={isShowModalBanner}
                handleCloseModalBanner={handleCloseModalBanner}
                actionModalBanner={actionModalBanner}
                fetchAllBanner={fetchAllBanner}
                numRows={numRows}
                currentPage={currentPage}
                searchKeyword={debouncedSearchInput}
                sortConfig={sortConfig}
                setSortConfig={setSortConfig}
                setCurrentPage={setCurrentPage}
                dataUpdate={dataUpdate}
            />

            <AdModalDeleteBanner
                isShowModalDelete={isShowModalDelete}
                handleCloseModalDelete={handleCloseModalDelete}
                dataDelete={dataDelete}
                fetchAllBanner={fetchAllBanner}
                numRows={numRows}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        </>
    );
};

export default AdBanner;