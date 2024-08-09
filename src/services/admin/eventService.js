import axios from "../../config/admin/axios";

const createEvent = (name, description, url, eventDate, imageDesktop, imageMobile) => {
    const data = new FormData();
    data.append("name", name);
    data.append("description", description);
    data.append("url", url);
    data.append("eventDate", eventDate);
    data.append("imageDesktop", imageDesktop);
    data.append("imageMobile", imageMobile);

    return axios.post("/api/v1/admin/event/create", data);
}

const getAllEvent = () => {
    return axios.get('/api/v1/admin/event/read');
}

const setActiveEvent = (id) => {
    return axios.put(`/api/v1/admin/event/set-active`, { id: id });
}

const updateEvent = (id, name, description, url, eventDate, imageDesktop, imageMobile) => {
    const data = new FormData();
    data.append("id", id);
    data.append("name", name);
    data.append("description", description);
    data.append("url", url);
    data.append("eventDate", eventDate);
    data.append("imageDesktop", imageDesktop);
    data.append("imageMobile", imageMobile);

    return axios.put(`/api/v1/admin/event/update`, data);
}

const deleteEvent = (event) => {
    return axios.delete(`/api/v1/admin/event/delete`, { data: {id: event.id} });
}

export {
    createEvent,
    getAllEvent,
    setActiveEvent,
    updateEvent,
    deleteEvent,
}