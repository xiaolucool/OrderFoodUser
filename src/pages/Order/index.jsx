import { Layout, Table, message, Button, Tooltip, Tag } from 'antd';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './index.css';

const { Header, Footer, Content } = Layout;

const Order = () => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const id = params.get('id');
    const phone = JSON.parse(window.localStorage.getItem(`phone`));

    useEffect(() => {
        // 组件挂载时更新文档标题
        document.title = '吃货联盟点餐系统-订单详情';

        // 可选地，你可以返回一个清理函数，在组件卸载时重置标题
        return () => {
            document.title = '吃货联盟点餐系统';
        };
    }, []); // 空的依赖数组确保此效果仅在挂载时运行一次

    const fetchData = async () => {
        try {
            const { data } = await axios.get(`/api/order/phone?phone=${phone}`);
            setList(data.data || []);
            setLoading(false);
        } catch (error) {
            message.error('获取失败！！！');
        }
    };

    useEffect(() => {
        fetchData();
    }, [phone]); // 添加 phone 为 useEffect 的依赖项，确保在 phone 改变时重新获取数据

    const formattedData = list.map((item, index) => ({
        ...item,
        totalAmount: parseFloat(item.totalAmount.toFixed(2)),
        key: index.toString(), // 使用索引作为 key
    }));
    // 格式化时间
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const formattedDate = new Date(dateString).toLocaleString('zh-cn', options);
        return formattedDate;
    };
    // 价格增加单位
    const priceUnit = (price) => {
        return price + '￥';
    };

    const columns = [
        {
            title: '订单号',
            dataIndex: 'id',
            key: 'key',
        },
        {
            title: '桌号',
            dataIndex: 'tableNumber',
            key: 'key',
        },
        {
            title: '菜品',
            dataIndex: 'dishs',
            key: 'key',
        },
        {
            title: '下单时间',
            dataIndex: 'createTime',
            key: 'key',
            render: (createTime) => formatDate(createTime),
        },
        {
            title: '订单状态',
            dataIndex: 'status',
            key: 'key',
            render: (status) => (
                <Tag color={getStatusColor(status)}>
                    {status}
                </Tag>
            ),
        },
        {
            title: '总价',
            dataIndex: 'totalAmount',
            key: 'key',
            render: (totalAmount) => priceUnit(totalAmount),
        },
        {
            title: '手机号',
            dataIndex: 'phone',
            key: 'key',
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'key',
        }
    ];
    const getStatusColor = (status) => {
        switch (status) {
            case "等待确认":
                return 'orange';
            case "订单完成":
                return 'blue';
            case "等待出餐":
                return 'green';    
            default:
                return 'default';
        }
    };

    return (
        <div className="Layout-order">
            <Layout>
                <Header className="header">
                    <span className="logo">
                        吃货联盟点餐系统 - 订单详情
                    </span>
                    <span className="tNum">桌号：{id}</span>
                </Header>
                <Content className="content">
                    {loading ? (
                        <p>加载中...</p>
                    ) : list.length > 0 ? (
                        <Table columns={columns} dataSource={formattedData} />
                    ) : (
                        <p>暂无数据。</p>
                    )}
                </Content>
                <Footer className="footer">
                    <Tooltip placement="top" title={'点击去下单'}>
                        <Button type="primary" shape="round" onClick={() => navigate(`/?id=${id}`)}>去下单</Button>
                    </Tooltip>
                </Footer>
            </Layout>
        </div>
    );
};

export default Order;
