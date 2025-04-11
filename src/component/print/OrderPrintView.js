import React, { forwardRef } from "react";
import dayjs from "dayjs";
import { formatCurrency } from "@/utils/helper/appCommon";
const OrderPrintView = forwardRef(({ order }, ref) => {

    return (
        <div style={{ padding: 30, fontFamily: 'Arial' }} ref={ref}>
            <h2 style={{ textAlign: 'center', marginBottom: 30 }}>HÓA ĐƠN BÁN HÀNG</h2>

            <div style={{ marginBottom: 20 }}>
                <p><strong>Khách hàng:</strong> {order.customerName}</p>
                <p><strong>Số điện thoại:</strong> {order.phoneCustomer}</p>
                <p><strong>Địa chỉ:</strong> {order.address}, {order.ward}, {order.district}, {order.province}</p>
                <p><strong>Ngày đặt:</strong> {order?.orderDate
                    ? dayjs(order?.orderDate?.toDate()).format('DD/MM/YYYY HH:mm')
                    : 'N/A'}</p>
                <p><strong>Ghi chú:</strong> {order.note || 'Không có'}</p>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={thStyle}>Hình ảnh</th>
                        <th style={thStyle}>Tên sản phẩm</th>
                        <th style={thStyle}>Màu</th>
                        <th style={thStyle}>Size</th>
                        <th style={thStyle}>Giá</th>
                        <th style={thStyle}>Số lượng</th>
                        <th style={thStyle}>Thành tiền</th>
                    </tr>
                </thead>
                <tbody>
                    {order?.orderItems?.map((item, index) => (
                        <tr key={index}>
                            <td style={tdStyle}>
                                <img src={item.image} alt={item?.productName} style={{ width: 60 }} />
                            </td>
                            <td style={tdStyle}>{item?.productName}</td>
                            <td style={tdStyle}>{item?.variant.color}</td>
                            <td style={tdStyle}>{item?.variant?.size}</td>
                            <td style={tdStyle}>{formatCurrency(item?.price)}</td>
                            <td style={tdStyle}>{item?.quantity}</td>
                            <td style={tdStyle}>{formatCurrency(item?.price * item?.quantity)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ marginTop: 30, textAlign: 'right' }}>
                <p><strong>Phí vận chuyển:</strong> {formatCurrency(order?.shippingPrice)}</p>
                <p><strong>Giảm giá:</strong> {order?.discount * 100} %</p>
                <h3><strong>Tổng cộng:</strong> {formatCurrency(order?.totalPrice)}</h3>
            </div>

            <div style={{ marginTop: 50, textAlign: 'right' }}>
                <p>Người lập hóa đơn: ______________________</p>
            </div>
        </div>
    );
});

const thStyle = {
    border: '1px solid #ccc',
    padding: '8px',
    backgroundColor: '#f5f5f5',
    fontWeight: 'bold',
    textAlign: 'center'
};

const tdStyle = {
    border: '1px solid #ccc',
    padding: '8px',
    textAlign: 'center'
};

export default OrderPrintView;
