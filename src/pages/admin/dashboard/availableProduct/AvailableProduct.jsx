import React, {useEffect, useState} from 'react';
import {LuRefreshCcw} from "react-icons/lu";
import {getAvailableProduct} from "../../../../services/admin/statisticService";
import {Spin} from "antd";
import ReactPaginate from "react-paginate";
import "./availableProduct.scss";
import {FaLongArrowAltDown, FaLongArrowAltUp} from "react-icons/fa";

const AvailableProduct = () => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [numRows, setNumRows] = useState(10);

    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');

    useEffect(() => {
        fetchData(currentPage, numRows, sortField, sortOrder);
    }, [currentPage, numRows, sortField, sortOrder]);

    const fetchData = async (page, limit, sortField, sortOrder) => {
        setLoading(true);
        try {
            let res = await getAvailableProduct(page, limit, sortField, sortOrder);
            if (res && res.EC === 0) {
                setData(res.DT.products);
                setTotalPages(res.DT.totalPages);
            } else {
                setData([]);
                setTotalPages(0);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected + 1);
    };

    const handleShowRows = async (numRows) => {
        setNumRows(numRows);
        setCurrentPage(1);
    }

    const handleRefresh = () => {
        setCurrentPage(1);
        setNumRows(10);
        setSortField('');
        setSortOrder('asc');
    }

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    }

    const getSortIcon = (field) => {
        if (sortField === field) {
            return sortOrder === 'asc' ? <FaLongArrowAltUp /> : <FaLongArrowAltDown />
        }
        return null;
    }

    console.log(data);
    return (
        <div className="card available-product">
            <div className="card-header d-flex align-items-center justify-content-between">
                <h5 className="card-title mb-0">Số lượng sản phẩm sẵn có</h5>
                <button className="btn btn-outline-success btn-sm" onClick={handleRefresh}>
                    <LuRefreshCcw/>
                </button>
            </div>
            <div className="card-body">
                <div className="table-available table-responsive">
                    <Spin spinning={loading}>
                        <table className="table table-hover">
                            <thead className="on-top">
                            <tr className="text-center">
                                <th scope="col">STT</th>
                                <th scope="col">Mã</th>
                                <th scope="col">Sản phẩm</th>
                                <th scope="col" onClick={() => handleSort('quantity')} style={{cursor: 'pointer'}}>
                                    Số lượng còn lại {getSortIcon('quantity')}
                                </th>
                                <th scope="col" onClick={() => handleSort('soldQuantity')} style={{cursor: 'pointer'}}>
                                    Số lượng đã bán {getSortIcon('soldQuantity')}
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                data && data.length > 0 ?
                                    <>
                                        {
                                            data.map((item, index) => {
                                                return (
                                                    <tr className="text-center" key={item.id}>
                                                        <td>{(currentPage - 1) * numRows + index + 1}</td>
                                                        <td>{`${item.Product.id} - ${item.id}`}</td>
                                                        <td>{`${item.Product.name} - ${item.Size.code} - ${item.Color.name}`}</td>
                                                        <td>{item.quantity}</td>
                                                        <td>{item.soldQuantity}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </>
                                    :
                                    <>
                                        <tr>
                                            <td colSpan={5}>Không tìm thấy dữ liệu</td>
                                        </tr>
                                    </>
                            }
                            </tbody>
                        </table>
                    </Spin>
                </div>

                {totalPages > 0 &&
                    <div className="team-footer mt-3 row">
                        <div className="col d-flex justify-content-center align-items-center">
                            <div className="me-3">
                                <ReactPaginate
                                    nextLabel="Sau"
                                    onPageChange={handlePageClick}
                                    pageRangeDisplayed={3}
                                    marginPagesDisplayed={2}
                                    pageCount={totalPages}
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
                                </select>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};

export default AvailableProduct;