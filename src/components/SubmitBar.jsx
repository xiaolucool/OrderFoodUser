import { Button } from 'antd'

const SubmitBar = ({ onSubmit, onCancel }) => {
    return (
        <>
            <div>
                <Button onClick={onCancel}>取消</Button>
                <Button onClick={onSubmit}>提交</Button>
            </div>
        </>

    )
}
export default SubmitBar
