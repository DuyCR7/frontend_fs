import React, {useEffect, useState} from 'react';
import useDebounce from "../../../utils/useDebounce";
import {getAllCustomers} from "../../../services/admin/manageCustomerService";
import {IoReload} from "react-icons/io5";
import {Spin} from "antd";
import {FaLongArrowAltDown, FaLongArrowAltUp} from "react-icons/fa";
import ReactPaginate from "react-paginate";
import {GrStatusGood} from "react-icons/gr";
import {MdOutlineDangerous} from "react-icons/md";
import "./adManageCustomer.scss";
import AdModalLockCustomer from "./AdModalLockCustomer";

const AdManageCustomer = () => {

    const [listCustomers, setListCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [numRows, setNumRows] = useState(10);

    const [searchKeyword, setSearchKeyword] = useState("");
    const debouncedSearchInput = useDebounce(searchKeyword, 500);

    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'DESC' });

    const [isShowModalLockCustomer, setIsShowModalLockCustomer] = useState(false);
    const [customerToLock, setCustomerToLock] = useState({});

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

    const fetchAllCustomers = async (currentPage, numRows, searchKeyword = "", sortConfig = {key: 'id', direction: 'DESC'}) => {
        setLoading(true);
        try {
            let res = await getAllCustomers(currentPage, numRows, searchKeyword.trim(), sortConfig);
            if (res && res.EC === 0) {
                setListCustomers(res.DT.customers);
                setTotalPage(res.DT.totalPages);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (debouncedSearchInput === searchKeyword) {
            fetchAllCustomers(currentPage, numRows, debouncedSearchInput, sortConfig);
        }
    }, [currentPage, numRows, debouncedSearchInput, sortConfig]);

    const handleRefresh = () => {
        setCurrentPage(1);
        setSearchKeyword("");
        setSortConfig({ key: 'id', direction: 'DESC' });
    }

    const handleLockCustomer = (customer) => {
        setIsShowModalLockCustomer(true);
        setCustomerToLock(customer);
    }

    const handleCloseModalLock = () => {
        setIsShowModalLockCustomer(false);
        setCustomerToLock({});
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
                        placeholder="Nhập email/số điện thoại..."
                        value={searchKeyword}
                        onChange={(e) => handleSearch(e)}
                    />
                </div>

                <div className="table-customers table-responsive">
                    <Spin spinning={loading}>
                        <table className="table table-hover table-striped">
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
                                <th scope="col">Email</th>
                                <th scope="col">Điện thoại</th>
                                <th scope="col">Họ và tên</th>
                                <th scope="col">Đơn hoàn thành</th>
                                <th scope="col">Đơn đã hủy</th>
                                <th scope="col">Trạng thái</th>
                                <th scope="col">Xác thực</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                listCustomers && listCustomers.length > 0 ?
                                    <>
                                        {
                                            listCustomers.map((item, index) => {
                                                return (
                                                    <tr className="text-center" key={item.id}>
                                                        <td>{(currentPage - 1) * numRows + index + 1}</td>
                                                        <td>{item.id}</td>
                                                        <td>{item.email}</td>
                                                        <td>{item.phone}</td>
                                                        <td>{item.fullname}</td>
                                                        <td>{item.successfulOrderCount}</td>
                                                        <td>{item.cancelledOrderCount}</td>
                                                        <td>
                                                            {item.isActive ?
                                                                <GrStatusGood size={25} title={"Trạng thái"} style={{
                                                                    color: "green",
                                                                    cursor: "pointer"
                                                                }}
                                                                              onClick={() => handleLockCustomer(item)}
                                                                />
                                                                :
                                                                <MdOutlineDangerous size={25} title={"Trạng thái"}
                                                                                    style={{
                                                                                        color: "red",
                                                                                        cursor: "pointer"
                                                                                    }}
                                                                                    onClick={() => handleLockCustomer(item)}
                                                                />
                                                            }
                                                        </td>
                                                        <td>
                                                            {item.verified ?
                                                                <span className="badge badge-success">Đã xác thực</span>
                                                                :
                                                                <span
                                                                    className="badge badge-danger">Chưa xác thực</span>
                                                            }
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
                    <div className="orders-footer mt-3 row">
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

            <AdModalLockCustomer
                isShowModalLockCustomer={isShowModalLockCustomer}
                handleCloseModalLock={handleCloseModalLock}
                customerToLock={customerToLock}
                fetchAllCustomers={fetchAllCustomers}
                numRows={numRows}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        </>
    );
};

export default AdManageCustomer;