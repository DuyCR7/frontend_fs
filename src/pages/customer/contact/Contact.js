import React from 'react';
import PageHeader from "../components/pageHeader/PageHeader.js";
import GoogleMap from "../components/googleMap/GoogleMap.js";

const subTitle = "Hãy liên lạc với chúng tôi";
const title = "Chúng tôi luôn mong muốn được lắng nghe từ bạn!";
const conSubTitle = "Hãy liên lạc với chúng tôi";
const conTitle = "Điền vào biểu mẫu bên dưới để chúng tôi có thể hiểu rõ hơn về bạn và nhu cầu của bạn.";
const btnText = "Gửi";

const contactList = [{
    icon: "address-book",
    title: "Địa chỉ",
    desc: "Ngõ 389 phố Vọng, Hai Bà Trưng, Hà Nội",
}, {
    icon: "phone",
    title: "Điện thoại",
    desc: "+84 868 839 613",
}, {
    icon: "email",
    title: "Email",
    desc: "anhduy0317@gmail.com",
}, {
    icon: "web",
    title: "Website",
    desc: "www.cr7shop.com",
},];

const Contact = () => {
    return (
        <div>
            <PageHeader title={"Liên hệ"} curPage={"Liên hệ"}/>
            <div className="map-address-section padding-tb section-bg">
                <div className="container-fluid ps-5 pe-5">
                    <div className="section-header text-center">
                        <span className="subtitle">{subTitle}</span>
                        <h2 className="title">{title}</h2>
                    </div>

                    <div className="section-wrapper">
                        <div className="row flex-row-reverse">
                            <div className="col-xl-4 col-lg-5 col-12">
                                <div className="contact-wrapper">
                                    {
                                        contactList.map((item, index) => {
                                            return (
                                                <div key={index} className="contact-item">
                                                    <div className="contact-thumb">
                                                        <i className={`icofont-${item.icon}`} style={{ fontSize: "28px" }}></i>
                                                    </div>
                                                    <div className="contact-content">
                                                        <h6 className="title">{item.title}</h6>
                                                        <p>{item.desc}</p>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>

                            {/*google map*/}
                            <div className="col-xl-8 col-lg-7 col-12">
                                <GoogleMap />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="contact-section padding-tb">
                <div className="container ps-5 pe-5">
                    <div className="section-header text-center">
                        <span className="subtitle">{conSubTitle}</span>
                        <h2 className="title">{conTitle}</h2>
                    </div>

                    <div className="section-wrapper">
                        <form className="contact-form">
                            <div className="form-group">
                                <input type="text" name="name" id="name" placeholder="Họ và tên *"/>
                            </div>
                            <div className="form-group">
                                <input type="email" name="email" id="email" placeholder="Email *"/>
                            </div>
                            <div className="form-group">
                                <input type="text" name="phone" id="phone" placeholder="Điện thoại *"/>
                            </div>
                            <div className="form-group">
                                <input type="email" name="subject" id="subject" placeholder="Chủ đề *"/>
                            </div>
                            <div className="form-group w-100">
                                <textarea name="message" id="message" rows="8" placeholder="Nội dung"></textarea>
                            </div>
                            <div className="form-group w-100 text-center">
                                <button className="lab-btn">
                                    <span>{btnText}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;