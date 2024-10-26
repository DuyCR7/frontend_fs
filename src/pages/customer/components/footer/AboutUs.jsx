import React from 'react';
import PageHeader from "../pageHeader/PageHeader";

const AboutUs = () => {
    return (
        <div>
            <PageHeader title={"Về chúng tôi"} curPage={"Về chúng tôi"}/>

            <div className="terms-conditions py-5 px-5"
                 style={{borderTop: "1px solid rgb(197, 197, 197)", borderBottom: "1px solid rgb(197, 197, 197)"}}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <h2 className="text-center text-uppercase mb-4">Về chúng tôi</h2>
                            <h6>Who?</h6>
                            <p>Một doanh nghiệp độc lập với nhiều năm kinh nghiệm hợp tác chặt chẽ với các câu lạc bộ bóng đá lớn nhất và các đối tác kinh doanh được cấp phép của họ trong các lĩnh vực quần áo thời trang, đồ mặc nhà, phụ kiện, quà tặng và đồ lưu niệm.</p>
                            <h6>What?</h6>
                            <p>Liverpool, Manchester United, Arsenal, Tottenham, Chelsea, West Ham, Manchester City, Celtic, Rangers, Barcelona và Real Madrid là một số câu lạc bộ mà chúng tôi đại diện. Không quên các dòng chính thức từ Anh, Scotland, Wales và Bắc Ireland.</p>
                            <h6>How?</h6>
                            <p>Các sản phẩm độc quyền và giá cả không thể cạnh tranh hơn của chúng tôi có được thông qua mạng lưới nhà cung cấp lâu đời trong ngành bóng đá</p>
                            <h6>When?</h6>
                            <p>Chúng tôi sẽ xử lý đơn hàng của bạn trong vòng một ngày làm việc và cung cấp tùy chọn giao hàng nhanh để bạn không bỏ lỡ bất kỳ đơn hàng nào.</p>
                            <h6>Where?</h6>
                            <p>Trực tiếp từ kho hàng của chúng tôi tại trung tâm bóng đá đến bạn, bất kể bạn ở đâu trên thế giới.</p>
                            <h6>Why?</h6>
                            <p>Niềm đam mê của chúng tôi là phát triển các sản phẩm bóng đá chất lượng cao với mức giá trung thực và phải chăng dành cho những người hâm mộ bóng đá có cùng sở thích. </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;