import RevenueChart from "./revenue/RevenueChart";
import BestWishlist from "./bestWishlist/BestWishlist";
import OrderChart from "./order/OrderChart";
import AvailableProduct from "./availableProduct/AvailableProduct";
import StatisticSome from "./statisticSome/StatisticSome";
import BestSlowSelling from "./bestSlowSelling/BestSlowSelling";

const AdDashboard = (props) => {
    return (
        <>
            <div className="page-inner">
                <StatisticSome />

                <div className="row mt-4">
                    <div className="col-md-6 mb-4">
                        <div className="row">
                            <div className="col-12">
                                <RevenueChart />
                            </div>
                            <div className="col-12">
                                <BestWishlist />
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6 mb-4">
                        <BestSlowSelling />
                    </div>

                    {/*<div className="col-md-6 mb-4">*/}
                    {/*    <BestWishlist />*/}
                    {/*</div>*/}

                    <div className="col-12 mb-4">
                        <OrderChart />
                    </div>

                    <div className="col-12 mb-4">
                        <AvailableProduct />
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdDashboard;