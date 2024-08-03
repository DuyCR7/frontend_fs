import React, {useEffect, useState} from 'react';
import AdModalCategory from "./AdModalCategory";
import "./adCategory.scss";
import {IoAddCircleOutline, IoReload} from "react-icons/io5";
import {getAllCategory, getParentCategory, setActiveCategory} from "../../../services/admin/categoryService";
import {Spin} from "antd";
import {FaLongArrowAltDown, FaLongArrowAltUp} from "react-icons/fa";
import { TbArrowBarRight } from "react-icons/tb";
import {GrStatusGood} from "react-icons/gr";
import {MdDelete, MdEdit, MdOutlineDangerous} from "react-icons/md";
import {toast} from "react-toastify";
import AdModalDeleteCategory from "./AdModalDeleteCategory";

const AdCategory = () => {

    const [loading, setLoading] = useState(false);
    const [listParentCategory, setListParentCategory] = useState([]);
    const [listCategory, setListCategory] = useState([]);

    const [searchKeyword, setSearchKeyword] = useState("");
    const [filteredCategory, setFilteredCategory] = useState([]);

    const [sortKey, setSortKey] = useState('id');
    const [sortOrder, setSortOrder] = useState('desc');

    const handleSearch = (e) => {
        const keyword = e.target.value.toLowerCase();
        setSearchKeyword(keyword);

        // Lọc danh mục dựa trên từ khóa tìm kiếm
        const filtered = listCategory.filter(category =>
            category.name.toLowerCase().includes(keyword)
        );
        setFilteredCategory(filtered);
    }

    const handleSort = (key) => {
        const newSortOrder = (sortKey === key && sortOrder === 'asc') ? 'desc' : 'asc';
        setSortKey(key);
        setSortOrder(newSortOrder);

        // Sắp xếp danh mục dựa trên tiêu chí và hướng sắp xếp
        const sorted = [...filteredCategory].sort((a, b) => {
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

        setFilteredCategory(sorted);
    }

    const handelFetchAllCategory = async () => {
        setLoading(true);
        try {
            let res = await getAllCategory();
            if (res && res.EC === 0) {
                setListCategory(res.DT);
                setFilteredCategory(res.DT);
            } else {
                console.log("Error: ", res);
            }
        } catch (error) {
            console.log("Error: ", error);
        } finally {
            setLoading(false);
        }
    }

    const fetchAllParentCategory = async () => {
        try {
            let res = await getParentCategory();
            if(res && res.EC === 0) {
                setListParentCategory(res.DT);
            }
        } catch (e) {
            console.log(e);
            toast.error(e);
        }
    }

    const toggleCateogoryStatus = async (id) => {
        setLoading(true);
        try {
            let res = await setActiveCategory(id);
            if (res && res.EC === 0) {
                await handelFetchAllCategory();
                await fetchAllParentCategory();
                toast.success(res.EM);
            } else if (res && res.EC === 1) {
                toast.error(res.EM);
            } else {
                await handelFetchAllCategory();
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
        setFilteredCategory([...listCategory]);
    };

    useEffect(() => {
        const fetchData = async () => {
            await handelFetchAllCategory();
        }

        fetchData();
    }, [])

    const [isShowModalCategory, setIsShowModalCategory] = useState(false);
    const [dataUpdate, setDataUpdate] = useState({});
    const [actionModalCategory, setActionModalCategory] = useState("CREATE");

    const [isShowModalDelete, setIsShowModalDelete] = useState(false);
    const [dataDelete, setDataDelete] = useState({});

    const handleCloseModalCategory = () => {
        setIsShowModalCategory(false);
        setDataUpdate({});
    }

    const handleCloseModalDelete = () => {
        setIsShowModalDelete(false);
        setDataDelete({});
    }

    const handleEditCategory = async (category) => {
        setIsShowModalCategory(true);
        setActionModalCategory("EDIT");
        setDataUpdate(category);
    }

    const handleDeleteCategory = async (category) => {
        setIsShowModalDelete(true);
        setDataDelete(category);
    }

    const renderCategoryRow = (category, level = 0, prefix = "") => {
        const currentPrefix = prefix ? `${prefix}.${category.id}` : `${category.id}`;
        return (
            <React.Fragment key={category.id}>
                <tr>
                    <td className="text-center">{currentPrefix}</td>
                    <td className="text-center">{category.id}</td>
                    <td>
                        {Array(level).fill().map((_, i) => (
                            <TbArrowBarRight key={i} className="mb-1" size={20}/>
                        ))}
                        {category.name}
                    </td>
                    <td className="text-center">
                        <img src={`${process.env.REACT_APP_URL_BACKEND}/${category.image}`}
                             width={50} height={50} alt={category.image}/>
                    </td>
                    <td className="text-center">
                        {category.isActive ?
                            <GrStatusGood size={25} title={"Trạng thái"}
                                          style={{color: "green", cursor: "pointer"}}
                                          onClick={() => toggleCateogoryStatus(category.id)}
                            />
                            :
                            <MdOutlineDangerous size={25} title={"Trạng thái"}
                                                style={{color: "red", cursor: "pointer"}}
                                                onClick={() => toggleCateogoryStatus(category.id)}
                            />
                        }
                    </td>
                    <td className="text-center">
                        <div className="d-flex justify-content-center gap-2">
                            <MdEdit size={25} title={"Chỉnh sửa"}
                                    style={{color: "orange", cursor: "pointer"}}
                                    onClick={() => handleEditCategory(category)}
                            />
                            <MdDelete size={25} title={"Xóa"}
                                      style={{color: "red", cursor: "pointer"}}
                                      onClick={() => handleDeleteCategory(category)}
                            />
                        </div>
                    </td>
                </tr>
                {category.children && category.children.length > 0 && category.children.map(child => renderCategoryRow(child, level + 1, `${currentPrefix}`))}
            </React.Fragment>
        );
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
                        placeholder="Nhập tên danh mục..."
                        value={searchKeyword}
                        onChange={(e) => handleSearch(e)}
                    />
                    <div className="col-md-5 col-1"></div>
                    <button
                        className="d-flex align-items-center justify-content-center gap-1 col-md-3 col-xl-3 col-5 btn btn-outline-primary"
                        onClick={() => {
                            setIsShowModalCategory(true);
                            setActionModalCategory("CREATE");
                        }}
                        style={{width: "max-content"}}
                    >
                        <IoAddCircleOutline size={25}/>
                        <span className="d-none d-sm-block">Thêm danh mục</span>
                    </button>
                </div>
                <div className="table-category table-responsive">
                    <Spin spinning={loading}>
                        <table className="table table-hover">
                            <thead className="on-top">
                            <tr className="text-center table-active">
                                <th scope="col">STT</th>
                                <th scope="col" style={{cursor: "pointer"}} onClick={() => handleSort('id')}>
                                    Mã danh mục
                                    {sortKey === 'id' && (sortOrder === 'asc' ? <FaLongArrowAltDown /> : <FaLongArrowAltUp />)}
                                </th>
                                <th scope="col" style={{cursor: "pointer"}} onClick={() => handleSort('name')}>
                                    Tên danh mục
                                    {sortKey === 'name' && (sortOrder === 'asc' ? <FaLongArrowAltDown /> : <FaLongArrowAltUp />)}
                                </th>
                                <th scope="col">Ảnh</th>
                                <th scope="col">Trạng thái</th>
                                <th scope="col">Hành động</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                filteredCategory && filteredCategory.length > 0 ?
                                    filteredCategory.map(category => renderCategoryRow(category))
                                    :
                                    <>
                                        <tr>
                                            <td colSpan={6}>Không tìm thấy dữ liệu</td>
                                        </tr>
                                    </>
                            }
                            </tbody>
                        </table>
                    </Spin>
                </div>
            </div>

            <AdModalCategory
                isShowModalCategory={isShowModalCategory}
                handleCloseModalCategory={handleCloseModalCategory}
                handelFetchAllCategory={handelFetchAllCategory}
                fetchAllParentCategory={fetchAllParentCategory}
                listCategory={listCategory}
                listParentCategory={listParentCategory}
                actionModalCategory={actionModalCategory}
                dataUpdate={dataUpdate}
            />

            <AdModalDeleteCategory
                isShowModalDelete={isShowModalDelete}
                handleCloseModalDelete={handleCloseModalDelete}
                dataDelete={dataDelete}
                handelFetchAllCategory={handelFetchAllCategory}
                fetchAllParentCategory={fetchAllParentCategory}
            />
        </>
    );
};

export default AdCategory;