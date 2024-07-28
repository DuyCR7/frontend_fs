import React, {useState} from 'react';
import PageHeader from "../components/pageHeader/PageHeader.jsx";
import Data from "../../../products.json";
import ProductCards from "./productCards/ProductCards.jsx";
import Pagination from "./pagination/Pagination.jsx";
import Search from "./search/Search.jsx";
import ShopCategory from "./shopCategory/ShopCategory.jsx";
import PopularPost from "./popularPost/PopularPost.jsx";
import Tags from "./tags/Tags.jsx";
import ShopCollection from "./shopCollection/ShopCollection";
import ShopSize from "./shopSize/ShopSize";
import ShopColor from "./shopColor/ShopColor";

const showResults = "Hiển thị 01 - 12 trong 139 kết quả";

const Shop = () => {

    const [GridList, setGridList] = useState(true);
    const [products, setProducts] = useState(Data);
    const [sortOption, setSortOption] = useState('default');

    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    // function to change the current page
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    }

    // filter products by category
    const [selectedCategory, setSelectedCategory] = useState("All");
    const menuItems = [...new Set(Data.map((Val) => Val.category))];

    const filterItem = (curCategory) => {
        let filteredProducts;
        if (curCategory === "All") {
            filteredProducts = Data;
        } else {
            filteredProducts = Data.filter((newVal) => newVal.category === curCategory);
        }

        setCurrentPage(1);
        setSelectedCategory(curCategory);
        handleSort(sortOption, filteredProducts);
    }

    const handleSort = (option, items = products) => {
        setSortOption(option);
        let sortedProducts = [...items];
        if (option === 'price-asc') {
            sortedProducts.sort((a, b) => a.price - b.price);
        } else if (option === 'price-desc') {
            sortedProducts.sort((a, b) => b.price - a.price);
        } else if (option === 'name-asc') {
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        } else if (option === 'name-desc') {
            sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
        }
        setProducts(sortedProducts);
    }

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
                                    <p className="mb-3 mb-md-0">{showResults}</p>
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
                                            <option value="name-desc">Têb: Z đến A</option>
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
                                <div>
                                    <ProductCards GridList={GridList} products={currentProducts}/>
                                </div>

                                <Pagination
                                    productsPerPage={productsPerPage}
                                    totalProducts={products.length}
                                    activePage={currentPage}
                                    paginate={paginate}
                                />
                            </article>
                        </div>
                        <div className="col-lg-4 col-12">
                            {/*right side*/}
                            <aside>
                                <Search products={products} GridList={GridList}/>
                                <ShopCategory
                                    filterItem={filterItem}
                                    setItem={setProducts}
                                    menuItems={menuItems}
                                    selectedCategory={selectedCategory}
                                    setProducts={setProducts}
                                />
                                <ShopCollection
                                    filterItem={filterItem}
                                    setItem={setProducts}
                                    menuItems={menuItems}
                                    selectedCategory={selectedCategory}
                                    setProducts={setProducts}
                                />
                                <ShopSize
                                    filterItem={filterItem}
                                    setItem={setProducts}
                                    menuItems={menuItems}
                                    selectedCategory={selectedCategory}
                                    setProducts={setProducts}
                                />
                                <ShopColor
                                    filterItem={filterItem}
                                    setItem={setProducts}
                                    menuItems={menuItems}
                                    selectedCategory={selectedCategory}
                                    setProducts={setProducts}
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