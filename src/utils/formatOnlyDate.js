export const formatOnlyDate = (dateString) => {
    const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    };
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', options).replace(',', '');
};