import React from 'react';
import PageHeader from "../pageHeader/PageHeader";

const ShippingPolicy = () => {
    return (
        <div>
            <PageHeader title={"Vận chuyển"} curPage={"Vận chuyển"}/>

            <div className="terms-conditions py-5 px-5"
                 style={{borderTop: "1px solid rgb(197, 197, 197)", borderBottom: "1px solid rgb(197, 197, 197)"}}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <h2 className="text-center text-uppercase mb-4">Vận chuyển</h2>
                            <h6>Thời gian xử lý</h6>
                            <p>Vui lòng cho phép 1 ngày làm việc để xử lý đơn hàng của bạn. Xin lưu ý rằng Thứ Bảy, Chủ Nhật và Ngày lễ chúng tôi không làm việc.</p>
                            <h6>Giao hàng tiêu chuẩn</h6>
                            <p>Đơn hàng của bạn thường sẽ mất trung bình 1-3 ngày làm việc để đến địa chỉ , mặc dù thời gian giao hàng có thể thay đổi, đặc biệt là trong các giai đoạn cao điểm. Xin lưu ý rằng trong một số trường hợp hiếm hoi, thời gian này có thể mất tới 15 ngày làm việc và cho đến khi khung thời gian này hoàn tất, chúng tôi không thể coi là một mặt hàng bị mất.</p>
                            <h6>Giao hàng nhanh</h6>
                            <p>Nếu bạn cần sản phẩm của mình cho một ngày cụ thể (vào cuối tuần, sinh nhật, Giáng sinh, v.v.), chúng tôi đặc biệt khuyên bạn nên chọn chúng tôi để đảm bảo. </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShippingPolicy;