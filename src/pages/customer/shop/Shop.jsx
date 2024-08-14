import React, {useCallback, useEffect, useState} from 'react';
import PageHeader from "../components/pageHeader/PageHeader.jsx";
import ProductCards from "./productCards/ProductCards.jsx";
import Search from "./search/Search.jsx";
import PopularPost from "./popularPost/PopularPost.jsx";
import Tags from "./tags/Tags.jsx";
import ShopCategory from "./shopCategory/ShopCategory";
import ShopSize from "./shopSize/ShopSize";
import ShopColor from "./shopColor/ShopColor";
import ShopTeam from "./shopTeam/ShopTeam.jsx";
import {getAllInfoProduct} from "../../../services/customer/shopService";
import ReactPaginate from "react-paginate";
import {Spin} from "antd";

const Shop = () => {

    const [loading, setLoading] = useState(false);
    const [GridList, setGridList] = useState(true);
    const [products, setProducts] = useState([]);
    const [sortOption, setSortOption] = useState('default');

    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedTeams, setSelectedTeams] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);

    const [menuItems, setMenuItems] = useState({
        categories: [],
        teams: [],
        sizes: [],
        colors: []
    });

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(3);  // Số sản phẩm trên mỗi trang
    const [totalPages, setTotalPages] = useState(1);
    const [totalRows, setTotalRows] = useState(1);

    const fetchAllInforProduct = useCallback(async (currentPage) => {
        setLoading(true);
        try {
            const filterCategory = selectedCategories.join(',');
            const filterTeam = selectedTeams.join(',');
            const filterSize = selectedSizes.join(',');
            const filterColor = selectedColors.join(',');

            let res = await getAllInfoProduct(currentPage, limit, filterCategory, filterTeam, filterSize, filterColor, sortOption);
            if (res && res.EC === 0) {
                setProducts(res.DT.products.products.data);
                setTotalRows(res.DT.products.totalRows);
                setTotalPages(res.DT.products.totalPages);
                updateMenuItems(res.DT);
                // Nếu trang hiện tại lớn hơn tổng số trang, reset về trang 1
                if (currentPage > res.DT.products.totalPages) {
                    setPage(1);
                } else {
                    setPage(currentPage);
                }
            } else {
                console.log("Error: ", res);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [selectedCategories, selectedTeams, selectedSizes, selectedColors, sortOption, limit]);

    useEffect(() => {
        fetchAllInforProduct(1);  // Always start from page 1 when filters change
    }, [fetchAllInforProduct]);

    const handlePageClick = (event) => {
        const selectedPage = event.selected + 1;
        fetchAllInforProduct(selectedPage);
    };

    const handleSort = (option) => {
        setSortOption(option);
    };

    const clearAllFilters = () => {
        setSelectedCategories([]);
        setSelectedTeams([]);
        setSelectedSizes([]);
        setSelectedColors([]);
        setSortOption('default');
    };

    const updateMenuItems = (data) => {
        setMenuItems({
            categories: data.updatedCategories.map(cat => ({ id: cat.id, name: cat.name })),
            teams: data.updatedTeams.map(team => ({ id: team.id, name: team.name })),
            sizes: data.updatedSizes.map(size => ({ id: size.id, code: size.code })),
            colors: data.updatedColors.map(color => ({ id: color.id, name: color.name}))
        });
    };

    useEffect(() => {
        // Temporary variables to hold updated selected values
        let updatedSelectedCategories = selectedCategories.filter(cat => menuItems.categories.some(item => item.id === cat));
        let updatedSelectedTeams = selectedTeams.filter(team => menuItems.teams.some(item => item.id === team));
        let updatedSelectedSizes = selectedSizes.filter(size => menuItems.sizes.some(item => item.id === size));
        let updatedSelectedColors = selectedColors.filter(color => menuItems.colors.some(item => item.id === color));

        // Only update the state if there's a difference
        if (updatedSelectedCategories.length !== selectedCategories.length) {
            setSelectedCategories(updatedSelectedCategories);
        }
        if (updatedSelectedTeams.length !== selectedTeams.length) {
            setSelectedTeams(updatedSelectedTeams);
        }
        if (updatedSelectedSizes.length !== selectedSizes.length) {
            setSelectedSizes(updatedSelectedSizes);
        }
        if (updatedSelectedColors.length !== selectedColors.length) {
            setSelectedColors(updatedSelectedColors);
        }
    }, [menuItems]);

    // Kiểm tra có bộ lọc nào đang được áp dụng
    const hasActiveFilters = () => {
        return (
            selectedCategories.length > 0 ||
            selectedTeams.length > 0 ||
            selectedSizes.length > 0 ||
            selectedColors.length > 0
        );
    };

    const getDisplayedProductsCount = () => {
        const start = (page - 1) * limit + 1;
        const end = Math.min(page * limit, totalRows);
        return `${start} - ${end}`;
    };

    return (
        <div>
            <PageHeader title="Cửa hàng" curPage="Cửa hàng"/>
            {/*shop page*/}
            <div className="shop-page padding-tb">
                <div className="container-fluid ps-5 pe-5">
                    <div className="row justify-content-center">
                        <div className="col-lg-8 col-12">
                            {/*left side*/}
                            <article>
                                {/*layout and title here*/}
                                <div className="shop-title d-flex flex-wrap justify-content-between">
                                    <p className="mb-3 mb-md-0">Hiển thị {getDisplayedProductsCount()} / {totalRows} sản phẩm</p>
                                    <div className="d-flex align-items-center">
                                        <select
                                            className="form-select me-5"
                                            value={sortOption}
                                            onChange={(e) => handleSort(e.target.value)}
                                        >
                                            <option value="default">Sắp xếp</option>
                                            <option value="price-asc">Giá: Thấp đến Cao</option>
                                            <option value="price-desc">Giá: Cao đến Thấp</option>
                                            <option value="name-asc">Tên: A đến Z</option>
                                            <option value="name-desc">Tên: Z đến A</option>
                                        </select>
                                        <div className={`d-flex product-view-mode ${GridList ? "gridActive" : "listActive"}`}>
                                            <a className="grid" onClick={() => setGridList(!GridList)}>
                                                <i className="icofont-ghost"></i>
                                            </a>
                                            <a className="list" onClick={() => setGridList(!GridList)}>
                                                <i className="icofont-listine-dots"></i>
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/*product cards*/}
                                {
                                    loading ? (
                                        <div className={"d-flex justify-content-center align-items-center"}>
                                            <Spin size={"large"}/>
                                        </div>
                                    ) : (
                                        <div>
                                            {
                                                products && products.length > 0 ? (
                                                    <>
                                                        <ProductCards GridList={GridList} products={products}/>

                                                        {totalPages > 0 &&
                                                            <div className="shop-footer mt-3 row">
                                                                <div className="col d-flex justify-content-center align-items-center">
                                                                    <div className="me-3">
                                                                        <ReactPaginate
                                                                            nextLabel="Next"
                                                                            onPageChange={handlePageClick}
                                                                            pageRangeDisplayed={3}
                                                                            marginPagesDisplayed={2}
                                                                            pageCount={totalPages}
                                                                            previousLabel="Prev"
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
                                                                            forcePage={page - 1}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        }
                                                    </>
                                                ) : (
                                                    <div className="text-center mt-5">
                                                        <h3>Không tìm thấy sản phẩm nào phù hợp!</h3>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    )
                                }

                            </article>
                        </div>
                        <div className="col-lg-4 col-12">
                            {/*right side*/}
                            <aside>
                                {/*<Search products={products} GridList={GridList}/>*/}

                                {hasActiveFilters() && (
                                    <button onClick={clearAllFilters} className="btn btn-outline-danger mb-4">
                                        Xóa bộ lọc
                                    </button>
                                )}

                                <ShopTeam
                                    filterItem={setSelectedTeams}
                                    menuItems={menuItems.teams}
                                    selectedItems={selectedTeams}
                                />
                                <ShopCategory
                                    filterItem={setSelectedCategories}
                                    menuItems={menuItems.categories}
                                    selectedItems={selectedCategories}
                                />
                                <ShopSize
                                    filterItem={setSelectedSizes}
                                    menuItems={menuItems.sizes}
                                    selectedItems={selectedSizes}
                                />
                                <ShopColor
                                    filterItem={setSelectedColors}
                                    menuItems={menuItems.colors}
                                    selectedItems={selectedColors}
                                />
                                <PopularPost />
                                <Tags />
                            </aside>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;