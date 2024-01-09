import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
function RequireAuth({ children }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const id = params.get('id') // 获取路由id

  React.useEffect(() => {
    if (!id) {
      navigate('/login');
    }
  }, [id, navigate]);

  return id ? children : null;
}
export default RequireAuth;