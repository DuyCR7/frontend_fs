import React, {useEffect, useState} from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {getOrderStatus} from "../../../../services/admin/statisticService";
import {Cell, Legend, Pie, PieChart, ResponsiveContainer, Sector, Tooltip} from "recharts";
import {Spin} from "antd";
import {LuRefreshCcw} from "react-icons/lu";
import "./orderChart.scss";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
const RADIAN = Math.PI / 180;

const OrderChart = () => {

    const [data, setData] = useState([]);
    const [type, setType] = useState('month');
    const [totalOrders, setTotalOrders] = useState(0); // State mới để lưu tổng số đơn hàng

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, [type, startDate, endDate]);

    const fetchData = async () => {
        setLoading(true);
        try {
            let res;
            switch (type) {
                case 'day':
                    res = await getOrderStatus(type, [startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]]);
                    break;
                case 'month':
                    res = await getOrderStatus(type, startDate.toISOString().slice(0, 7));
                    break;
                case 'year':
                    res = await getOrderStatus(type, startDate.getFullYear().toString());
                    break;
            }

            if (res && res.EC === 0 && res.DT.length > 0) {
                // console.log(res.DT);

                let processedData = [];
                let total = 0;

                if (type === 'day') {
                    // Combine data from all days
                    const combinedStatuses = res.DT.reduce((acc, day) => {
                        Object.entries(day.statuses).forEach(([status, count]) => {
                            acc[status] = (acc[status] || 0) + count;
                        });
                        total += day.total;
                        return acc;
                    }, {});
                    // console.log(combinedStatuses);

                    processedData = Object.entries(combinedStatuses).map(([name, value]) => ({ name, value }));
                } else {
                    // For month and year, the structure is already correct
                    processedData = Object.entries(res.DT[0].statuses).map(([name, value]) => ({ name, value }));
                    total = res.DT[0].total;
                }

                setTotalOrders(total);
                setData(processedData);
            } else {
                setTotalOrders(0);
                setData([]);
            }
        } catch (e) {
            console.error(e);
            setTotalOrders(0);
            setData([]);
        } finally {
            setLoading(false);
        }
    }

    const renderDatePicker = () => {
        switch (type) {
            case 'day':
                return (
                    <div className="d-flex flex-wrap align-items-center justify-content-center gap-3">
                        <DatePicker
                            selected={startDate}
                            onChange={date => setStartDate(date)}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            className="form-control me-2"
                        />
                        <DatePicker
                            selected={endDate}
                            onChange={date => setEndDate(date)}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            minDate={startDate}
                            className="form-control"
                        />
                    </div>
                );
            case 'month':
                return (
                    <div className="d-flex align-items-center justify-content-center">
                        <DatePicker
                            selected={startDate}
                            onChange={date => setStartDate(date)}
                            dateFormat="MM/yyyy"
                            showMonthYearPicker
                            className="form-control"
                        />
                    </div>
                );
            case 'year':
                return (
                    <div className="d-flex align-items-center justify-content-center">
                        <DatePicker
                            selected={startDate}
                            onChange={date => setStartDate(date)}
                            showYearPicker
                            dateFormat="yyyy"
                            className="form-control"
                        />
                    </div>
                );
        }
    }

    const handleRefresh = () => {
        setType('month');
        setStartDate(new Date());
        setEndDate(new Date());
    }

    const renderActiveShape = (props) => {
        const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
        const sin = Math.sin(-RADIAN * midAngle);
        const cos = Math.cos(-RADIAN * midAngle);
        const sx = cx + (outerRadius + 10) * cos;
        const sy = cy + (outerRadius + 10) * sin;
        const mx = cx + (outerRadius + 30) * cos;
        const my = cy + (outerRadius + 30) * sin;
        const ex = mx + (cos >= 0 ? 1 : -1) * 22;
        const ey = my;
        const textAnchor = cos >= 0 ? 'start' : 'end';

        return (
            <g>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                />
                <Sector
                    cx={cx}
                    cy={cy}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    innerRadius={outerRadius + 6}
                    outerRadius={outerRadius + 10}
                    fill={fill}
                />
                <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
                <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${payload.name}`}</text>
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                    {`${value} (${(percent * 100).toFixed(2)}%)`}
                </text>
            </g>
        );
    };

    const [activeIndex, setActiveIndex] = useState(0);
    const onPieEnter = (_, index) => {
        setActiveIndex(index);
    };
// console.log(data);
    return (
        <div className="card order-chart">
            <div className="card-header d-flex align-items-center justify-content-between">
                <h5 className="card-title mb-0">Thống kê đơn hàng</h5>
                <button className="btn btn-outline-success btn-sm" onClick={handleRefresh}>
                    <LuRefreshCcw/>
                </button>
            </div>
            <div className="card-body">
                <div className="mb-3">
                    <select value={type} onChange={(e) => setType(e.target.value)}
                            className="form-select form-control me-2 mb-3">
                        <option value="day">Theo ngày</option>
                        <option value="month">Theo tháng</option>
                        <option value="year">Theo năm</option>
                    </select>
                    {renderDatePicker()}
                </div>

                <Spin spinning={loading}>
                    {
                        data.length > 0 ? (
                            <>
                                <div className="text-center mb-3">
                                    <span className="fw-semibold">Tổng số đơn hàng: {totalOrders}</span>
                                </div>

                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            activeIndex={activeIndex}
                                            activeShape={renderActiveShape}
                                            data={data}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={90}
                                            fill="#8884d8"
                                            dataKey="value"
                                            onMouseEnter={onPieEnter}
                                        >
                                            {data.map((entry, index) => {
                                                return (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                                                )
                                            })}
                                        </Pie>
                                        <Tooltip/>
                                        <Legend/>
                                    </PieChart>
                                </ResponsiveContainer>
                            </>
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

export default OrderChart;