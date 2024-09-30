import React, {useEffect, useState} from 'react';
import {getBestWishlist} from "../../../../services/admin/statisticService";
import {LuRefreshCcw} from "react-icons/lu";
import {Spin} from "antd";
import "./bestWishList.scss";

const BestWishlist = () => {

    const [data, setData] = useState([]);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            let res = await getBestWishlist();
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

    const handleRefresh = async () => {
        await fetchData();
    }

    return (
        <div className="card best-wishlist">
            <div className="card-header d-flex align-items-center justify-content-between">
                <h5 className="card-title mb-0">Top 5 sản phẩm yêu thích</h5>
                <button className="btn btn-outline-success btn-sm" onClick={handleRefresh}>
                    <LuRefreshCcw/>
                </button>
            </div>
            <div className="card-body">
                <Spin spinning={loading}>
                    <ul className="list-group">
                        {
                            data.length > 0 ? data.map((item) => {
                                return (
                                    <li key={item.id}
                                        className="list-group-item d-flex justify-content-between align-items-center">
                                        <div
                                            className="d-flex flex-wrap align-items-center justify-content-center gap-1">
                                            <span>{item.name}</span>
                                            <span>-</span>
                                            <strong>{item.category.name}</strong>
                                        </div>
                                        <span className="badge bg-primary rounded-pill">{item.wishCount}</span>
                                    </li>
                                );
                            }) : (
                                <div className="text-center">Chưa có dữ liệu thống kê</div>
                            )
                        }
                    </ul>
                </Spin>
            </div>
        </div>
    );
};

export default BestWishlist;