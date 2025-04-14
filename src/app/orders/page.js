'use client'

import React, { useEffect, useState } from "react";
import { Table, Spin, Select, Input, Pagination, DatePicker, Drawer, Button, Modal, Form, Rate } from "antd";
import useGetListOrder from "@/hook/useGetListOrder";
import dayjs from "dayjs";
import { DEFAULT_CLASSNAME, formatCurrency, mappingStatus } from "@/utils/helper/appCommon";
import { IoEyeSharp } from "react-icons/io5";
import Link from "next/link";
import { Timestamp } from "firebase/firestore";
import { useSelector } from "react-redux";
import useRatingController from "@/hook/useRatingController";
import { useForm } from "antd/es/form/Form";
const { Option } = Select;
const { RangePicker } = DatePicker;


export default function OrdersHistory() {
    const userInfo = useSelector(state => state?.user?.info)
    const [params, setParams] = useState({ size: 12, page: 1 })
    const [isViewOrderDetail, setIsViewModelDetail] = useState(false)
    const [dataOrder, setDataOrder] = useState({})
    const [isModalConfirm, setIsModalConfirm] = useState(false)
    const [form] = useForm()
    const [isRating, setIsRating] = useState(false)
    const {
        orders = [],
        totalElements,
        updateDeliveryStatus = () => { },
        loading
    } = useGetListOrder({ params })
    const {
        addRating = () => { }
    } = useRatingController()
    useEffect(() => {
        if (userInfo?.uid) {
            setParams(prev => ({ ...prev, uid: userInfo?.uid }))
        }
    }, [userInfo])

    const columns = [
        {
            title: "Mã đơn hàng",
            dataIndex: 'orderId',
            key: 'orderId',
            render: (_, record) => {
                return (
                    <div>{record?.orderId}</div>
                )
            },
        },
        {
            title: 'Thời gian đặt',
            dataIndex: 'orderDate',
            key: 'orderDate',
            render: (_, record) => (
                <div>
                    {record?.orderDate
                        ? dayjs(record?.orderDate?.toDate()).format('DD/MM/YYYY HH:mm')
                        : 'N/A'}
                </div>
            )
        },
        {
            title: 'Tên khách hàng',
            dataIndex: 'customerName',
            key: 'customerName',
            render: (_, record) => (<div>{record?.customerName}</div>)
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phoneCustomer',
            key: 'phoneCustomer',
            align: 'center',
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (_, record) => (
                <div className="min-w-16">
                    {formatCurrency(record?.totalPrice)}
                </div>

            )
        },
        {
            title: "Trạng thái",
            dataIndex: 'status',
            key: 'status',
            render: (_, record) => (
                <div >
                    {renderStatus(record?.status)}
                </div>
            )
        },
        {
            title: "",
            dataIndex: 'action',
            key: 'action',
            render: (_, record) => (
                <div className="text-primary cursor-pointer"
                    onClick={() => {
                        setIsViewModelDetail(true)
                        setDataOrder(record)
                    }}
                ><IoEyeSharp /></div>

            )
        }

    ]
    const renderStatus = (status) => {
        let baseClass =
            "px-3 py-1 rounded-lg text-sm font-medium border inline-block min-w-[90px] text-center";

        switch (status) {
            case "PENDING":
                return (
                    <span className={`${baseClass} text-yellow-600 border-yellow-600 bg-yellow-100`}>
                        Đang xử lí
                    </span>
                );
            case "SHIPPED":
                return (
                    <span className={`${baseClass} text-blue-600 border-blue-600 bg-blue-100`}>
                        Đang giao
                    </span>
                );
            case "SUCCESS":
                return (
                    <span className={`${baseClass} text-green-600 border-green-600 bg-green-100`}>
                        Hoàn tất
                    </span>
                );
            case "CANCEL":
                return (
                    <span className={`${baseClass} text-red-600 border-red-600 bg-red-100`}>
                        Hủy
                    </span>
                );
            case "RETURN":
                return (
                    <span className={`${baseClass} text-red-600 border-red-600 bg-red-100`}>
                        Trả hàng
                    </span>
                );
            default:
                return (
                    <span className={`${baseClass} text-gray-600 border-gray-400 bg-gray-100`}>
                        Không rõ
                    </span>
                );
        }
    };

    const handleDateChange = (dates) => {
        if (dates && dates.length === 2) {
            const fromDate = Timestamp.fromDate(dates[0].toDate());
            const toDate = Timestamp.fromDate(dates[1].toDate());

            setParams(prev => ({
                ...prev,
                fromDate,
                toDate
            }));
        } else {
            // Nếu clear DatePicker
            setParams(prev => ({
                ...prev,
                fromDate: null,
                toDate: null
            }));
        }
    };

    const handleSearch = (value) => {
        setParams(prev => ({ ...prev, orderId: value }))
    }

    const handleTotal = () => {
        return dataOrder?.orderItems?.reduce((sum, item) => {
            return sum + (item?.price * item?.quantity);
        }, 0);
    }

    const handleSubmit = async () => {
        try {
            const callbackSuccess = () => {
                setIsRating(true)
            }
            await updateDeliveryStatus(dataOrder?.orderId, "SUCCESS", dataOrder?.orderItems, callbackSuccess)
        } catch (error) {
            console.log(error)
        }
    }

    const handleRating = async (values) => {
        try {
            const productIds = dataOrder?.orderItems?.map(item => item.productId)
            const data = {
                productIds,
                uid: userInfo?.uid,
                rate: values?.rate || 5,
                comment: values?.comment || ""
            }
            const callbackSuccess = () => {
                setDataOrder({})
                setIsModalConfirm(false)
                setIsRating(false)
                setIsViewModelDetail(false)
                setParams(prev => ({ ...prev, view: true }))
            }
            await addRating(data, callbackSuccess)
        } catch (error) {

        }
    }



    return (
        <div className={`${DEFAULT_CLASSNAME}`}>
            <div className={`flex gap-4 my-6`}>
                <Link href="/">
                    <div className="text-primary">Trang chủ </div>
                </Link>
                <div>\</div>
                <div>Lịch sử mua hàng</div>
            </div>
            <div className="bg-background min-h-screen w-full overflow-x-auto rounded-lg">
                <div className="flex flex-col w-full lg:flex-row gap-4 lg:justify-between lg:items-center mb-10">
                    <h2 className="text-3xl font-semibold">Lịch sử mua hàng</h2>
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <RangePicker
                            inputReadOnly
                            onChange={handleDateChange} />
                        <Input.Search
                            style={{ width: 250 }}
                            className=""
                            // prefix={<SearchOutlined />}
                            placeholder={"Tìm kiếm đơn hàng"}
                            enterButton={true}
                            allowClear={true}
                            onSearch={(value) => { handleSearch(value) }}
                        />
                        <Select style={{ width: 200 }}
                            placeholder="Chọn trạng thái"
                            onChange={(value) => { setParams(prev => ({ ...prev, status: value })) }}
                            allowClear
                        >
                            <Option value="PENDING">Đang xử lí</Option>
                            <Option value="SHIPPED">Đang giao</Option>
                            <Option value="SUCCESS">Hoàn tất</Option>
                            <Option value="CANCEL">Hủy</Option>
                        </Select>
                    </div>
                </div>
                <div className="w-full overflow-x-auto">
                    <Table
                        dataSource={orders}
                        columns={columns}
                        loading={loading}
                        pagination={false}
                        sticky={true}
                        scroll={{ x: "max-content" }}

                    />
                </div>

                {totalElements > params?.size ?
                    <div className="p-4 text-center">
                        <Pagination
                            align="center"
                            current={params?.page || 1}
                            pageSize={params?.size}
                            total={totalElements}
                            onChange={(page) => {
                                setParams(prev => ({ ...prev, page: page }));
                            }}
                        />
                    </div>

                    : null
                }
            </div>
            <Drawer title="Chi tiết đơn hàng"
                onClose={() => {
                    setIsViewModelDetail(false)
                    setDataOrder({})
                }}
                open={isViewOrderDetail}
                width={"70vw"}
            >
                <Spin spinning={loading}>
                    <div className="flex flex-col gap-6" >
                        <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
                            <div>Mã đơn hàng: {dataOrder?.orderId}</div>
                            <div className="flex flex-col gap-4 md:flex-row">
                                {dataOrder?.status == "SHIPPED" &&
                                    <Button className="btn-green-color"
                                        onClick={() => { setIsModalConfirm(true) }}
                                    >Đã nhận được hàng</Button>
                                }
                                <div>{renderStatus(dataOrder?.status)}</div>

                            </div>
                        </div>
                        <div>
                            <div>
                                Tên khách hàng: <span>{dataOrder?.customerName}</span>
                            </div>
                            <div>
                                Số điện thoại: <span>{dataOrder?.phoneCustomer}</span>
                            </div>
                            <div>
                                Địa chỉ giao hàng: <span>{dataOrder?.address}, {dataOrder?.ward}, {dataOrder?.district}, {dataOrder?.province}</span>
                            </div>
                            <div>Ghi chú: <span>{dataOrder?.note}</span></div>
                        </div>
                        <Table
                            dataSource={dataOrder?.orderItems}
                            pagination={false}
                            className="mb-6"
                            scroll={{ x: "max-content" }}
                            columns={[
                                {
                                    title: "Ảnh",
                                    dataIndex: "image",
                                    render: (_, record) => (
                                        <div>
                                            <img src={record?.image || noImg?.src} className="w-20 h-20 object-cover rounded-lg" />
                                        </div>
                                    ),
                                },
                                {
                                    title: "Tên sản phẩm",
                                    dataIndex: "productName",
                                    render: (_, record) => (
                                        <div>{record?.productName}</div>
                                    )
                                },
                                {
                                    title: "Phân loại",
                                    dataIndex: "variant",
                                    render: (_, record) => (
                                        <div>Màu sắc: {record?.variant?.color} | Kích cỡ: {record?.variant?.size}</div>
                                    )
                                },
                                {
                                    title: "Số lượng",
                                    dataIndex: "quantity",
                                    render: (_, record) => (
                                        <div className="text-center">{record?.quantity}</div>
                                    )
                                },
                                {
                                    title: "Thành tiền",
                                    dataIndex: "total",
                                    render: (_, record) => (
                                        <div>{formatCurrency(record?.price * record?.quantity)}</div>
                                    ),
                                },
                            ]}
                        />
                    </div>

                    <div className="flex flex-col gap-2 items-end text-sm text-gray-700">
                        <div className="flex gap-8">
                            <div className="w-28 text-start">Thành tiền</div>
                            <div className="w-28 text-end">{formatCurrency(handleTotal())}
                            </div>
                        </div>
                        <div className="flex gap-8">
                            <div className="w-28 text-start">Giảm giá</div>
                            <div className="w-28 text-end">{formatCurrency(dataOrder?.discount)}</div>
                        </div>
                        <div className="flex gap-8">
                            <div className="w-28 text-start">Phí vận chuyển</div>
                            <div className="w-28 text-end ">{formatCurrency(dataOrder?.shippingPrice)}</div>
                        </div>
                        <div className="flex gap-8 font-bold text-base text-black">
                            <div className="w-28 text-start">Tổng tiền</div>
                            <div className="w-28 text-end">{formatCurrency(dataOrder?.totalPrice)}</div>
                        </div>
                    </div>
                </Spin>
            </Drawer>
            <Modal title={isRating ? "Đánh giá sản phẩm" : "Xác nhận nhận được hàng"}
                open={isModalConfirm}
                onCancel={() => {
                    if (isRating) {
                        setDataOrder({})
                        setIsRating(false)
                        setIsModalConfirm(false)
                        setIsViewModelDetail(false)
                        setParams(prev => ({ ...prev, view: true }))
                    }
                    else {
                        setIsModalConfirm(false)
                    }
                }}
                footer={null}>
                {isRating ?
                    <Form form={form} onFinish={handleRating} layout="vertical">
                        <Form.Item
                            name="rate"
                            label="Đánh giá sản phẩm"
                            rules={[{ required: true, message: "Vui lòng chọn số sao!" }]}
                        >
                            <Rate />
                        </Form.Item>

                        <Form.Item
                            name="comment"
                            label="Cảm nhận của bạn"
                        >
                            <Input.TextArea
                                rows={4}
                                placeholder="Nhập cảm nhận của bạn về sản phẩm"
                            />
                        </Form.Item>

                        <Form.Item className="flex gap-4 justify-end">
                            <Button danger onClick={() => {
                                setDataOrder({})
                                setIsRating(false)
                                setIsModalConfirm(false)
                                setIsViewModelDetail(false)
                                setParams(prev => ({ ...prev, view: true }))
                            }}>Hủy</Button>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                Gửi đánh giá
                            </Button>
                        </Form.Item>
                    </Form> :
                    <div>
                        <div>
                            Bạn chắc chắn đã nhận được hàng rồi chứ!
                        </div>
                        <div className="flex justify-end gap-4 mt-8">
                            <Button danger onClick={() => { setIsModalConfirm(false) }}>Hủy</Button>
                            <Button className="btn-green-color" onClick={handleSubmit}>Đồng ý</Button>
                        </div>
                    </div>}
            </Modal>
        </div>

    )

}
