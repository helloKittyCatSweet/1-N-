import jwt from 'jsonwebtoken';
const { verify } = jwt;

export default function(req, res, next) {
  // 从请求头获取令牌
  const token = req.header('x-auth-token');

  // 检查是否有令牌
  if (!token) {
    return res.status(401).json({ msg: '没有令牌，授权失败' });
  }

  try {
    // 验证令牌
    const decoded = verify(token, process.env.JWT_SECRET || 'mysecrettoken');

    // 将用户信息添加到请求对象
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: '令牌无效' });
  }
};