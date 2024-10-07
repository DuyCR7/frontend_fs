import React, {useEffect, useState} from 'react';
import "./adUser.scss";
import useDebounce from "../../../utils/useDebounce";
import {IoAddCircleOutline, IoReload} from "react-icons/io5";
import AdModalUser from "./AdModalUser";
import {toast} from "react-toastify";
import {getAllUsers, setActiveUser} from "../../../services/admin/userService";
import {Spin} from "antd";
import {FaLongArrowAltDown, FaLongArrowAltUp} from "react-icons/fa";
import {GrStatusGood} from "react-icons/gr";
import {MdDelete, MdEdit, MdOutlineDangerous} from "react-icons/md";
import ReactPaginate from "react-paginate";
import AdModalConfirmStatus from "./AdModalConfirmStatus";

const AdUser = () => {

    const [loading, setLoading] = useState(false);
    const [listUser, setListUser] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [numRows, setNumRows] = useState(10);

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

    const fetchAllUsers = async (currentPage, numRows, searchKeyword = "", sortConfig = {key: 'id', direction: 'DESC'}) => {
        setLoading(true);
        try {
            let res = await getAllUsers(currentPage, numRows, searchKeyword.trim(), sortConfig);
            if (res && res.EC === 0) {
                setListUser(res.DT.users);
                setTotalPage(res.DT.totalPages);
            }
        } catch (e) {
            console.error(e);
            toast.error(e);
        } finally {
            setLoading(false);
        }
    }

    const toggleUserStatus = async (id) => {
        setLoading(true);
        try {
            let res = await setActiveUser(id);
            if (res && res.EC === 0) {
                toast.success(res.EM);
                await fetchAllUsers(currentPage, numRows, debouncedSearchInput, sortConfig);
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
            await fetchAllUsers(currentPage, numRows, debouncedSearchInput, sortConfig);
        };

        if (debouncedSearchInput === searchKeyword) {
            fetchData();
        }
    }, [currentPage, numRows, debouncedSearchInput, sortConfig]);

    const [isShowModalUser, setIsShowModalUser] = useState(false);
    const [dataUpdate, setDataUpdate] = useState({});

    const [actionModalUser, setActionModalUser] = useState("CREATE");

    const [isShowModalConfirmStatus, setIsShowModalConfirmStatus] = useState(false);
    const [dataConfirmStatus, setDataConfirmStatus] = useState({});

    const handleCloseModalUser = () => {
        setIsShowModalUser(false);
        setDataUpdate({});
    }

    const handleEditUser = (user) => {
        setIsShowModalUser(true);
        setActionModalUser("EDIT");
        setDataUpdate(user);
    }

    const handleToggleUserStatus = (user) => {
        setIsShowModalConfirmStatus(true);
        setDataConfirmStatus(user);
    }

    const handleCloseModalConfirmStatus = () => {
        setIsShowModalConfirmStatus(false);
        setDataConfirmStatus({});
    }

    const handleConfirmToggleUserStatus = async () => {
        if (dataConfirmStatus) {
            await toggleUserStatus(dataConfirmStatus.id);
            handleCloseModalConfirmStatus();
        }
    }

    const handleRefresh = () => {
        setCurrentPage(1);
        setSearchKeyword("");
        setSortConfig({ key: 'id', direction: 'DESC' });
    }
console.log(listUser);
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
                        placeholder="Nhập email hoặc số điện thoại..."
                        value={searchKeyword}
                        onChange={(e) => handleSearch(e)}
                    />
                    <div className="col-md-5 col-1"></div>
                    <button
                        className="d-flex align-items-center justify-content-center gap-1 col-md-3 col-xl-3 col-5 btn btn-outline-primary"
                        onClick={() => {
                            setIsShowModalUser(true);
                            setActionModalUser("CREATE");
                        }}
                        style={{width: "max-content"}}
                    >
                        <IoAddCircleOutline size={25}/>
                        <span className="d-none d-sm-block">Thêm nhân viên</span>
                    </button>
                </div>

                <div className="table-user table-responsive">
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
                                <th scope="col" style={{cursor: "pointer"}} onClick={() => handleSort('email')}>
                                    Email
                                    {
                                        sortConfig && sortConfig.key === 'email' && sortConfig.direction === 'ASC' &&
                                        <FaLongArrowAltDown />
                                    }
                                    {
                                        sortConfig && sortConfig.key === 'email' && sortConfig.direction === 'DESC' &&
                                        <FaLongArrowAltUp />
                                    }
                                </th>
                                <th scope="col">Số điện thoại</th>
                                <th scope="col">Ảnh</th>
                                <th scope="col">Trạng thái</th>
                                <th scope="col">Hành động</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                listUser && listUser.length > 0 ?
                                    <>
                                        {
                                            listUser.map((item, index) => {
                                                return (
                                                    <tr className="text-center" key={item.id}>
                                                        <td>{(currentPage - 1) * numRows + index + 1}</td>
                                                        <td>{item.id}</td>
                                                        <td>{item.email}</td>
                                                        <td>{item.phone}</td>
                                                        <td>
                                                            <img src={`${process.env.REACT_APP_URL_BACKEND}/${item.image}`}
                                                                 width={50} height={50} alt={item.image}/>
                                                        </td>
                                                        <td>
                                                            {item.isActive ?
                                                                <GrStatusGood size={25} title={"Trạng thái"} style={{color: "green", cursor: "pointer"}}
                                                                              onClick={() => handleToggleUserStatus(item)}
                                                                />
                                                                :
                                                                <MdOutlineDangerous size={25} title={"Trạng thái"} style={{color: "red", cursor: "pointer"}}
                                                                                    onClick={() => handleToggleUserStatus(item)}
                                                                />
                                                            }
                                                        </td>
                                                        <td>
                                                            <div className="d-flex justify-content-center gap-2">
                                                                <MdEdit size={25} title={"Chỉnh sửa"} style={{color: "orange", cursor: "pointer"}}
                                                                        onClick={() => handleEditUser(item)}
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
                                            <td colSpan={7}>Không tìm thấy dữ liệu</td>
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
                                    nextLabel="Sau"
                                    onPageChange={handlePageClick}
                                    pageRangeDisplayed={3}
                                    marginPagesDisplayed={2}
                                    pageCount={totalPage}
                                    previousLabel="Trước"
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
                                    <option value={10}>Hiển thị 10</option>
                                    <option value={20}>Hiển thị 20</option>
                                    <option value={50}>Hiển thị 50</option>
                                    <option value={100}>Hiển thị 100</option>
                                </select>
                            </div>
                        </div>
                    </div>
                }
            </div>

            <AdModalUser
                isShowModalUser={isShowModalUser}
                handleCloseModalUser={handleCloseModalUser}
                fetchAllUsers={fetchAllUsers}
                actionModalUser={actionModalUser}
                dataUpdate={dataUpdate}
                searchKeyword={debouncedSearchInput}
                numRows={numRows}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                sortConfig={sortConfig}
                setSortConfig={setSortConfig}
            />

            <AdModalConfirmStatus
                loading={loading}
                isShowModalConfirmStatus={isShowModalConfirmStatus}
                handleCloseModalConfirmStatus={handleCloseModalConfirmStatus}
                handleConfirmToggleUserStatus={handleConfirmToggleUserStatus}
                dataConfirmStatus={dataConfirmStatus}
            />
        </>
    );
};

export default AdUser;