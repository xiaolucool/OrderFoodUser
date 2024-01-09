import { Layout, Table, message, Button, Tooltip } from 'antd';
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
    const phone = JSON.parse(window.localStorage.getItem(`phone${id}`));

    const fetchData = async () => {
        try {
            const { data } = await axios.get(`/api/order/phone?phone=${phone}`);
            setList(data.data || []);
            setLoading(false);
            message.success('获取成功！！！');
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
        },
        {
            title: '订单状态',
            dataIndex: 'status',
            key: 'key',
        },
        {
            title: '总价',
            dataIndex: 'totalAmount',
            key: 'key',
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
    

    return (
        <div className="Layout">
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
