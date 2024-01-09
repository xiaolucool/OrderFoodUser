// 导入axios
import axios from "axios"

const request = axios.create({
    baseURL: 'https://orderfood.katr.tk/api', // 前置接口
    timeout: 5000
})

export default request