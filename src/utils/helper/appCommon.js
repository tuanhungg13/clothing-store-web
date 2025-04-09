export const DEFAULT_CLASSNAME = "px-4 lg:px-10 xl:px-20 ny-6 md:my-12"

export const formatCurrency = (value = 0, fixed = 0) => {
    let newValue = value;
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
    { value: 1, label: 'Quần áo' },
    { value: 2, label: 'Giày' },
    { value: 3, label: 'Trang sức' },
    { value: 4, label: 'Mỹ phẩm' },
]

export const renderStatus = (status) => {
    let label = CATEGORYOPTION?.[+status - 1]?.label || "Chưa xác định";
    let className = `text-xs rounded border px-2 py-[2px] bg-opacity-10 w-max h-max`;
    switch (+status) {
        case 1:
            className += "border-success text-success bg-success";
            break;
        case 2:
            className += "border-warning text-warning bg-warning";
            break;
        case 4:
            className += "border-pink-400 text-pink-400";
            break;
        default:
            break;
    }
    return <div className={className}>{label}</div>
}