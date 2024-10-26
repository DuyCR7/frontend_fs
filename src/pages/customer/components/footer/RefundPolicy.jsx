import React from 'react';
import PageHeader from "../pageHeader/PageHeader";

const RefundPolicy = () => {
    return (
        <div>
            <PageHeader title={"Chính sách hoàn tiền"} curPage={"Chính sách hoàn tiền"}/>

            <div className="terms-conditions py-5 px-5"
                 style={{borderTop: "1px solid rgb(197, 197, 197)", borderBottom: "1px solid rgb(197, 197, 197)"}}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <h2 className="text-center text-uppercase mb-4">Chính sách hoàn tiền</h2>
                            <p>Chính sách trả hàng
                                của chúng tôi kéo dài 30 ngày. Nếu đã quá 30 ngày kể từ ngày bạn mua hàng, rất tiếc
                                chúng tôi không thể hoàn lại tiền hoặc đổi hàng cho bạn.</p>
                            <br/>
                            <p>Để đủ điều kiện trả lại, sản phẩm của bạn phải chưa qua sử dụng và ở cùng tình trạng khi
                                bạn nhận được. Sản phẩm cũng phải còn trong bao bì gốc.</p>
                            <br/>
                            <p>Một số loại hàng hóa được miễn trả lại. Hàng hóa dễ hỏng như thực phẩm, hoa, báo hoặc tạp
                                chí không được trả lại. Chúng tôi cũng không chấp nhận các sản phẩm là hàng hóa thân mật
                                hoặc vệ sinh, vật liệu nguy hiểm hoặc chất lỏng hoặc khí dễ cháy.</p>
                            <br/>
                            <p>Các mặt hàng không được trả lại bổ sung:</p>
                            <p>Thẻ quà tặng</p>
                            <p>Sản phẩm phần mềm có thể tải xuống</p>
                            <p>Một số mặt hàng chăm sóc sức khỏe và cá nhân</p>
                            <br/>
                            <p>Để hoàn tất việc trả hàng, chúng tôi yêu cầu biên lai hoặc bằng chứng mua hàng.</p>
                            <br/>
                            <p>Vui lòng không gửi trả sản phẩm bạn đã mua cho nhà sản xuất.</p>
                            <br/>
                            <p>Hoàn tiền (nếu có)</p>
                            <p>Sau khi nhận và kiểm tra hàng trả lại của bạn, chúng tôi sẽ gửi cho bạn một email để
                                thông báo rằng chúng tôi đã nhận được hàng trả lại của bạn. Chúng tôi cũng sẽ thông báo
                                cho bạn về việc chấp thuận hoặc từ chối hoàn tiền của bạn.</p>
                            <p>Nếu bạn được chấp thuận, thì khoản hoàn tiền của bạn sẽ được xử lý và khoản tín dụng sẽ
                                tự động được áp dụng vào thẻ tín dụng hoặc phương thức thanh toán ban đầu của bạn, trong
                                một số ngày nhất định.</p>
                            <br/>
                            <p>Đổi hàng (nếu có)</p>
                            <p>Chúng tôi chỉ thay thế sản phẩm nếu sản phẩm bị lỗi hoặc hư hỏng. Nếu bạn cần đổi sản
                                phẩm tương tự, hãy gửi email cho chúng tôi theo địa chỉ anhduy0317@gmail.com và
                                gửi sản phẩm của bạn đến:</p>
                            <p className="fw-bold">Ngõ 389 phố Vọng, Hai Bà Trưng, Hà Nội</p>
                            <p className="fw-bold">+84 868 839 613</p>
                            <p className="fw-bold">anhduy0317@gmail.com</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RefundPolicy;