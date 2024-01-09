import { Outlet, useSearchParams, useNavigate } from 'react-router-dom'
import { Layout, Tooltip, Button, Badge, Drawer, Modal, Form, Input, message, InputNumber } from 'antd';
const { Header, Footer, Content } = Layout;
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useState } from 'react';
const { TextArea } = Input;
import axios from 'axios';

import './index.css'
import List from '../../components/List.jsx';


const PcLayout = () => {
    const [form] = Form.useForm();
    // 获取路由id
    const [params] = useSearchParams()
    const id = params.get('id')
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

    // 小数点后两位的整数价格
    TotalPrice = parseFloat(TotalPrice.toFixed(2));
    // 结算
    const addFood = () => {
        Modal.confirm({
            title: '确认下单',
            okText: '下单',
            cancelText: '取消',
            content: <div>
                <Form
                    form={form}
                    name="control-hooks"
                    style={{
                        maxWidth: 600,
                    }}
                >
                    <Form.Item
                        name="order"
                        label="餐桌编号"
                        rules={[
                            {
                                pattern: /^1[3-9]\d{9}$/,
                                message: '手机号码格式不对',
                                validateTrigger: 'onBlur'
                            },
                            { required: true, message: '请输入手机号' }
                        ]}
                    >
                        <InputNumber min={1} max={10} disabled={true} defaultValue={id} />
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        label="手机号码"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name="remark" label="订单备注：" rules={[
                        {
                            required: true,
                        },
                    ]}>
                        <TextArea rows={4} placeholder="请输入订单备注" maxLength={6} />
                    </Form.Item>
                </Form>
            </div>,
            onOk: async () => {
                try {
                    await form.submit();
                    const formData = form.getFieldsValue();
                    let str = ''
                    cartList.forEach(item => {
                        str += item.id + '.' + item.num + ',';
                    });
                    let result = str.slice(0, -1);

                    const data = {
                        tableNumber: id,
                        dishs: result,
                        phone: formData.phone,
                        remark: formData.remark
                    }
                    const orderData = async () => {
                        try {
                            await axios.post('/api/order', data);
                            // 下单成功清除本地缓存
                            window.localStorage.removeItem(`cartList${id}`)
                            // 保存用户手机号到本都缓存
                            window.localStorage.setItem(`phone${id}`, formData.phone)
                            message.success('下单成功！');
                            navigate(`/order/?id=${id}`)
                        } catch (error) {
                            message.error('下单失败！');
                        }
                    };
                    orderData()
                } catch (errorInfo) {
                    // 如果表单提交失败，这里可以处理错误信息
                    message.error('表单提交失败！', errorInfo);
                }
            },
            onCancel: () => {
                // Do nothing if the user cancels the deletion
            },
        });

    }

    return (
        <>
            <div className="Layout">
                <Layout>
                    <Header className="header">
                        <span className="logo">{/* <MobileOutlined className="logo-icon" /> */} 吃货联盟点餐系统</span>
                        <span className="tNum">桌号：{id}</span>
                    </Header>
                    <Content className="content">
                        <Outlet />
                    </Content>
                    <Footer className="footer" style={{ justifyContent: "space-around" }}>
                        <div className="left">
                            <Tooltip placement="top" title={'点击查看订单详情'}>
                                <Button onClick={() => navigate(`/order/?id=${id}`)}>订单详情</Button>
                            </Tooltip>
                        </div>
                        <div className="right">
                            <Tooltip placement="top" title={'点击查看购物车'}>
                                <Badge className='badge' count={cartList ? cartList.length : 0}>
                                    <div className="price" onClick={showDrawer}>{TotalPrice}￥&nbsp;&nbsp;</div>
                                </Badge>
                            </Tooltip>
                            <Button onClick={() => addFood()} type="primary" danger shape="round" icon={<ShoppingCartOutlined />} size={40}>
                                去结算
                            </Button>
                        </div>
                    </Footer>
                </Layout>
                {/* 右侧弹窗 */}
                <Drawer title="购物车" placement="right" onClose={onClose} open={open}>
                    <List />
                    <div className="footer-cart">
                        <span className="price cart-price">￥{TotalPrice}</span>
                        <Button type="primary cart-btn" danger shape="round" onClick={() => addFood()}>去结算</Button>
                    </div>
                </Drawer>
            </div >
        </>
    )
}

export default PcLayout