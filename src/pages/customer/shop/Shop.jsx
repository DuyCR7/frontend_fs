import React, {useCallback, useEffect, useRef, useState} from 'react';
import PageHeader from "../components/pageHeader/PageHeader.jsx";
import ProductCards from "./productCards/ProductCards.jsx";
import Search from "./search/Search.jsx";
import PopularPost from "./popularPost/PopularPost.jsx";
import ShopCategory from "./shopCategory/ShopCategory";
import ShopSize from "./shopSize/ShopSize";
import ShopColor from "./shopColor/ShopColor";
import ShopTeam from "./shopTeam/ShopTeam.jsx";
import {getAllInfoProduct} from "../../../services/customer/shopService";
import ReactPaginate from "react-paginate";
import {Spin} from "antd";
import {useNavigate, useParams} from "react-router-dom";
import ShopPriceRange from "./shopPriceRange/ShopPriceRange";

const Shop = () => {

    const {team, category} = useParams();
    const navigate = useNavigate();

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

    const [minPrice, setMinPrice] = useState(null);
    const [maxPrice, setMaxPrice] = useState(null);
    const [priceRange, setPriceRange] = useState([null, null]);
    const priceRangeRef = useRef(priceRange);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(4);  // Số sản phẩm trên mỗi trang
    const [totalPages, setTotalPages] = useState(1);
    const [totalRows, setTotalRows] = useState(1);

    const productCardsRef = useRef(null); // Khai báo ref

    const fetchAllInforProduct = useCallback(async (currentPage) => {
        setLoading(true);
        try {
            const filterCategory = selectedCategories.join(',');
            const filterTeam = selectedTeams.join(',');
            const filterSize = selectedSizes.join(',');
            const filterColor = selectedColors.join(',');
            const [minSelectedPrice, maxSelectedPrice] = priceRangeRef.current;

            let res = await getAllInfoProduct(currentPage, limit, filterCategory, filterTeam, filterSize, filterColor, sortOption, team, category, minSelectedPrice, maxSelectedPrice);
            if (res && res.EC === 0) {
                setProducts(res.DT.products.products.data);
                setTotalRows(res.DT.products.totalRows);
                setTotalPages(res.DT.products.totalPages);
                updateMenuItems(res.DT);

                if (res.DT.products.overallPriceRange) {
                    if(minPrice === null || maxPrice === null) {
                        const newMinPrice = res.DT.products.overallPriceRange.minPrice;
                        const newMaxPrice = res.DT.products.overallPriceRange.maxPrice;
                        setMinPrice(newMinPrice);
                        setMaxPrice(newMaxPrice);

                        if (priceRangeRef.current[0] === null || priceRangeRef.current[1] === null) {
                            setPriceRange([newMinPrice, newMaxPrice]);
                            priceRangeRef.current = [newMinPrice, newMaxPrice];
                        }
                    }

                }

                // Nếu trang hiện tại lớn hơn tổng số trang, reset về trang 1
                if (currentPage > res.DT.products.totalPages) {
                    setPage(1);
                } else {
                    setPage(currentPage);
                }
            } else {
                console.log("Error: ", res.EM);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [selectedCategories, selectedTeams, selectedSizes, selectedColors, sortOption, limit, team, category]);

    useEffect(() => {
        fetchAllInforProduct(1);  // Always start from page 1 when filters change
    }, [fetchAllInforProduct]);

    const handlePageClick = async (event) => {
        const selectedPage = event.selected + 1;
        await fetchAllInforProduct(selectedPage);
    };

    const handleSort = (option) => {
        setSortOption(option);
    };

    const handlePriceChange = useCallback(async (newPriceRange) => {
        setPriceRange(newPriceRange);
        priceRangeRef.current = newPriceRange;
        await fetchAllInforProduct(1);
    }, [fetchAllInforProduct]);

    const clearAllFilters = () => {
        setSelectedCategories([]);
        setSelectedTeams([]);
        setSelectedSizes([]);
        setSelectedColors([]);
        setPriceRange([minPrice, maxPrice]);
        priceRangeRef.current = [null, null];
        setSortOption('default');
    };

    const updateMenuItems = (data) => {
        setMenuItems({
            categories: data.updatedCategories.map(cat => ({
                id: cat.id,
                name: cat.name,
                slug: cat.slug,
                productCount: cat.productCount
            })),
            teams: data.updatedTeams.map(team => ({
                id: team.id,
                name: team.name,
                slug: team.slug,
                productCount: team.productCount
            })),
            sizes: data.updatedSizes.map(size => ({id: size.id, code: size.code, productCount: size.productCount})),
            colors: data.updatedColors.map(color => ({
                id: color.id,
                name: color.name,
                productCount: color.productCount
            }))
        });
    };

    // useEffect(() => {
    //     // Temporary variables to hold updated selected values
    //     let updatedSelectedCategories = selectedCategories.filter(cat => menuItems.categories.some(item => item.id === cat));
    //     let updatedSelectedTeams = selectedTeams.filter(team => menuItems.teams.some(item => item.id === team));
    //     let updatedSelectedSizes = selectedSizes.filter(size => menuItems.sizes.some(item => item.id === size));
    //     let updatedSelectedColors = selectedColors.filter(color => menuItems.colors.some(item => item.id === color));
    //
    //     // Only update the state if there's a difference
    //     if (updatedSelectedCategories.length !== selectedCategories.length) {
    //         setSelectedCategories(updatedSelectedCategories);
    //     }
    //     if (updatedSelectedTeams.length !== selectedTeams.length) {
    //         setSelectedTeams(updatedSelectedTeams);
    //     }
    //     if (updatedSelectedSizes.length !== selectedSizes.length) {
    //         setSelectedSizes(updatedSelectedSizes);
    //     }
    //     if (updatedSelectedColors.length !== selectedColors.length) {
    //         setSelectedColors(updatedSelectedColors);
    //     }
    // }, [menuItems]);

    // Kiểm tra có bộ lọc nào đang được áp dụng
    const hasActiveFilters = () => {
        return (
            selectedCategories.length > 0 ||
            selectedTeams.length > 0 ||
            selectedSizes.length > 0 ||
            selectedColors.length > 0 ||
            (priceRange[0] !== minPrice || priceRange[1] !== maxPrice)
        );
    };

    const getDisplayedProductsCount = () => {
        const start = (page - 1) * limit + 1;
        const end = Math.min(page * limit, totalRows);
        return `${start} - ${end}`;
    };

    useEffect(() => {
        if (productCardsRef.current && !loading) {
            productCardsRef.current.scrollIntoView({behavior: 'smooth', block: 'start'});
        }
    }, [products, loading]);
    return (
        <div>
            <PageHeader title="Cửa hàng" curPage="Cửa hàng"/>
            {/*shop page*/}
            <div ref={productCardsRef} className="shop-page padding-tb">
                <div className="container-fluid ps-5 pe-5">
                    <div className="row justify-content-center">
                        <div className="col-lg-8 col-12">
                            {/*left side*/}
                            <article>
                                {/*layout and title here*/}
                                <div className="shop-title d-flex flex-wrap justify-content-between align-items-center">
                                    <p className="mb-3 mb-sm-0">Hiển thị {getDisplayedProductsCount()} / {totalRows} sản
                                        phẩm</p>
                                    <div className="d-flex align-items-center">
                                        <select
                                            className="form-select me-3 fs-5"
                                            value={sortOption}
                                            onChange={(e) => handleSort(e.target.value)}
                                        >
                                            <option value="default">Sắp xếp</option>
                                            <option value="price-asc">Giá: Thấp đến Cao</option>
                                            <option value="price-desc">Giá: Cao đến Thấp</option>
                                            <option value="name-asc">Tên: A đến Z</option>
                                            <option value="name-desc">Tên: Z đến A</option>
                                        </select>
                                        <div
                                            className={`d-flex me-3 product-view-mode ${GridList ? "gridActive" : "listActive"}`}>
                                            <a className="grid" onClick={() => setGridList(!GridList)}>
                                                <i className="icofont-ghost"></i>
                                            </a>
                                            <a className="list" onClick={() => setGridList(!GridList)}>
                                                <i className="icofont-listine-dots"></i>
                                            </a>
                                        </div>
                                        {hasActiveFilters() && (
                                            <div>
                                                <button onClick={clearAllFilters}
                                                        className="btn btn-outline-danger"
                                                        style={{width: "max-content"}}>
                                                    Xóa bộ lọc
                                                </button>
                                            </div>
                                        )}
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
                                                                <div
                                                                    className="col d-flex justify-content-center align-items-center">
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

                                {
                                    products.length > 0 && (
                                        <div className="mt-3 mt-md-0" style={{
                                            boxShadow: "0 0 10px rgba(136, 136, 136, .3)",
                                            padding: "15px",
                                            marginBottom: "30px"
                                        }}>
                                            <ShopTeam
                                                filterItem={setSelectedTeams}
                                                menuItems={menuItems.teams}
                                                selectedItems={selectedTeams}
                                                loading={loading}
                                            />

                                            <ShopCategory
                                                filterItem={setSelectedCategories}
                                                menuItems={menuItems.categories}
                                                selectedItems={selectedCategories}
                                                loading={loading}
                                            />

                                            <ShopSize
                                                filterItem={setSelectedSizes}
                                                menuItems={menuItems.sizes}
                                                selectedItems={selectedSizes}
                                                loading={loading}
                                            />

                                            <ShopColor
                                                filterItem={setSelectedColors}
                                                menuItems={menuItems.colors}
                                                selectedItems={selectedColors}
                                                loading={loading}
                                            />

                                            <ShopPriceRange
                                                onPriceChange={handlePriceChange}
                                                minPrice={minPrice}
                                                maxPrice={maxPrice}
                                                currentRange={priceRange}
                                            />
                                        </div>
                                    )
                                }
                                <PopularPost/>
                            </aside>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;