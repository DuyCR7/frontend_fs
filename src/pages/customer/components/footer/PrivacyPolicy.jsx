import React from 'react';
import PageHeader from "../pageHeader/PageHeader";

const PrivacyPolicy = () => {
    return (
        <div>
            <PageHeader title={"Chính sách bảo mật"} curPage={"Chính sách bảo mật"}/>

            <div className="terms-conditions py-5 px-5"
                 style={{borderTop: "1px solid rgb(197, 197, 197)", borderBottom: "1px solid rgb(197, 197, 197)"}}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <h2 className="text-center text-uppercase mb-4">Chính sách bảo mật</h2>
                            <p>Chúng tôi, Seven Shop, quan tâm đến khách hàng của mình và biết rằng quyền riêng tư của bạn rất quan trọng đối với bạn. Thông báo về quyền riêng tư này là cách chúng tôi cho bạn biết cách chúng tôi thu thập thông tin của bạn, lý do chúng tôi cần thông tin đó, cách chúng tôi sử dụng thông tin đó và cách chúng tôi đảm bảo thông tin đó được lưu giữ an toàn và không lâu hơn mức cần thiết. Theo Thông báo về quyền riêng tư này, Global Football Company Ltd là đơn vị kiểm soát dữ liệu đối với dữ liệu được thu thập trên trang web của chúng tôi  https://www.sevenshop.com  và thông tin bạn chia sẻ với đại diện tổng đài của chúng tôi, qua email hoặc thư. </p>
                            <h6 className="text-uppercase fw-bold">CÁCH CHÚNG TÔI SỬ DỤNG THÔNG TIN BẠN CUNG CẤP CHO CHÚNG TÔI VÀ LÝ DO CHÚNG TÔI THU THẬP THÔNG TIN ĐÓ</h6>
                            <p>Chấp nhận thanh toán, thực hiện đơn hàng, hoàn tiền</p>
                            <ul>
                                <li>Tên và thông tin liên lạc của bạn là bắt buộc để chúng tôi thực hiện hợp đồng giao đơn hàng cho bạn</li>
                                <li>Tên và thông tin liên lạc của bạn là bắt buộc để chúng tôi thực hiện hợp đồng giao đơn hàng cho bạn</li>
                            </ul>
                            <p>Gửi cho bạn thông tin tài khoản</p>
                            <ul>
                                <li>Chúng tôi sử dụng tên và thông tin liên lạc của bạn để gửi cho bạn thông tin tài khoản quan trọng (ví dụ: xác nhận đơn hàng, thông báo, thay đổi cài đặt tài khoản và thông báo về các điều khoản và chính sách.</li>
                            </ul>
                            <p>Để cung cấp trải nghiệm người dùng được cải thiện</p>
                            <ul>
                                <li>Thông tin liên lạc, lịch sử liên lạc và bất kỳ thông tin hồ sơ bổ sung nào của bạn giúp chúng tôi vận hành, bảo vệ, cải thiện và tối ưu hóa Trang web và Ứng dụng cũng như cá nhân hóa và tùy chỉnh trải nghiệm của bạn.</li>
                                <li>Lý do pháp lý của chúng tôi cho việc này là vì lợi ích hợp pháp của chúng tôi.</li>
                            </ul>
                            <p>Phân tích, đào tạo và đảm bảo chất lượng</p>
                            <ul>
                                <li>Thông tin bạn cung cấp có thể được sử dụng để đào tạo nhân viên, cải thiện dịch vụ, phân tích nội bộ và theo dõi hiệu suất.</li>
                                <li>Lý do pháp lý để chúng tôi thu thập thông tin này là vì lợi ích hợp pháp của chúng tôi trong việc phát hiện và ngăn chặn gian lận cũng như cải thiện các dịch vụ và ưu đãi của mình.</li>
                            </ul>
                            <p>Truyền thông, tiếp thị và quảng cáo</p>
                            <ul>
                                <li>Dữ liệu cá nhân có thể được sử dụng để truyền tải và cá nhân hóa thông tin liên lạc của chúng tôi với bạn hoặc để quản lý các chương trình giới thiệu, phần thưởng, khảo sát, rút ​​thăm trúng thưởng, cuộc thi hoặc các hoạt động khuyến mại khác.</li>
                                <li>Trong trường hợp việc xử lý của chúng tôi thuộc phạm vi PECR, chúng tôi sẽ xin sự đồng ý của bạn.</li>
                            </ul>
                            <p> Khi chúng tôi thu thập thông tin cho mục đích phân tích, tiếp thị và hiệu suất, thông tin này được thu thập bằng cookie trên trang web của chúng tôi. Bạn có cơ hội từ chối cung cấp/cho phép chúng tôi sử dụng thông tin này.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;