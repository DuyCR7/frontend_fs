import React, { useEffect, useState } from 'react';
import { LuRefreshCcw } from "react-icons/lu";
import { getBestSlowSelling } from "../../../../services/admin/statisticService";
import { Spin } from "antd";
import './bestSlowSelling.scss';

const BestSlowSelling = () => {
    const [data, setData] = useState({});
    const [year, setYear] = useState(new Date().getFullYear());
    const [type, setType] = useState('month');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, [year, type]);

    const fetchData = async () => {
        setLoading(true);
        try {
            let res = await getBestSlowSelling(type, year);
            if (res && res.EC === 0) {
                setData(res.DT);
            } else {
                setData({});
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    const handleRefresh = () => {
        setType('month');
        setYear(new Date().getFullYear());
    }

    const renderProductList = (products) => (
        <ul className="list-group">
            {products.map((product) => (
                <li key={product.id} className="list-group-item">
                    <span className="fw-semibold">{product.name}</span>: {product.totalSold}
                </li>
            ))}
        </ul>
    );

    return (
        <div className="card best-slow-selling">
            <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Thống kê hàng bán chạy/bán chậm</h5>
                <button className="btn btn-outline-success btn-sm" onClick={handleRefresh}>
                    <LuRefreshCcw />
                </button>
            </div>
            <div className="card-body">
                <div className="mb-3 row">
                    <div className="col-md-6 mb-2 mb-md-0">
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="form-select form-control"
                        >
                            <option value="month">Theo tháng</option>
                            <option value="quarter">Theo quý</option>
                            <option value="year">Theo năm</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <input
                            type="number"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            className="form-control"
                            placeholder="Năm"
                        />
                    </div>
                </div>

                <Spin spinning={loading}>
                    {Object.keys(data).length > 0 ? (
                        <div className="mt-4">
                            {Object.entries(data).map(([period, { bestSelling, slowSelling }]) => {
                                if (bestSelling.length === 0 && slowSelling.length === 0) {
                                    return null;
                                }
                                const singleColumn = bestSelling.length === 0 || slowSelling.length === 0;
                                return (
                                    <div key={period} className="mb-4 period-section">
                                        <h3 className="period-title">{period}</h3>
                                        <div className="row">
                                            {bestSelling.length > 0 && (
                                                <div className={singleColumn ? "col-12" : "col-md-6 mb-3 mb-md-0"}>
                                                    <div className="card best-selling">
                                                        <div className="card-header bg-success text-white">
                                                            Sản phẩm bán chạy
                                                        </div>
                                                        <div className="card-body">
                                                            {renderProductList(bestSelling)}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {slowSelling.length > 0 && (
                                                <div className={singleColumn ? "col-12" : "col-md-6"}>
                                                    <div className="card slow-selling">
                                                        <div className="card-header bg-danger text-white">
                                                            Sản phẩm bán chậm
                                                        </div>
                                                        <div className="card-body">
                                                            {renderProductList(slowSelling)}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="alert alert-info mt-3" role="alert">
                            Không có dữ liệu cho khoảng thời gian này.
                        </div>
                    )}
                </Spin>
            </div>
        </div>
    );
};

export default BestSlowSelling;