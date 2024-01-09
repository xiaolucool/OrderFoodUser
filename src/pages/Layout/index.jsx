import { Outlet, useNavigate, useSearchParams } from 'react-router-dom'
import { Layout, Flex, Button, Badge, Drawer } from 'antd';
const { Header, Footer, Content } = Layout;
import { MobileOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useState } from 'react';

import './index.css'
import List from '../../components/List.jsx';


const PcLayout = () => {
    // 获取路由id
    const [params] = useSearchParams()
    const id = params.get('id')
    // console.log(params)
    // 路由
    const navigate = useNavigate();
    // 右侧弹窗
    const [open, setOpen] = useState(false);
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };
    const cartList = JSON.parse(window.localStorage.getItem(`cartList${id}`))
    console.log(cartList)
    let TotalPrice = 0;

    if (cartList) {
        TotalPrice = 0;
        cartList.forEach(item => {
            if (item.num > 1) {
                TotalPrice += item.price * item.num;
            } else {
                TotalPrice += item.price;
            }
        });
    }

    // Round TotalPrice to two decimal places
    TotalPrice = parseFloat(TotalPrice.toFixed(2));

    console.log("Total Price:", TotalPrice);

    // 结算
    const addFood = () => {
    }

    return (
        <>
            <div className="Layout">
                <Layout>
                    <Header className="header">
                        <span className="logo"><MobileOutlined className="logo-icon" />点餐系统</span>
                        <span className="tNum">桌号：{id}</span>
                    </Header>
                    <Content className="content">
                        <Outlet />
                    </Content>
                    <Footer className="footer">
                        <Flex className="footer-flex" justify={'flex-end'} align={'center'}>
                            <Badge className='badge' count={cartList ? cartList.length : 0}>
                                <div className="price" onClick={showDrawer}>{TotalPrice}￥&nbsp;&nbsp;</div>
                            </Badge>
                            <Button onClick={() => navigate('/await')} type="primary" danger shape="round" icon={<ShoppingCartOutlined />} size={40}>
                                去结算
                            </Button>
                        </Flex>
                    </Footer>
                </Layout>
                {/* 右侧弹窗 */}
                <Drawer title="购物车" placement="right" onClose={onClose} open={open}>
                    <List />
                    <div className="footer-cart">
                        <span className="price cart-price">￥{TotalPrice}</span>
                        <Button type="primary cart-btn" danger shape="round" onClick={() => addFood}>去结算</Button>
                    </div>
                </Drawer>
            </div>
        </>
    )
}

export default PcLayout