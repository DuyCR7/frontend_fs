import React from 'react';
import PageHeader from "../pageHeader/PageHeader";

const TermsConditions = () => {
    return (
        <div>
            <PageHeader title={"Điều khoản và điều kiện"} curPage={"Điều khoản và điều kiện"}/>

            <div className="terms-conditions py-5 px-5"
                 style={{borderTop: "1px solid rgb(197, 197, 197)", borderBottom: "1px solid rgb(197, 197, 197)"}}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <h2 className="text-center text-uppercase mb-4">Điều khoản và điều kiện</h2>
                            <h5>Điều khoản và điều kiện</h5>
                            <hr/>
                            <p className="text-uppercase">TỔNG QUAN</p>
                            <p>Trang web này được điều hành bởi Senven Shop. Trong toàn bộ trang web, các thuật ngữ “chúng tôi”, “của chúng tôi” và “chúng tôi” đề cập đến Senven Shop. Senven Shop cung cấp trang web này, bao gồm tất cả thông tin, công cụ và dịch vụ có sẵn từ trang web này cho bạn, người dùng, với điều kiện bạn chấp nhận tất cả các điều khoản, điều kiện, chính sách và thông báo được nêu tại đây.</p>
                            <p>Bằng cách truy cập trang web của chúng tôi và/hoặc mua thứ gì đó từ chúng tôi, bạn tham gia vào “Dịch vụ” của chúng tôi và đồng ý bị ràng buộc bởi các điều khoản và điều kiện sau đây (“Điều khoản dịch vụ”, “Điều khoản”), bao gồm các điều khoản và điều kiện và chính sách bổ sung được tham chiếu tại đây và/hoặc có sẵn qua siêu liên kết. Các Điều khoản dịch vụ này áp dụng cho tất cả người dùng của trang web, bao gồm nhưng không giới hạn người dùng là trình duyệt, nhà cung cấp, khách hàng, thương gia và/hoặc người đóng góp nội dung.</p>
                            <p>Vui lòng đọc kỹ các Điều khoản dịch vụ này trước khi truy cập hoặc sử dụng trang web của chúng tôi. Bằng cách truy cập hoặc sử dụng bất kỳ phần nào của trang web, bạn đồng ý bị ràng buộc bởi các Điều khoản dịch vụ này. Nếu bạn không đồng ý với tất cả các điều khoản và điều kiện của thỏa thuận này, thì bạn không được phép truy cập trang web hoặc sử dụng bất kỳ dịch vụ nào. Nếu Điều khoản dịch vụ này được coi là một lời đề nghị, thì việc chấp nhận được giới hạn rõ ràng trong Điều khoản dịch vụ này.</p>
                            <p>Bất kỳ tính năng hoặc công cụ mới nào được thêm vào cửa hàng hiện tại cũng phải tuân theo Điều khoản dịch vụ. Bạn có thể xem lại phiên bản mới nhất của Điều khoản dịch vụ bất kỳ lúc nào trên trang này. Chúng tôi có quyền cập nhật, thay đổi hoặc thay thế bất kỳ phần nào của Điều khoản dịch vụ này bằng cách đăng các bản cập nhật và/hoặc thay đổi lên trang web của chúng tôi. Bạn có trách nhiệm kiểm tra trang này thường xuyên để biết các thay đổi. Việc bạn tiếp tục sử dụng hoặc truy cập trang web sau khi đăng bất kỳ thay đổi nào cấu thành sự chấp nhận những thay đổi đó.</p>
                            <p>Cửa hàng của chúng tôi được lưu trữ trên Shopify Inc. Họ cung cấp cho chúng tôi nền tảng thương mại điện tử trực tuyến cho phép chúng tôi bán sản phẩm và dịch vụ của mình cho bạn.</p>

                            <p className="text-uppercase">PHẦN 1 - ĐIỀU KHOẢN CỦA CỬA HÀNG TRỰC TUYẾN</p>
                            <p>Bằng cách đồng ý với Điều khoản dịch vụ này, bạn tuyên bố rằng bạn ít nhất đã đủ tuổi thành niên tại tiểu bang hoặc tỉnh nơi cư trú của mình hoặc bạn đã đủ tuổi thành niên tại tiểu bang hoặc tỉnh nơi cư trú của mình và bạn đã đồng ý cho phép bất kỳ người phụ thuộc vị thành niên nào của bạn sử dụng trang web này.</p>
                            <p>Bạn không được sử dụng sản phẩm của chúng tôi cho bất kỳ mục đích bất hợp pháp hoặc trái phép nào, cũng như không được vi phạm bất kỳ luật nào trong phạm vi quyền hạn của bạn (bao gồm nhưng không giới hạn ở luật bản quyền) khi sử dụng Dịch vụ.</p>
                            <p>Bạn không được truyền bất kỳ sâu, vi-rút hoặc bất kỳ mã nào có tính chất phá hoại.</p>
                            <p>Vi phạm hoặc vi phạm bất kỳ Điều khoản nào sẽ dẫn đến việc chấm dứt ngay lập tức Dịch vụ của bạn.</p>

                            <p className="text-uppercase">PHẦN 2 - ĐIỀU KIỆN CHUNG</p>
                            <p>Chúng tôi có quyền từ chối cung cấp dịch vụ cho bất kỳ ai vì bất kỳ lý do gì vào bất kỳ lúc nào.</p>
                            <p>Bạn hiểu rằng nội dung của bạn (không bao gồm thông tin thẻ tín dụng) có thể được truyền không được mã hóa và liên quan đến (a) truyền qua nhiều mạng khác nhau; và (b) thay đổi để tuân thủ và thích ứng với các yêu cầu kỹ thuật của mạng hoặc thiết bị kết nối. Thông tin thẻ tín dụng luôn được mã hóa trong quá trình truyền qua mạng.</p>
                            <p>Bạn đồng ý không sao chép, sao chép, sao chép, bán, bán lại hoặc khai thác bất kỳ phần nào của Dịch vụ, việc sử dụng Dịch vụ hoặc quyền truy cập vào Dịch vụ hoặc bất kỳ thông tin liên hệ nào trên trang web mà dịch vụ được cung cấp mà không có sự cho phép rõ ràng bằng văn bản của chúng tôi.</p>
                            <p>Tiêu đề được sử dụng trong thỏa thuận này chỉ được đưa vào để thuận tiện và sẽ không giới hạn hoặc ảnh hưởng đến các Điều khoản này.</p>

                            <p className="text-uppercase">PHẦN 3 - TÍNH CHÍNH XÁC, ĐẦY ĐỦ VÀ KỊP THỜI CỦA THÔNG TIN</p>

                            <p>Chúng tôi không chịu trách nhiệm nếu thông tin được cung cấp trên trang web này không chính xác, đầy đủ hoặc không cập nhật. Tài liệu trên trang web này chỉ được cung cấp để cung cấp thông tin chung và không nên dựa vào hoặc sử dụng làm cơ sở duy nhất để đưa ra quyết định mà không tham khảo các nguồn thông tin chính, chính xác hơn, đầy đủ hơn hoặc kịp thời hơn. Bất kỳ sự tin cậy nào vào tài liệu trên trang web này đều do bạn tự chịu rủi ro.</p>
                            <p>Trang web này có thể chứa một số thông tin lịch sử. Thông tin lịch sử không nhất thiết phải cập nhật và chỉ được cung cấp để bạn tham khảo. Chúng tôi có quyền sửa đổi nội dung của trang web này bất kỳ lúc nào, nhưng chúng tôi không có nghĩa vụ phải cập nhật bất kỳ thông tin nào trên trang web của mình. Bạn đồng ý rằng bạn có trách nhiệm theo dõi các thay đổi đối với trang web của chúng tôi.</p>

                            <p className="text-uppercase">PHẦN 4 - SỬA ĐỔI DỊCH VỤ VÀ GIÁ</p>

                            <>Giá cho các sản phẩm của chúng tôi có thể thay đổi mà không cần thông báo trước.</>
                            <p>Chúng tôi có quyền sửa đổi hoặc ngừng Dịch vụ (hoặc bất kỳ phần hoặc nội dung nào của Dịch vụ) bất kỳ lúc nào mà không cần thông báo trước.</p>
                            <p>Chúng tôi sẽ không chịu trách nhiệm với bạn hoặc bất kỳ bên thứ ba nào về bất kỳ sửa đổi, thay đổi giá, tạm ngừng hoặc ngừng Dịch vụ nào.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsConditions;