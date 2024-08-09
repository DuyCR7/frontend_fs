export const formatDate = (dateString) => {
    const options = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    };
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', options).replace(',', '');
};