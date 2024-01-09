import { Button, Image, List } from 'antd';
import { useSearchParams } from 'react-router-dom';


const ShoppingList = () => {
    // 获取路由id
    const [params] = useSearchParams()
    const id = params.get('id')
    const cartList = JSON.parse(window.localStorage.getItem(`cartList${id}`))

    // 商品总价
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
    const delCrt = (index)  => {
        console.log('删除',index)
        cartList.splice(index, 1)
        // 更新缓存
        window.localStorage.setItem(`cartList${id}`, JSON.stringify(cartList));

    }
    return (
        <>
            <List
                itemLayout="horizontal"
                dataSource={cartList}
                renderItem={(item, index) => (
                    <List.Item actions={[
                        <Button 
                            key={`delete-${index}`} 
                            type="primary" 
                            danger 
                            shape="round" 
                            onClick={() => delCrt(index)}
                        >
                            删除
                        </Button>
                    ]} >
                        <List.Item.Meta
                            avatar={<Image width={'80px'} key={index} fallback="https://img.katr.tk/2023/12/87b101050aad565ae64c2d0cd83ca6da.png"  src={`/img/${item.image}`} />}
                            title={item.name}
                            description={`${item.num}份，￥${item.price * item.num}`}
                        />
                    </List.Item>
                )}
            />
        </>
    )
}

export default ShoppingList 