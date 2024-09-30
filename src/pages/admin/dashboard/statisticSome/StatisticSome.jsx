import React, {useEffect, useState} from 'react';
import {getStatisticSome} from "../../../../services/admin/statisticService";
import {Spin} from "antd";
import {LuRefreshCcw} from "react-icons/lu";
import "./statisticSome.scss";

const StatisticSome = () => {

    const [statistics, setStatistics] = useState({
        totalCustomers: 0,
        totalAdmins: 0,
        totalRevenue: 0,
        totalOrders: 0,
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        setLoading(true);
        try {
            let res = await getStatisticSome();
            if (res && res.EC === 0) {
                setStatistics(res.DT);
            } else {
                console.error('Error fetching statistics:', res.EM);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    const formatTotalRevenue = (value) => {
        if (value >= 1000000) {
            return `${(value / 1000000).toFixed(1)}M`;
        } else if (value >= 1000) {
            return `${(value / 1000).toFixed(1)}K`;
        }
        return value;
    }

    const handleRefresh = async () => {
        await fetchStatistics();
    }

    return (
        <Spin spinning={loading}>
            <div className="statistic-some d-flex align-items-center justify-content-between pt-2 pb-4">
                <div>
                    <h3 className="fw-bold mb-3">CR7 Shop</h3>
                    <h6 className="op-7 mb-2 text-uppercase">Thống kê</h6>
                </div>
                <button className="btn btn-outline-success btn-sm" onClick={handleRefresh}>
                    <LuRefreshCcw/>
                </button>
            </div>
            <div className="row">
                <div className="col-sm-6 col-md-3">
                    <div className="card card-stats card-round">
                        <div className="card-body">
                            <div className="row align-items-center">
                            <div className="col-icon">
                                    <div
                                        className="icon-big text-center icon-primary bubble-shadow-small"
                                    >
                                        <i className="fas fa-users"></i>
                                    </div>
                                </div>
                                <div className="col col-stats ms-3 ms-sm-0">
                                    <div className="numbers">
                                        <p className="card-category">Khách hàng</p>
                                        <h4 className="card-title">{statistics.totalCustomers > 0 ? statistics.totalCustomers : 0}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-sm-6 col-md-3">
                    <div className="card card-stats card-round">
                        <div className="card-body">
                            <div className="row align-items-center">
                                <div className="col-icon">
                                    <div
                                        className="icon-big text-center icon-info bubble-shadow-small"
                                    >
                                        <i className="fas fa-user-check"></i>
                                    </div>
                                </div>
                                <div className="col col-stats ms-3 ms-sm-0">
                                    <div className="numbers">
                                        <p className="card-category">Quản trị</p>
                                        <h4 className="card-title">{statistics.totalAdmins > 0 ? statistics.totalAdmins : 0}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-sm-6 col-md-3">
                    <div className="card card-stats card-round">
                        <div className="card-body">
                            <div className="row align-items-center">
                                <div className="col-icon">
                                    <div
                                        className="icon-big text-center icon-success bubble-shadow-small"
                                    >
                                        <i className="fas fa-luggage-cart"></i>
                                    </div>
                                </div>
                                <div className="col col-stats ms-3 ms-sm-0">
                                    <div className="numbers">
                                        <p className="card-category">Doanh thu</p>
                                        <h4 className="card-title">{statistics.totalRevenue > 0 ? formatTotalRevenue(statistics.totalRevenue) : 0}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-sm-6 col-md-3">
                    <div className="card card-stats card-round">
                        <div className="card-body">
                            <div className="row align-items-center">
                                <div className="col-icon">
                                    <div
                                        className="icon-big text-center icon-secondary bubble-shadow-small"
                                    >
                                        <i className="far fa-check-circle"></i>
                                    </div>
                                </div>
                                <div className="col col-stats ms-3 ms-sm-0">
                                    <div className="numbers">
                                        <p className="card-category">Đơn hàng</p>
                                        <h4 className="card-title">{statistics.totalOrders > 0 ? statistics.totalOrders : 0}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Spin>
    );
};

export default StatisticSome;