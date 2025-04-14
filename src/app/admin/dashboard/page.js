'use client'

import React, { useState, useEffect } from 'react';
import { Card, Statistic, Row, Col, Table, Tag, Typography, DatePicker } from 'antd';
import {
    AiFillDollarCircle,
    AiOutlineShoppingCart,
    AiOutlineUser,
    AiOutlineLineChart,
} from 'react-icons/ai';
import { BarChart, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Bar, ResponsiveContainer } from 'recharts';
import 'antd/dist/reset.css';
import useGetListOrder from '@/hook/useGetListOrder';
import useProductController from '@/hook/useProductController';
import useCustomerController from '@/hook/useCustomerController';
import dayjs from 'dayjs';
import { Timestamp } from 'firebase/firestore';
import { formatCurrency } from '@/utils/helper/appCommon';
const { Title } = Typography;
const { RangePicker } = DatePicker;

const dashboardStats = [
    {
        title: 'Tổng doanh thu',
        value: 0,
        icon: <AiFillDollarCircle style={{ color: 'green' }} size={24} />,
        suffix: '$',
    },
    {
        title: 'Tổng đơn hàng',
        value: 0,
        icon: <AiOutlineShoppingCart style={{ color: 'blue' }} size={24} />,
    },
    {
        title: 'Khách hàng',
        value: 0,
        icon: <AiOutlineUser style={{ color: 'red' }} size={24} />,
    },
    {
        title: 'Sản phẩm sắp hết hàng',
        value: 0,
        icon: <AiOutlineLineChart style={{ color: 'purple' }} size={24} />,
    },
];

const Dashboard = () => {
    const [params, setParams] = useState({ size: 12, page: 1 });
    const [paramsOrder, setParamsOrder] = useState({
        size: 50,
        page: 1,
        fromDate: Timestamp.fromDate(dayjs().subtract(7, 'day').toDate()),
        toDate: Timestamp.fromDate(dayjs().toDate())
    }); const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [lowStockProductsCount, setLowStockProductsCount] = useState(0);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [topProducts, setTopProducts] = useState([]);

    const { orders = [], orderCountByDate, getTotalRevenueAndOrders } = useGetListOrder({ params: paramsOrder });
    const { getTotalUsersWithUserRole } = useCustomerController({ params });
    const { products = [], getLowStockProductsCount } = useProductController({ params });
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get total revenue and total orders
                const { totalRevenue, totalOrders } = await getTotalRevenueAndOrders()
                console.log("check:::", totalRevenue, totalOrders)
                setTotalRevenue(totalRevenue);
                setTotalOrders(totalOrders);
                // Get total users and low stock products count
                const users = await getTotalUsersWithUserRole();
                const lowStockCount = await getLowStockProductsCount();
                setTotalUsers(users);
                setLowStockProductsCount(lowStockCount);

                setRecentTransactions([]); // Replace with actual data
                setTopProducts([]); // Replace with actual data
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchData();
    }, [paramsOrder]);

    const handleDateChange = (dates) => {
        if (dates && dates.length === 2) {
            const fromDate = Timestamp.fromDate(dates[0].toDate());
            const toDate = Timestamp.fromDate(dates[1].toDate());

            setParamsOrder(prev => ({
                ...prev,
                fromDate,
                toDate
            }));
        } else {
            setParamsOrder(prev => ({
                ...prev,
                fromDate: null,
                toDate: null
            }));
        }
    };

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
            default:
                return (
                    <span className={`${baseClass} text-gray-600 border-gray-400 bg-gray-100`}>
                        Không rõ
                    </span>
                );
        }
    };


    return (
        <div className='w-full p-2 md:p-4'>
            <div className='flex flex-col gap-2 md:flex-row md:justify-between mb-4 lg:mb-10'>
                <Title level={2}>Dashboard</Title>
                <RangePicker
                    inputReadOnly
                    onChange={handleDateChange}
                    value={[
                        paramsOrder.fromDate ? dayjs(paramsOrder.fromDate.toDate()) : null,
                        paramsOrder.toDate ? dayjs(paramsOrder.toDate.toDate()) : null
                    ]} />
            </div>
            <Row gutter={24}>
                {dashboardStats.map((stat, index) => (
                    <Col xs={24} md={12} lg={6} key={index} className='mt-4 md:6 lg:mt-0'>
                        <Card>
                            <Statistic
                                title={stat.title}
                                value={index === 0 ? totalRevenue : index === 1 ? totalOrders : index === 2 ? totalUsers : lowStockProductsCount}
                                prefix={stat.icon}
                                suffix={stat.suffix}
                            />
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row gutter={16} style={{ marginTop: 24 }}>
                <Col xs={24} lg={16}>
                    <Card title="Số đơn hàng">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={orderCountByDate}>
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                                <Line type="monotone" dataKey="count" stroke="#1890ff" name="Số đơn hàng" />
                            </LineChart>
                        </ResponsiveContainer>

                    </Card>
                </Col>

                <Col xs={24} lg={8} className='mt-6 lg:mt-0'>
                    <Card title="Tổng giá trị đơn hàng trong 7 ngày">
                        <Statistic
                            title="Tổng tiền"
                            value={formatCurrency(orderCountByDate?.reduce((total, item) => total + item.totalPrice, 0))}
                            style={{ marginTop: 16 }}
                        />
                        <ResponsiveContainer width="100%" height={150}>
                            <BarChart data={orderCountByDate}>
                                <XAxis dataKey="day" />
                                <Tooltip formatter={(value) => formatCurrency(value)} />
                                <Bar
                                    dataKey="totalPrice"
                                    fill="#3f8600"
                                    label={({ x, y, width, value }) => (
                                        <text x={x + width / 2} y={y - 5} textAnchor="middle" fill="#000">
                                            {formatCurrency(value)}
                                        </text>
                                    )}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>

            </Row>

            <Row gutter={16} style={{ marginTop: 24 }}>
                <Col span={24}>
                    <Card title="Recent Transactions">
                        <Table
                            dataSource={orders?.slice(0, 10)}
                            pagination={false}
                            rowKey="name"
                            columns={[
                                { title: 'Tên khách hàng', dataIndex: 'customerName' },
                                {
                                    title: 'Ngày', dataIndex: 'orderDate',
                                    render: (_, record) => (
                                        <div>
                                            {record?.orderDate
                                                ? dayjs(record?.orderDate?.toDate()).format('DD/MM/YYYY HH:mm')
                                                : 'N/A'}
                                        </div>
                                    )
                                },
                                {
                                    title: 'Tổng tiền', dataIndex: 'totalPrice',
                                    render: (_, record) => (
                                        <div className='min-w-20'>{formatCurrency(record?.totalPrice)}</div>
                                    )
                                },
                                {
                                    title: 'Status',
                                    dataIndex: 'status',
                                    render: status => (
                                        <div >{renderStatus(status)}</div>
                                    ),
                                },
                            ]}
                            scroll={{ x: "max-content" }}

                        />
                    </Card>
                </Col>

                {/* <Col span={12}>
                    <Card title="Top Products by Units Sold">
                        <Table
                            dataSource={topProducts}
                            pagination={false}
                            rowKey="name"
                            columns={[
                                { title: 'Name', dataIndex: 'name' },
                                { title: 'Price', dataIndex: 'price' },
                                { title: 'Units Sold', dataIndex: 'sold' },
                            ]}
                        />
                    </Card>
                </Col> */}
            </Row>
        </div>
    );
};

export default Dashboard;
