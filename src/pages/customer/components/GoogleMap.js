import React from 'react';

const GoogleMap = () => {
    return (
        <div className="map-area">
            <div className="maps">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.9960862821717!2d105.84140339999999!3d20.992793999999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ac6f65ea8bdf%3A0xaa7f8025b53ebd9e!2zMzg5IFAuIFbhu41uZywgxJDhu5NuZyBUw6JtLCBIYWkgQsOgIFRyxrBuZywgSMOgIE7hu5lpLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1721143205712!5m2!1svi!2s"
                    ></iframe>
            </div>
        </div>
    );
};

export default GoogleMap;