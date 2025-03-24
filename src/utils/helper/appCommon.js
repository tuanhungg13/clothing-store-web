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