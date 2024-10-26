import React from 'react';
import PageHeader from "../components/pageHeader/PageHeader.jsx";
import GoogleMap from "../components/googleMap/GoogleMap.jsx";

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
    desc: "https://www.sevenshop.com",
},];

const Contact = () => {
    return (
        <div>
            <PageHeader title={"Liên hệ"} curPage={"Liên hệ"}/>
            <div className="map-address-section padding-tb section-bg" style={{ background: "#f8f9fa" }}>
                <div className="container-fluid ps-5 pe-5">
                    <div className="section-header text-center">
                        <span className="subtitle fs-3">{subTitle}</span>
                        <h3 className="title">{title}</h3>
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
        </div>
    );
};

export default Contact;