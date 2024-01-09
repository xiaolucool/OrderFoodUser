import List from '../../components/List'
import { ShoppingCartOutlined, MobileOutlined } from '@ant-design/icons'
import { Layout, Flex, Button, Badge, } from 'antd';
const { Header, Footer, Content } = Layout;
import { useSearchParams } from 'react-router-dom'

const Await = () => {
    // 获取路由id
    const [params] = useSearchParams()
    const id = params.get('id')
    const onSubmit = () => {
        console.log('提交')
    }
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
    return (
        <>
            <div className="Layout">
                <Layout>
                    <Header className="header">
                        <span className="logo"><MobileOutlined className="logo-icon" />点餐系统</span>
                        <span className="tNum">桌号：{id}</span>
                    </Header>
                    <Content className="content">
                        <List />
                    </Content>
                    <Footer className="footer">
                        <Flex className="footer-flex" justify={'flex-end'} align={'center'}>
                            <Badge className='badge' count={cartList ? cartList.length : 0}>
                                <div className="price">{TotalPrice}￥&nbsp;&nbsp;</div>
                            </Badge>
                            <Button onClick={() => onSubmit()} type="primary" danger shape="round" icon={<ShoppingCartOutlined />} size={40}>
                                下单
                            </Button>
                        </Flex>
                    </Footer>
                </Layout>
            </div>
        </>
    )
}

export default Await