import React, {useEffect, useState} from 'react';
import AdModalCategory from "./AdModalCategory";
import "./adCategory.scss";
import {IoAddCircleOutline, IoReload} from "react-icons/io5";
import {getAllCategory} from "../../../services/admin/categoryService";
import {Spin} from "antd";
import {FaLongArrowAltDown, FaLongArrowAltUp} from "react-icons/fa";
import {GrStatusGood} from "react-icons/gr";
import {MdDelete, MdEdit, MdOutlineDangerous} from "react-icons/md";

const AdCategory = () => {

    const [loading, setLoading] = useState(false);
    const [listCategory, setListCategory] = useState([]);

    const [searchKeyword, setSearchKeyword] = useState("");
    const [filteredCategory, setFilteredCategory] = useState([]);

    const [sortKey, setSortKey] = useState('id');
    const [sortOrder, setSortOrder] = useState('asc');

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

    const flattenCategoryTree = (categories, level = 0) => {
        let result = [];
        categories.forEach(category => {
            result.push({...category, level});
            if (category.children && category.children.length > 0) {
                result = result.concat(flattenCategoryTree(category.children, level + 1));
            }
        });
        return result;
    }

    const handelFetchAllCategory = async () => {
        setLoading(true);
        try {
            let res = await getAllCategory();
            if (res && res.EC === 0) {
                const flattenedCategories = flattenCategoryTree(res.DT);
                setListCategory(flattenedCategories);
                setFilteredCategory(flattenedCategories);
            } else {
                console.log("Error: ", res);
            }
        } catch (error) {
            console.log("Error: ", error);
        } finally {
            setLoading(false);
        }
    }

    const handleRefresh = () => {
        setSearchKeyword("");
        setSortKey('id');
        setSortOrder('asc');
        setFilteredCategory([...listCategory]);
    };

    useEffect(() => {
        const fetchData = async () => {
            await handelFetchAllCategory();
        }

        fetchData();
    }, [])

    const [isShowModalCategory, setIsShowModalCategory] = useState(false);
    const handleCloseModalCategory = () => {
        setIsShowModalCategory(false);
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
                                    filteredCategory.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td className="text-center">{index + 1}</td>
                                                <td className="text-center">{item.id}</td>
                                                <td>
                                                    <span>
                                                        {item.level > 0 ? `>>>> ${item.name}` : item.name}
                                                    </span>
                                                </td>
                                                <td className="text-center">
                                                    <img src={`${process.env.REACT_APP_URL_BACKEND}/${item.image}`}
                                                         width={50} height={50} alt={item.image}/>
                                                </td>
                                                <td className="text-center">
                                                    {item.isActive ?
                                                        <GrStatusGood size={25} title={"Trạng thái"}
                                                                      style={{color: "green", cursor: "pointer"}}
                                                        />
                                                        :
                                                        <MdOutlineDangerous size={25} title={"Trạng thái"}
                                                                            style={{color: "red", cursor: "pointer"}}
                                                        />
                                                    }
                                                </td>
                                                <td className="text-center">
                                                    <div className="d-flex justify-content-center gap-2">
                                                        <MdEdit size={25} title={"Chỉnh sửa"}
                                                                style={{color: "orange", cursor: "pointer"}}
                                                        />
                                                        <MdDelete size={25} title={"Xóa"}
                                                                  style={{color: "red", cursor: "pointer"}}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
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
            />
        </>
    );
};

export default AdCategory;