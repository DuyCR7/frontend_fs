import React, {useEffect, useState} from 'react';
import AdModalTeam from "./AdModalTeam";
import {getAllTeam, setActiveTeam} from "../../../services/admin/teamService";
import ReactPaginate from "react-paginate";
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import { MdEdit, MdDelete } from "react-icons/md";
import { Spin } from 'antd';
import { GrStatusGood } from "react-icons/gr";
import { MdOutlineDangerous } from "react-icons/md";
import {IoAddCircleOutline, IoReload} from "react-icons/io5";
import "./adTeam.scss"
import AdModalDeleteTeam from "./AdModalDeleteTeam";
import {toast} from "react-toastify";
import useDebounce from "../../../utils/useDebounce";

const AdTeam = () => {

    const [loading, setLoading] = useState(false);
    const [listTeam, setListTeam] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [numRows, setNumRows] = useState(5);

    const [searchKeyword, setSearchKeyword] = useState("");
    const debouncedSearchInput = useDebounce(searchKeyword, 500);

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

    const fetchAllTeam = async (currentPage, numRows, searchKeyword = "", sortConfig = {key: 'id', direction: 'DESC'}) => {
        setLoading(true);
        try {
            let res = await getAllTeam(currentPage, numRows, searchKeyword.trim(), sortConfig);
            if (res && res.EC === 0) {
                setListTeam(res.DT.teams);
                setTotalPage(res.DT.totalPages);
            }
        } catch (e) {
            console.error(e);
            toast.error(e);
        } finally {
            setLoading(false);
        }
    }

    const toggleTeamStatus = async (id) => {
        setLoading(true);
        try {
            let res = await setActiveTeam(id);
            if (res && res.EC === 0) {
                await fetchAllTeam(currentPage, numRows, debouncedSearchInput, sortConfig);
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

    useEffect(() => {
        const fetchData = async () => {
            await fetchAllTeam(currentPage, numRows, debouncedSearchInput, sortConfig);
        };

        fetchData();
    }, [currentPage, numRows, debouncedSearchInput, sortConfig]);

    const [isShowModalTeam, setIsShowModalTeam] = useState(false);
    const [dataUpdate, setDataUpdate] = useState({});

    const [actionModalTeam, setActionModalTeam] = useState("CREATE");

    const [isShowModalDelete, setIsShowModalDelete] = useState(false);
    const [dataDelete, setDataDelete] = useState({});

    const handleCloseModalTeam = () => {
        setIsShowModalTeam(false);
        setDataUpdate({});
    }

    const handleCloseModalDelete = () => {
        setIsShowModalDelete(false);
        setDataDelete({});
    }
    
    const handleEditTeam = async (team) => {
        setIsShowModalTeam(true);
        setActionModalTeam("EDIT");
        setDataUpdate(team);
    }
    
    const handleDeleteTeam = async (team) => {
        setIsShowModalDelete(true);
        setDataDelete(team);
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
                        placeholder="Nhập tên đội bóng..."
                        value={searchKeyword}
                        onChange={(e) => handleSearch(e)}
                    />
                    <div className="col-md-5 col-1"></div>
                    <button
                        className="d-flex align-items-center justify-content-center gap-1 col-md-3 col-xl-3 col-5 btn btn-outline-primary"
                        onClick={() => {
                            setIsShowModalTeam(true);
                            setActionModalTeam("CREATE");
                        }}
                        style={{width: "max-content"}}
                    >
                        <IoAddCircleOutline size={25}/>
                        <span className="d-none d-sm-block">Thêm đội bóng</span>
                    </button>
                </div>
                <div className="table-team table-responsive">
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
                                Tên đội bóng
                                {
                                    sortConfig && sortConfig.key === 'name' && sortConfig.direction === 'ASC' &&
                                    <FaLongArrowAltDown />
                                }
                                {
                                    sortConfig && sortConfig.key === 'name' && sortConfig.direction === 'DESC' &&
                                    <FaLongArrowAltUp />
                                }
                            </th>
                            <th scope="col">Ảnh</th>
                            <th scope="col">Trạng thái</th>
                            <th scope="col">Hành động</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            listTeam && listTeam.length > 0 ?
                                <>
                                    {
                                        listTeam.map((item, index) => {
                                            return (
                                                <tr className="text-center" key={index}>
                                                    <td>{(currentPage - 1) * numRows + index + 1}</td>
                                                    <td>{item.id}</td>
                                                    <td>{item.name}</td>
                                                    <td>
                                                        <img src={`${process.env.REACT_APP_URL_BACKEND}/${item.image}`}
                                                             width={50} height={50} alt={item.image}/>
                                                    </td>
                                                    <td>
                                                        {item.isActive ?
                                                            <GrStatusGood size={25} title={"Trạng thái"} style={{color: "green", cursor: "pointer"}}
                                                                          onClick={() => toggleTeamStatus(item.id)}/>
                                                            :
                                                            <MdOutlineDangerous size={25} title={"Trạng thái"} style={{color: "red", cursor: "pointer"}}
                                                                                onClick={() => toggleTeamStatus(item.id)}/>
                                                        }
                                                    </td>
                                                    <td>
                                                        <div className="d-flex justify-content-center gap-2">
                                                            <MdEdit size={25} title={"Chỉnh sửa"} style={{color: "orange", cursor: "pointer"}}
                                                                    onClick={() => handleEditTeam(item)}/>
                                                            <MdDelete size={25} title={"Xóa"} style={{color: "red", cursor: "pointer"}}
                                                                      onClick={() => handleDeleteTeam(item)}/>
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
            </div>

            <AdModalTeam
                isShowModalTeam={isShowModalTeam}
                handleCloseModalTeam={handleCloseModalTeam}
                fetchAllTeam={fetchAllTeam}
                numRows={numRows}
                currentPage={currentPage}
                searchKeyword={debouncedSearchInput}
                sortConfig={sortConfig}
                setSortConfig={setSortConfig}
                setCurrentPage={setCurrentPage}
                actionModalTeam={actionModalTeam}
                dataUpdate={dataUpdate}
            />

            <AdModalDeleteTeam
                isShowModalDelete={isShowModalDelete}
                handleCloseModalDelete={handleCloseModalDelete}
                dataDelete={dataDelete}
                fetchAllTeam={fetchAllTeam}
                numRows={numRows}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        </>
    );
};

export default AdTeam;