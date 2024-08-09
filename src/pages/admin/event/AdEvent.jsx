import React, {useEffect, useState} from 'react';
import {IoAddCircleOutline, IoReload} from "react-icons/io5";
import "./adEvent.scss";
import AdModalEvent from "./AdModalEvent";
import {Spin} from "antd";
import {FaLongArrowAltDown, FaLongArrowAltUp} from "react-icons/fa";
import {GrStatusGood} from "react-icons/gr";
import {MdDelete, MdEdit, MdOutlineDangerous} from "react-icons/md";
import {getAllEvent, setActiveEvent} from "../../../services/admin/eventService";
import {formatDate} from "../../../utils/formatDate";
import {toast} from "react-toastify";
import AdModalDeleteEvent from "./AdModalDeleteEvent";

const AdEvent = () => {

    const [loading, setLoading] = useState(false);
    const [listEvent, setListEvent] = useState([]);

    const [searchKeyword, setSearchKeyword] = useState("");
    const [filteredEvent, setFilteredEvent] = useState([]);

    const [sortKey, setSortKey] = useState('id');
    const [sortOrder, setSortOrder] = useState('desc');

    const handleSearch = (e) => {
        const keyword = e.target.value.toLowerCase();
        setSearchKeyword(keyword);

        // Lọc danh mục dựa trên từ khóa tìm kiếm
        const filtered = listEvent.filter(category =>
            category.name.toLowerCase().includes(keyword)
        );
        setFilteredEvent(filtered);
    }

    const handleSort = (key) => {
        const newSortOrder = (sortKey === key && sortOrder === 'asc') ? 'desc' : 'asc';
        setSortKey(key);
        setSortOrder(newSortOrder);

        // Sắp xếp danh mục dựa trên tiêu chí và hướng sắp xếp
        const sorted = [...filteredEvent].sort((a, b) => {
            if (key === 'id') {
                return newSortOrder === 'asc' ? a.id - b.id : b.id - a.id;
            } else if (key === 'name') {
                const nameA = a.name.toLowerCase();
                const nameB = b.name.toLowerCase();
                if (nameA < nameB) return newSortOrder === 'asc' ? -1 : 1;
                if (nameA > nameB) return newSortOrder === 'asc' ? 1 : -1;
                return 0;
            }
            return 0;
        });

        setFilteredEvent(sorted);
    }

    const fetchAllEvents = async () => {
        setLoading(true);
        try {
            let res = await getAllEvent();
            if (res && res.EC === 0) {
                setListEvent(res.DT);
                setFilteredEvent(res.DT);
            } else {
                console.log("Error: ", res);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAllEvents();
    }, []);

    const toggleEventStatus = async (id) => {
        setLoading(true);
        try {
            let res = await setActiveEvent(id);
            if (res && res.EC === 0) {
                await fetchAllEvents();
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

    const handleRefresh = () => {
        setSearchKeyword("");
        setSortKey('id');
        setSortOrder('desc');
        setFilteredEvent([...listEvent]);
    };

    const [isShowModalEvent, setIsShowModalEvent] = useState(false);
    const [dataUpdate, setDataUpdate] = useState({});
    const [actionModalEvent, setActionModalEvent] = useState("CREATE");

    const [isShowModalDelete, setIsShowModalDelete] = useState(false);
    const [dataDelete, setDataDelete] = useState({});

    const handleCloseModalEvent = () => {
        setIsShowModalEvent(false);
        setDataUpdate({});
    }

    const handleCloseModalDelete = () => {
        setIsShowModalDelete(false);
        setDataDelete({});
    }

    const handleEditEvent = async (event) => {
        setIsShowModalEvent(true);
        setActionModalEvent("EDIT");
        setDataUpdate(event);
    }

    const handleDeleteEvent = async (event) => {
        setIsShowModalDelete(true);
        setDataDelete(event);
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
                        placeholder="Nhập tên sự kiện..."
                        value={searchKeyword}
                        onChange={(e) => handleSearch(e)}
                    />
                    <div className="col-md-5 col-1"></div>
                    <button
                        className="d-flex align-items-center justify-content-center gap-1 col-md-3 col-xl-3 col-5 btn btn-outline-primary"
                        onClick={() => {
                            setIsShowModalEvent(true);
                            setActionModalEvent("CREATE");
                        }}
                        style={{width: "max-content"}}
                    >
                        <IoAddCircleOutline size={25}/>
                        <span className="d-none d-sm-block">Thêm sự kiện</span>
                    </button>
                </div>

                <div className="table-event table-responsive">
                    <Spin spinning={loading}>
                        <table className="table table-hover">
                            <thead className="on-top">
                            <tr className="text-center table-active">
                                <th scope="col">STT</th>
                                <th scope="col" style={{cursor: "pointer"}} onClick={() => handleSort('id')}>
                                    Mã
                                    {sortKey === 'id' && (sortOrder === 'asc' ? <FaLongArrowAltDown/> :
                                        <FaLongArrowAltUp/>)}
                                </th>
                                <th scope="col" style={{cursor: "pointer"}} onClick={() => handleSort('name')}>
                                    Tên sự kiện
                                    {sortKey === 'name' && (sortOrder === 'asc' ? <FaLongArrowAltDown/> :
                                        <FaLongArrowAltUp/>)}
                                </th>
                                <th scope="col">Ảnh desktop</th>
                                <th scope="col">Ảnh mobile</th>
                                <th scope="col">Thời gian diễn ra</th>
                                <th scope="col">Cập nhật</th>
                                <th scope="col">Trạng thái</th>
                                <th scope="col">Hành động</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                filteredEvent && filteredEvent.length > 0 ?
                                    <>
                                        {
                                            filteredEvent.map((item, index) => {
                                                return (
                                                    <tr className="text-center" key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{item.id}</td>
                                                        <td>{item.name}</td>
                                                        <td>
                                                            <img
                                                                src={`${process.env.REACT_APP_URL_BACKEND}/${item.imageDesktop}`}
                                                                width={50} height={50} alt={item.image}/>
                                                        </td>
                                                        <td>
                                                            <img
                                                                src={`${process.env.REACT_APP_URL_BACKEND}/${item.imageMobile}`}
                                                                width={50} height={50} alt={item.image}/>
                                                        </td>
                                                        <td>{formatDate(item.eventDate)}</td>
                                                        <td>{formatDate(item.updatedAt)}</td>
                                                        <td>
                                                            {item.isActive ?
                                                                <GrStatusGood size={25} title={"Trạng thái"} style={{
                                                                    color: "green",
                                                                    cursor: "pointer"
                                                                }}
                                                                              onClick={() => toggleEventStatus(item.id)}
                                                                />
                                                                :
                                                                <MdOutlineDangerous size={25} title={"Trạng thái"}
                                                                                    style={{
                                                                                        color: "red",
                                                                                        cursor: "pointer"
                                                                                    }}
                                                                                    onClick={() => toggleEventStatus(item.id)}/>
                                                            }
                                                        </td>
                                                        <td>
                                                            <div className="d-flex justify-content-center gap-2">
                                                                <MdEdit size={25} title={"Chỉnh sửa"}
                                                                        style={{color: "orange", cursor: "pointer"}}
                                                                        onClick={() => handleEditEvent(item)}
                                                                />
                                                                <MdDelete size={25} title={"Xóa"}
                                                                          style={{color: "red", cursor: "pointer"}}
                                                                          onClick={() => handleDeleteEvent(item)}
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
                                            <td colSpan={9}>Không tìm thấy dữ liệu</td>
                                        </tr>
                                    </>
                            }
                            </tbody>
                        </table>
                    </Spin>
                </div>
            </div>

            <AdModalEvent
                isShowModalEvent={isShowModalEvent}
                handleCloseModalEvent={handleCloseModalEvent}
                fetchAllEvents={fetchAllEvents}
                listEvent={listEvent}
                actionModalEvent={actionModalEvent}
                dataUpdate={dataUpdate}
            />

            <AdModalDeleteEvent
                isShowModalDelete={isShowModalDelete}
                handleCloseModalDelete={handleCloseModalDelete}
                dataDelete={dataDelete}
                fetchAllEvents={fetchAllEvents}
            />
        </>
    );
};

export default AdEvent;