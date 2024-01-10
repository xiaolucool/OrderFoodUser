import { Card, InputNumber, Button } from "antd"
import { useNavigate } from "react-router-dom"
import './index.css'

const Table = () => {
    // 路由
    const navigate = useNavigate();
    let num = 1;
    const onChange = (value) => {
        num = value;
      };
    const onGetTable = () => {
        navigate(`/?id=${num}`)
    }
    return (
        <>
            <div className="table">
                <Card
                    className="card-table"
                    title="桌号选择"
                    bordered={false}
                >
                  请输入桌号：<InputNumber min={1} max={100} defaultValue={1} onChange={onChange} />
                  <Button onClick={() => onGetTable()}>确认</Button> 
                </Card>
            </div>
        </>
    )
}

export default Table