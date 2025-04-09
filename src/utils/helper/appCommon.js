export const DEFAULT_CLASSNAME = "px-4 lg:px-10 xl:px-20 !my-10 "

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
    { value: 0, label: 'Quần áo' },
    { value: 1, label: 'Giày' },
]

