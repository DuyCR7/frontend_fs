import React, {useEffect, useState} from 'react';
import {getRevenue} from "../../../../services/admin/statisticService";
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import {Spin} from "antd";
import {LuRefreshCcw} from "react-icons/lu";
import "./revenueChart.scss";

const RevenueChart = () => {

    const [data, setData] = useState([]);
    const [year, setYear] = useState(new Date().getFullYear());
    const [type, setType] = useState('month');

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, [year, type]);

    const fetchData = async () => {
        setLoading(true);
        try {
            let res = await getRevenue(type, year);
            if (res && res.EC === 0) {
                setData(res.DT);
            } else {
                setData([]);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    const formatYAxis = (value) => {
        if (value >= 1000000) {
            return `${(value / 1000000).toFixed(1)}M`;
        } else if (value >= 1000) {
            return `${(value / 1000).toFixed(1)}K`;
        }
        return value;
    }

    const formatTooltip = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    }

    const handleRefresh = () => {
        setType('month');
        setYear(new Date().getFullYear());
    }

    return (
        <div className="card revenue-chart">
            <div className="card-header d-flex align-items-center justify-content-between">
                <h5 className="card-title mb-0">Thống kê doanh thu</h5>
                <button className="btn btn-outline-success btn-sm" onClick={handleRefresh}>
                    <LuRefreshCcw/>
                </button>
            </div>
            <div className="card-body">
                <div className="mb-3">
                    <select value={type} onChange={(e) => setType(e.target.value)}
                            className="form-select form-control me-2">
                        <option value="month">Theo tháng</option>
                        <option value="quarter">Theo quý</option>
                        <option value="year">Theo năm</option>
                    </select>
                    <input
                        type="number"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="form-control mt-2"
                        placeholder="Năm"
                    />
                </div>
                <Spin spinning={loading}>
                    {
                        data.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey={type}/>
                                    <YAxis tickFormatter={formatYAxis}/>
                                    <Tooltip
                                        formatter={(value) => formatTooltip(value)}
                                    />
                                    <Legend/>
                                    <Bar dataKey="revenue" fill="#1178f2" name="Doanh thu"/>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="alert alert-info mt-3" role="alert">
                                Không có dữ liệu cho khoảng thời gian này.
                            </div>
                        )
                    }
                </Spin>
            </div>
        </div>
    );
};

export default RevenueChart;