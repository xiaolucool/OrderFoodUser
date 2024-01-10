import { Button, Image, List, Modal, message } from 'antd';
import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const ShoppingList = () => {
    const [params] = useSearchParams()
    const id = params.get('id')
    // 路由
    const navigate = useNavigate();
    const [cartList, setCartList] = useState(JSON.parse(window.localStorage.getItem(`cartList${id}`)) || []);
    // 商品总价
    let TotalPrice = 0;

    if (cartList) {
        TotalPrice = cartList.reduce((total, item) => {
            if (item.num > 1) {
                return total + item.price * item.num;
            } else {
                return total + item.price;
            }
        }, 0);
    }

    // 小数点后两位的整数价格
    TotalPrice = parseFloat(TotalPrice.toFixed(2));

    console.log("Total Price:", TotalPrice);

    const delCrt = (index) => {
        // 模态窗口
        Modal.confirm({
            title: '确认删除',
            content: '您确定要删除这个商品吗？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                // 删除该项并更新 localStorage
                const updatedCartList = [...cartList];
                updatedCartList.splice(index, 1);
                setCartList(updatedCartList);
                window.localStorage.setItem(`cartList${id}`, JSON.stringify(updatedCartList));
                message.success('删除成功！！！');
                navigate(`/?id=${id}`)
            },
            onCancel: () => {
                // 如果用户取消删除，则不执行任何操作
            },
        });
    };

    return (
        <>
            <List
                itemLayout="horizontal"
                dataSource={cartList}
                renderItem={(item, index) => (
                    <List.Item
                        actions={[
                            <Button
                                key={`delete-${index}`}
                                type="primary"
                                danger
                                shape="round"
                                onClick={() => delCrt(index)}
                            >
                                删除
                            </Button>
                        ]}
                    >
                        <List.Item.Meta
                            avatar={<Image width={'80px'} key={index} fallback="https://img.katr.tk/2023/12/87b101050aad565ae64c2d0cd83ca6da.png" src={`/img/${item.image}`} />}
                            title={item.name}
                            description={`${item.num}份，￥${item.price * item.num}`}
                        />
                    </List.Item>
                )}
            />
        </>
    )
}

export default ShoppingList;
