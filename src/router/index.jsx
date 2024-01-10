import { createBrowserRouter } from "react-router-dom"
import Layout from "../pages/Layout/index.jsx"
import Home from "../pages/Home/index.jsx"
import Order from "../pages/Order/index.jsx" 
import RequireAuth from "./RequireAuth.jsx"
import Table from "../pages/Table/index.jsx"
/* 路由配置 */
const router = createBrowserRouter([
    // {
    //     path: "/", // 路由路径
    //     element: <Navigate to="/client" />, // 路由组件
    // },
    {
        path: "/",
        element: <RequireAuth><Layout/></RequireAuth>,
        children: [
            {
                index: true,
                element: <Home />,
            }
        ]
    },
    {
        path: "/order",
        element: <Order />,
    }, {

    
    path: "/table",
    element: <Table />,
    },
    {
        path: "*",
        element: <div>404</div>,
    },
])

export default router
