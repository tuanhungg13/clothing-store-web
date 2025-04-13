export const DEFAULT_CLASSNAME = "px-4 lg:px-10 xl:px-20 !my-10 "

export const formatCurrency = (value = 0, fixed = 0) => {
    let newValue = value;
    if (value === 0) {
        return "0đ"
    }
    if (fixed && `${value}`.split(".")[1]?.length > fixed) {
        newValue = Number(value).toFixed(fixed);
    }
    return `${newValue} đ`.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        ","
    );

};

export const formatCurrencyInput = (value = 0, fixed = 0) => {
    let newValue = value;
    if (fixed && `${value}`.split(".")[1]?.length > fixed) {
        newValue = Number(value).toFixed(fixed);
    }
    return `${newValue}`.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        ","
    );
};


export const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
}

export const CATEGORYOPTION = [
    { value: 0, label: 'Quần áo' },
    { value: 1, label: 'Giày' },
]

export const genLinkProductDetail = (product) => {
    const slug = product?.productName?.toLowerCase()                                // chuyển về chữ thường
        .normalize('NFD')                             // tách dấu tiếng Việt
        .replace(/[\u0300-\u036f]/g, '')              // xoá dấu
        .replace(/[^a-z0-9\s-]/g, '')                 // xoá ký tự đặc biệt
        .trim()                                       // xoá khoảng trắng 2 đầu
        .replace(/\s+/g, '-')                         // thay khoảng trắng bằng dấu gạch ngang
        .replace(/-+/g, '-');
    return `/product/${slug}/${product?.productId}`
}

export const genLinkOrderDetails = (order) => {
    return `/admin/orderDetail/${order?.orderId}`
}

export const COLLECTION_OPTION = [
    { label: "Nổi bật", value: "1" },
    { label: "Bình thường", value: "2" },
];

export const formatAddress = (address) => {
    if (!address) return "";

    const { street, ward, district, province } = address;

    const parts = [street, ward, district, province].filter(Boolean); // loại bỏ phần tử falsy (null, undefined, "")
    return parts.join(", ");
};

