import { Button } from 'antd'
const Await = () => {
    const onSubmit = () => { 
        console.log('提交')
     }
    return (
        <>
        <div className="SubmitBar">
            <div>
                合计：<span className="prace">￥30.<span>05</span></span>
                <Button type="primary" danger shape="round" onClick={onSubmit}>去结算</Button>
            </div>
        </div>
        </>
    )
}

export default Await