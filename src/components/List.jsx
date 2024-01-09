import { Button, Image, List, Modal, message } from 'antd';
import { useState } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';

const ShoppingList = () => {
    const [params] = useSearchParams()
    const id = params.get('id')
    const location = useLocation();
    console.log(location.pathname);
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

    // Round TotalPrice to two decimal places
    TotalPrice = parseFloat(TotalPrice.toFixed(2));

    console.log("Total Price:", TotalPrice);

    const delCrt = (index) => {
        // Display a confirmation modal
        Modal.confirm({
            title: '确认删除',
            content: '您确定要删除这个商品吗？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                // Delete the item and update the localStorage
                const updatedCartList = [...cartList];
                updatedCartList.splice(index, 1);
                setCartList(updatedCartList);
                window.localStorage.setItem(`cartList${id}`, JSON.stringify(updatedCartList));
                message.success('删除成功！！！');
            },
            onCancel: () => {
                // Do nothing if the user cancels the deletion
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
