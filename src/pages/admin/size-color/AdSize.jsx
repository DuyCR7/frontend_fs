import React, {useEffect, useState} from 'react';
import {IoAddCircleOutline, IoReload} from "react-icons/io5";
import AdModalSize from "./AdModalSize";
import {getAllSize, setActiveSize} from "../../../services/admin/sizeService";
import {Spin} from "antd";
import {FaLongArrowAltDown, FaLongArrowAltUp} from "react-icons/fa";
import {GrStatusGood} from "react-icons/gr";
import {MdDelete, MdEdit, MdOutlineDangerous} from "react-icons/md";
import ReactPaginate from "react-paginate";
import {toast} from "react-toastify";
import AdModalDeleteSize from "./AdModalDeleteSize";

const AdSize = () => {

    const [loading, setLoading] = useState(false);
    const [listSize, setListSize] = useState([]);
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

    const fetchAllSize = async (currentPage, numRows, searchKeyword = "", sortConfig = {key: "id", direction: "DESC"}) => {
        setLoading(true);
        try {
            let res = await getAllSize(currentPage, numRows, searchKeyword, sortConfig);
            if (res && res.EC === 0) {
                setListSize(res.DT.sizes);
                setTotalPage(res.DT.totalPages);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const toggleSizeStatus = async (id) => {
        setLoading(true);
        try {
            let res = await setActiveSize(id);
            if (res && res.EC === 0) {
                await fetchAllSize(currentPage, numRows, searchKeyword, sortConfig);
                toast.success(res.EM);
            } else {
                await fetchAllSize(currentPage, numRows, searchKeyword, sortConfig);
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
            await fetchAllSize(currentPage, numRows, searchKeyword, sortConfig);
        };

        fetchData();
    }, [currentPage, numRows, searchKeyword, sortConfig]);

    const [isShowModalSize, setIsShowModalSize] = useState(false);
    const [dataUpdate, setDataUpdate] = useState({});

    const [actionModalSize, setActionModalSize] = useState("CREATE");

    const [isShowModalDelete, setIsShowModalDelete] = useState(false);
    const [dataDelete, setDataDelete] = useState({});

    const handleCloseModalSize = () => {
        setIsShowModalSize(false);
        setDataUpdate({});
    }

    const handleCloseModalDelete = () => {
        setIsShowModalDelete(false);
        setDataDelete({});
    }

    const handleEditSize = async (size) => {
        setIsShowModalSize(true);
        setActionModalSize("EDIT");
        setDataUpdate(size);
    }

    const handleDeleteSize = async (size) => {
        setIsShowModalDelete(true);
        setDataDelete(size);
    }

    const handleRefresh = () => {
        setCurrentPage(1);
        setSearchKeyword("");
        setSortConfig({ key: 'id', direction: 'DESC' });
    }

    return (
        <div className="mt-3">
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
                    placeholder="Nhập tên size..."
                    value={searchKeyword}
                    onChange={(e) => handleSearch(e)}
                />
                <div className="col-md-5 col-1"></div>
                <button
                    className="d-flex align-items-center justify-content-center gap-1 col-md-3 col-xl-3 col-5 btn btn-outline-primary"
                    onClick={() => {
                        setIsShowModalSize(true);
                        setActionModalSize("CREATE");
                    }}
                    style={{width: "max-content"}}
                >
                    <IoAddCircleOutline size={25}/>
                    <span className="d-none d-sm-block">Thêm size</span>
                </button>
            </div>

            <div className="table-size table-responsive">
                <Spin spinning={loading}>
                    <table className="table table-hover">
                        <thead className="on-top">
                        <tr className="text-center table-active">
                            <th scope="col">STT</th>
                            <th scope="col" style={{cursor: "pointer"}} onClick={() => handleSort('id')}>
                                Mã
                                {
                                    sortConfig && sortConfig.key === 'id' && sortConfig.direction === 'ASC' &&
                                    <FaLongArrowAltDown />
                                }
                                {
                                    sortConfig && sortConfig.key === 'id' && sortConfig.direction === 'DESC' &&
                                    <FaLongArrowAltUp />
                                }
                            </th>
                            <th scope="col" style={{cursor: "pointer"}} onClick={() => handleSort('name')}>
                                Tên size
                                {
                                    sortConfig && sortConfig.key === 'name' && sortConfig.direction === 'ASC' &&
                                    <FaLongArrowAltDown />
                                }
                                {
                                    sortConfig && sortConfig.key === 'name' && sortConfig.direction === 'DESC' &&
                                    <FaLongArrowAltUp />
                                }
                            </th>
                            <th scope="col" style={{cursor: "pointer"}} onClick={() => handleSort('code')}>
                                Mã code
                                {
                                    sortConfig && sortConfig.key === 'code' && sortConfig.direction === 'ASC' &&
                                    <FaLongArrowAltDown />
                                }
                                {
                                    sortConfig && sortConfig.key === 'code' && sortConfig.direction === 'DESC' &&
                                    <FaLongArrowAltUp />
                                }
                            </th>
                            <th scope="col">Trạng thái</th>
                            <th scope="col">Hành động</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            listSize && listSize.length > 0 ?
                                <>
                                    {
                                        listSize.map((item, index) => {
                                            return (
                                                <tr className="text-center" key={index}>
                                                    <td>{(currentPage - 1) * numRows + index + 1}</td>
                                                    <td>{item.id}</td>
                                                    <td>{item.name}</td>
                                                    <td>{item.code}</td>
                                                    <td>
                                                        {item.isActive ?
                                                            <GrStatusGood size={25} title={"Trạng thái"} style={{color: "green", cursor: "pointer"}}
                                                                          onClick={() => toggleSizeStatus(item.id)}/>
                                                            :
                                                            <MdOutlineDangerous size={25} title={"Trạng thái"} style={{color: "red", cursor: "pointer"}}
                                                                                onClick={() => toggleSizeStatus(item.id)}/>
                                                        }
                                                    </td>
                                                    <td>
                                                        <div className="d-flex justify-content-center gap-2">
                                                            <MdEdit size={25} title={"Chỉnh sửa"} style={{color: "orange", cursor: "pointer"}}
                                                                    onClick={() => handleEditSize(item)}/>
                                                            <MdDelete size={25} title={"Xóa"} style={{color: "red", cursor: "pointer"}}
                                                                      onClick={() => handleDeleteSize(item)}/>
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
                                        <td colSpan={6}>Không tìm thấy dữ liệu</td>
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

            <AdModalSize
                isShowModalSize={isShowModalSize}
                handleCloseModalSize={handleCloseModalSize}
                fetchAllSize={fetchAllSize}
                numRows={numRows}
                currentPage={currentPage}
                searchKeyword={searchKeyword}
                sortConfig={sortConfig}
                setSortConfig={setSortConfig}
                setCurrentPage={setCurrentPage}
                actionModalSize={actionModalSize}
                dataUpdate={dataUpdate}
            />

            <AdModalDeleteSize
                isShowModalDelete={isShowModalDelete}
                handleCloseModalDelete={handleCloseModalDelete}
                dataDelete={dataDelete}
                fetchAllSize={fetchAllSize}
                numRows={numRows}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        </div>
    );
};

export default AdSize;