import React, {useState} from 'react';
import PageHeader from "../components/PageHeader.js";
import Data from "../../../products.json";
import ProductCards from "./ProductCards.js";
import Pagination from "./Pagination.js";
import Search from "./Search.js";
import ShopCategory from "./ShopCategory.js";
import PopularPost from "./PopularPost.js";
import Tags from "./Tags.js";

const showResults = "Showing 01 - 12 of 139 Results";

const Shop = () => {

    const [GridList, setGridList] = useState(true);
    const [products, setProducts] = useState(Data);

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
        if (curCategory === "All") {
            setProducts(Data);
            setSelectedCategory("All");
            setCurrentPage(1);
            return;
        }
        const newItem = Data.filter((newVal) => {
            return newVal.category === curCategory;
        })

        setCurrentPage(1);
        setSelectedCategory(curCategory);
        setProducts(newItem);
    }

    return (
        <div>
            <PageHeader title="Our Shop Page" curPage="Shop"/>
            {/*shop page*/}
            <div className="shop-page padding-tb">
                <div className="container-fluid ps-5 pe-5">
                    <div className="row justify-content-center">
                        <div className="col-lg-8 col-12">
                            {/*left side*/}
                            <article>
                                {/*layout and title here*/}
                                <div className="shop-title d-flex flex-wrap justify-content-between">
                                    <p>{showResults}</p>
                                    <div className={`product-view-mode ${GridList ? "gridActive" : "listActive"}`}>
                                        <a className="grid" onClick={() => setGridList(!GridList)}>
                                            <i className="icofont-ghost"></i>
                                        </a>
                                        <a className="list" onClick={() => setGridList(!GridList)}>
                                            <i className="icofont-listine-dots"></i>
                                        </a>
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