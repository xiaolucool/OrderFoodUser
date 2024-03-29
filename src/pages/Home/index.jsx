import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Col, Row, message } from "antd";
import { Card, Button, Image, Modal, InputNumber } from "antd";
import axios from "axios";
import { PlusOutlined, LikeOutlined } from "@ant-design/icons";
import "./index.css";

const Home = () => {
    const [listitem, setListitem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cartList, setCart] = useState([]);
    const [list, setList] = useState([]);
    const [likeCounts, setLikeCounts] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get('/api/dish');
                setList(data.data.records);
            } catch (error) {
                message.error('获取失败！！！');
            }
        };

        fetchData();
    }, []);

    const [params] = useSearchParams();
    const id = params.get('id');

    useEffect(() => {
        const storedCartList = JSON.parse(window.localStorage.getItem(`cartList${id}`)) || [];
        setCart(storedCartList);
    }, []);

    useEffect(() => {
        setTimeout(() => {
            setCart((prevCartList) => {
                if (listitem) {
                    const existingItemIndex = prevCartList.findIndex(
                        (item) => item.id === listitem.id
                    );

                    if (existingItemIndex !== -1) {
                        const updatedCart = [...prevCartList];
                        updatedCart[existingItemIndex].num = 1;
                        return updatedCart;
                    } else {
                        return [
                            ...prevCartList,
                            {
                                ...listitem,
                                num: 1,
                            },
                        ];
                    }
                }

                return prevCartList;
            });
        }, 0);
    }, [listitem]);


    const showModal = (item) => {
        setIsModalOpen(true);
        setListitem(item);
    };

    const handleOk = (litem) => {
        setIsModalOpen(false);
        const local = JSON.parse(window.localStorage.getItem(`cartList${id}`)) || [];
        
        // 查找匹配的对象
        const matchingCartItem = cartList.find(item => item.name === litem.name);
        console.log(matchingCartItem)
    
    
        // 检查最后一个对象是否已存在
        const lastObjectExists = local.some(item => item.id === litem.id);
    
        // 如果不存在，则添加到数组中
        if (!lastObjectExists) {
            local.push(matchingCartItem);
            window.localStorage.setItem(`cartList${id}`, JSON.stringify(local));
        } else {
            
            window.localStorage.removeItem(`cartList${id}`);
            // 存在则更新本地name和lastObjectExists.name相同的属性的num值，把lastObjectExists的.num给本地name相同的那个对象
            local.map(item => {
                if (item.name === matchingCartItem.name) {
                    item.num = matchingCartItem.num;
                }
            })
            window.localStorage.setItem(`cartList${id}`, JSON.stringify(local));
        }
    
        navigate(`/?id=${id}`);
    };
    

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const onChange = (value) => {
        setCart((prevCartList) => {
            const existingItemIndex = prevCartList.findIndex(
                (item) => item.id === listitem.id
            );

            if (existingItemIndex !== -1) {
                const updatedCart = [...prevCartList];
                updatedCart[existingItemIndex].num = value;
                return updatedCart;
            } else {
                return [
                    ...prevCartList,
                    {
                        ...listitem,
                        num: value,
                    },
                ];
            }
        });
    };

    const addStar = async (itemId, favour, index) => {
        try {
            const { data } = await axios.put(`/api/dish/${itemId}`);
            const updatedLikeCounts = { ...likeCounts, [itemId]: data.data.likes };
            setLikeCounts(updatedLikeCounts);
            list[index].favour = ++favour
            message.success('点赞成功！！！');
        } catch (error) {
            message.error('点赞失败！！！');
        }
    }

    return (
        <>
            <div className="Home">
                {list.length > 0 ? (
                    <Row>
                        {list.map((item, index) => (
                            <Col
                                className="col"
                                xs={12}
                                sm={8}
                                md={6}
                                lg={6}
                                xl={4}
                                key={index}
                            >
                                <Card
                                    className="card"
                                    title={item.name}
                                    style={{ width: "100%" }}
                                >
                                    <span className="like-count">{likeCounts[item.id]}</span>
                                    <Image
                                        className="img"
                                        fallback="https://img.katr.tk/2023/12/87b101050aad565ae64c2d0cd83ca6da.png"
                                        src={`/img/${item.image}`}
                                        style={{ objectFit: "cover", minHeight: '12rem', maxHeight: '20rem' }}
                                    />
                                    <span className="card-price">￥{item.price}</span><br />
                                    <Button className="add-start" shape="round" onClick={() => addStar(item.id, item.favour, index)} icon={<LikeOutlined />}>{item.favour}</Button>
                                    <Button
                                        onClick={() => showModal(item)}
                                        className="add-btn"
                                        type="primary"
                                        shape="circle"
                                        icon={<PlusOutlined />}
                                    />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <p>暂无菜单数据。</p>
                )}
            </div>
            <Modal
                className="modal"
                title={listitem ? listitem.title : ""}
                open={isModalOpen}
                onOk={() => handleOk(listitem)}
                onCancel={handleCancel}
                cancelText={"取消"}
                okText={"加入购物车"}
            >
                {listitem && (
                    <>
                        <Image className="modal-img" width={"50%"} fallback="https://img.katr.tk/2023/12/87b101050aad565ae64c2d0cd83ca6da.png" src={`/img/${listitem.image}`} />
                        <div className="modal-msg">
                            <div className="card-price">价格：￥{listitem.price}</div>
                            <div>
                                数量：
                                <InputNumber
                                    size="large"
                                    min={1}
                                    max={10}
                                    defaultValue={1}
                                    onChange={onChange}
                                />
                            </div>
                            <p>{listitem.des}</p>
                        </div>
                    </>
                )}
            </Modal>
        </>
    );
};

export default Home;
