import React, {useEffect, useState} from 'react';
import "./adVoucher.scss";
import useDebounce from "../../../utils/useDebounce";
import {IoAddCircleOutline, IoReload} from "react-icons/io5";
import AdModalVoucher from "./AdModalVoucher";
import {getAllVouchers, setActiveVoucher} from "../../../services/admin/voucherService";
import {Spin} from "antd";
import {FaLongArrowAltDown, FaLongArrowAltUp} from "react-icons/fa";
import {GrStatusGood} from "react-icons/gr";
import {MdDelete, MdEdit, MdOutlineDangerous} from "react-icons/md";
import ReactPaginate from "react-paginate";
import {formatCurrency} from "../../../utils/formatCurrency";
import {formatOnlyDate} from "../../../utils/formatOnlyDate";
import {toast} from "react-toastify";

const AdVoucher = () => {

    const [loading, setLoading] = useState(false);
    const [listVoucher, setListVoucher] = useState([]);
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

    useEffect(() => {
        const fetchData = async () => {
            await fetchAllVouchers(currentPage, numRows, debouncedSearchInput, sortConfig);
        }

        if (debouncedSearchInput === searchKeyword) {
            fetchData();
        }
    }, [currentPage, numRows, debouncedSearchInput, sortConfig]);

    const fetchAllVouchers = async (currentPage, numRows, searchKeyword = "", sortConfig = {key: "id", direction: "DESC"}) => {
        setLoading(true);
        try {
            let res = await getAllVouchers(currentPage, numRows, searchKeyword.trim(), sortConfig);
            if (res && res.EC === 0) {
                setListVoucher(res.DT.vouchers);
                setTotalPage(res.DT.totalPages);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    const toggleVoucherStatus = async (id) => {
        setLoading(true);
        try {
            let res = await setActiveVoucher(id);
            if (res && res.EC === 0) {
                await fetchAllVouchers(currentPage, numRows, debouncedSearchInput, sortConfig);
                toast.success(res.EM);
            } else {
                await fetchAllVouchers(currentPage, numRows, debouncedSearchInput, sortConfig);
                toast.error(res.EM);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    const [isShowModalVoucher, setIsShowModalVoucher] = useState(false);
    const [dataUpdate, setDataUpdate] = useState({});

    const [actionModalVoucher, setActionModalVoucher] = useState("CREATE");

    const handleCloseModalVoucher = () => {
        setIsShowModalVoucher(false);
        setDataUpdate({});
    }

    const handleEditVoucher = async (size) => {
        setIsShowModalVoucher(true);
        setActionModalVoucher("EDIT");
        setDataUpdate(size);
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
                        placeholder="Nhập mã voucher..."
                        value={searchKeyword}
                        onChange={(e) => handleSearch(e)}
                    />
                    <div className="col-md-5 col-1"></div>
                    <button
                        className="d-flex align-items-center justify-content-center gap-1 col-md-3 col-xl-3 col-5 btn btn-outline-primary"
                        onClick={() => {
                            setIsShowModalVoucher(true);
                            setActionModalVoucher("CREATE");
                        }}
                        style={{width: "max-content"}}
                    >
                        <IoAddCircleOutline size={25}/>
                        <span className="d-none d-sm-block">Thêm voucher</span>
                    </button>
                </div>

                <div className="table-voucher table-responsive">
                    <Spin spinning={loading}>
                        <table className="table table-hover">
                            <thead className="on-top">
                            <tr className="text-center table-active">
                                <th scope="col">STT</th>
                                <th scope="col" style={{cursor: "pointer"}} onClick={() => handleSort('code')}>
                                    Mã code
                                    {
                                        sortConfig && sortConfig.key === 'code' && sortConfig.direction === 'ASC' &&
                                        <FaLongArrowAltDown/>
                                    }
                                    {
                                        sortConfig && sortConfig.key === 'code' && sortConfig.direction === 'DESC' &&
                                        <FaLongArrowAltUp/>
                                    }
                                </th>
                                <th scope="col" style={{cursor: "pointer"}} onClick={() => handleSort('discountType')}>
                                    Loại giảm giá
                                    {
                                        sortConfig && sortConfig.key === 'discountType' && sortConfig.direction === 'ASC' &&
                                        <FaLongArrowAltDown/>
                                    }
                                    {
                                        sortConfig && sortConfig.key === 'discountType' && sortConfig.direction === 'DESC' &&
                                        <FaLongArrowAltUp/>
                                    }
                                </th>
                                <th scope="col">Giá trị giảm</th>
                                <th scope="col" style={{cursor: "pointer"}} onClick={() => handleSort('maxDiscountAmount')}>
                                    Tối đa
                                    {
                                        sortConfig && sortConfig.key === 'maxDiscountAmount' && sortConfig.direction === 'ASC' &&
                                        <FaLongArrowAltDown/>
                                    }
                                    {
                                        sortConfig && sortConfig.key === 'maxDiscountAmount' && sortConfig.direction === 'DESC' &&
                                        <FaLongArrowAltUp/>
                                    }
                                </th>
                                <th scope="col" style={{cursor: "pointer"}} onClick={() => handleSort('minOrderValue')}>
                                    Đơn tối thiểu
                                    {
                                        sortConfig && sortConfig.key === 'minOrderValue' && sortConfig.direction === 'ASC' &&
                                        <FaLongArrowAltDown/>
                                    }
                                    {
                                        sortConfig && sortConfig.key === 'minOrderValue' && sortConfig.direction === 'DESC' &&
                                        <FaLongArrowAltUp/>
                                    }
                                </th>
                                <th scope="col" style={{cursor: "pointer"}} onClick={() => handleSort('startDate')}>
                                    Ngày bắt đầu
                                    {
                                        sortConfig && sortConfig.key === 'startDate' && sortConfig.direction === 'ASC' &&
                                        <FaLongArrowAltDown/>
                                    }
                                    {
                                        sortConfig && sortConfig.key === 'startDate' && sortConfig.direction === 'DESC' &&
                                        <FaLongArrowAltUp/>
                                    }
                                </th>
                                <th scope="col" style={{cursor: "pointer"}} onClick={() => handleSort('endDate')}>
                                    Ngày kết thúc
                                    {
                                        sortConfig && sortConfig.key === 'endDate' && sortConfig.direction === 'ASC' &&
                                        <FaLongArrowAltDown/>
                                    }
                                    {
                                        sortConfig && sortConfig.key === 'endDate' && sortConfig.direction === 'DESC' &&
                                        <FaLongArrowAltUp/>
                                    }
                                </th>
                                <th scope="col" style={{cursor: "pointer"}} onClick={() => handleSort('usageLimit')}>
                                    Số lượng
                                    {
                                        sortConfig && sortConfig.key === 'usageLimit' && sortConfig.direction === 'ASC' &&
                                        <FaLongArrowAltDown/>
                                    }
                                    {
                                        sortConfig && sortConfig.key === 'usageLimit' && sortConfig.direction === 'DESC' &&
                                        <FaLongArrowAltUp/>
                                    }
                                </th>
                                <th scope="col" style={{cursor: "pointer"}} onClick={() => handleSort('usedCount')}>
                                    Đã sử dụng
                                    {
                                        sortConfig && sortConfig.key === 'usedCount' && sortConfig.direction === 'ASC' &&
                                        <FaLongArrowAltDown/>
                                    }
                                    {
                                        sortConfig && sortConfig.key === 'usedCount' && sortConfig.direction === 'DESC' &&
                                        <FaLongArrowAltUp/>
                                    }
                                </th>
                                <th scope="col">Trạng thái</th>
                                <th scope="col">Hành động</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                listVoucher && listVoucher.length > 0 ?
                                    <>
                                        {
                                            listVoucher.map((item, index) => {
                                                return (
                                                    <tr className="text-center" key={item.id}>
                                                        <td>{(currentPage - 1) * numRows + index + 1}</td>
                                                        <td>{item.code}</td>
                                                        <td>{item.discountType === 'percentage' ? '%' : 'VND'}</td>
                                                        <td>{item.discountType === 'percentage' ? `${item.discountValue} (%)` : `${formatCurrency(item.discountValue)}`}</td>
                                                        <td>{item.discountType === 'percentage' ? `${formatCurrency(item.maxDiscountAmount)}` : ''}</td>
                                                        <td>{formatCurrency(item.minOrderValue)}</td>
                                                        <td>{formatOnlyDate(item.startDate)}</td>
                                                        <td>{formatOnlyDate(item.endDate)}</td>
                                                        <td>{item.usageLimit}</td>
                                                        <td>{item.usedCount}</td>
                                                        <td>
                                                            {item.isActive ?
                                                                <GrStatusGood size={25} title={"Trạng thái"} style={{color: "green", cursor: "pointer"}}
                                                                    onClick={() => toggleVoucherStatus(item.id)}
                                                                />
                                                                :
                                                                <MdOutlineDangerous size={25} title={"Trạng thái"} style={{color: "red", cursor: "pointer"}}
                                                                    onClick={() => toggleVoucherStatus(item.id)}
                                                                />
                                                            }
                                                        </td>
                                                        <td>
                                                            <div className="d-flex justify-content-center">
                                                                <MdEdit size={25} title={"Chỉnh sửa"} style={{color: "orange", cursor: "pointer"}}
                                                                    onClick={() => handleEditVoucher(item)}
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
                                            <td colSpan={12}>Không tìm thấy dữ liệu</td>
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

            <AdModalVoucher
                isShowModalVoucher={isShowModalVoucher}
                actionModalVoucher={actionModalVoucher}
                fetchAllVouchers={fetchAllVouchers}
                dataUpdate={dataUpdate}
                handleCloseModalVoucher={handleCloseModalVoucher}
                numRows={numRows}
                currentPage={currentPage}
                searchKeyword={debouncedSearchInput}
                sortConfig={sortConfig}
                setSortConfig={setSortConfig}
                setCurrentPage={setCurrentPage}
            />
        </>
    );
};

export default AdVoucher;