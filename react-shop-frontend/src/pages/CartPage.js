import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Row, 
  Col, 
  Table, 
  Button, 
  InputNumber, 
  Empty, 
  Card, 
  message, 
  Divider, 
  Spin, 
  Typography 
} from 'antd';
import { 
  ShoppingOutlined, 
  DeleteOutlined, 
  ArrowLeftOutlined, 
  ShoppingCartOutlined 
} from '@ant-design/icons';
import { fetchCart, updateCartItemQuantity, removeItemFromCart } from '../api/cartApi';
import { safelyParseResponse } from '../utils/apiUtils';

const { Title, Text } = Typography;

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const userId = '123'; // 模拟用户ID

  // 获取购物车数据
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setLoading(true);
        const response = await fetchCart(userId);
        console.log('购物车数据:', response);
        
        // 处理返回的数据
        if (response && response.items) {
          const items = Array.isArray(response.items) ? response.items : [];
          const itemsWithKeys = items.map(item => ({
            ...item,
            key: item.productId
          }));
          setCartItems(itemsWithKeys);
        } else {
          setError('获取购物车数据失败');
          setCartItems([]);
        }
      } catch (err) {
        console.error('购物车数据加载错误:', err);
        setError('购物车数据加载错误');
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [userId]);

  // 更新购物车项数量
  const handleQuantityChange = async (record, quantity) => {
    if (quantity < 1) return;
    
    try {
      await updateCartItemQuantity(userId, record.productId, quantity);
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.productId === record.productId 
            ? { ...item, quantity } 
            : item
        )
      );
    } catch (err) {
      console.error('更新商品数量失败:', err);
      message.error('更新商品数量失败');
    }
  };

  // 从购物车中移除商品
  const handleRemoveItem = async (productId) => {
    try {
      await removeItemFromCart(userId, productId);
      setCartItems(prevItems => 
        prevItems.filter(item => item.productId !== productId)
      );
      message.success('商品已从购物车移除');
    } catch (err) {
      console.error('移除商品失败:', err);
      message.error('移除商品失败');
    }
  };

  // 计算购物车总价
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  // 结账
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      message.warning('购物车为空');
      return;
    }
    
    // 跳转到结账页
    navigate('/checkout');
  };

  // 表格列配置
  const columns = [
    {
      title: '商品',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src={record.imageUrl} 
            alt={text}
            style={{ width: '60px', height: '60px', marginRight: '10px', objectFit: 'cover' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/60?text=无图片';
            }}
          />
          <Link to={`/products/${record.productId}`}>{text}</Link>
        </div>
      ),
    },
    {
      title: '单价',
      dataIndex: 'formattedPrice',
      key: 'price',
      render: (text, record) => (
        <Text type="danger">{text || `¥${record.price.toFixed(2)}`}</Text>
      ),
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (text, record) => (
        <InputNumber
          min={1}
          value={text}
          onChange={(value) => handleQuantityChange(record, value)}
        />
      ),
    },
    {
      title: '小计',
      key: 'subtotal',
      render: (_, record) => {
        const subtotal = record.price * record.quantity;
        return <Text type="danger">¥{subtotal.toFixed(2)}</Text>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="text" 
          danger 
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveItem(record.productId)}
        >
          删除
        </Button>
      ),
    },
  ];

  // 空购物车视图
  const renderEmptyCart = () => (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description="购物车为空"
    >
      <Button 
        type="primary" 
        icon={<ShoppingOutlined />} 
        onClick={() => navigate('/')}
      >
        去购物
      </Button>
    </Empty>
  );

  return (
    <div className="cart-page">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title level={2}>
            <ShoppingCartOutlined /> 购物车
          </Title>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate(-1)}
          >
            继续购物
          </Button>
        </Col>
        
        <Col span={24}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Spin size="large" />
              <div style={{ marginTop: '16px' }}>正在加载购物车...</div>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#ff4d4f' }}>
              {error}
            </div>
          ) : cartItems.length > 0 ? (
            <>
              <Table 
                columns={columns} 
                dataSource={cartItems}
                pagination={false}
                rowKey="key"
              />
              
              <Divider />
              
              <Card style={{ marginTop: '16px' }}>
                <Row justify="end" align="middle">
                  <Col>
                    <div style={{ textAlign: 'right', marginBottom: '16px' }}>
                      <Text>商品总数：{cartItems.reduce((acc, item) => acc + item.quantity, 0)} 件</Text>
                      <br />
                      <Text strong style={{ fontSize: '18px' }}>
                        合计: <span style={{ color: '#ff4d4f', fontSize: '20px' }}>¥{calculateTotal().toFixed(2)}</span>
                      </Text>
                    </div>
                    <Button 
                      type="primary" 
                      size="large" 
                      onClick={handleCheckout}
                      style={{ minWidth: '150px' }}
                    >
                      结算
                    </Button>
                  </Col>
                </Row>
              </Card>
            </>
          ) : (
            renderEmptyCart()
          )}
        </Col>
      </Row>
    </div>
  );
};

export default CartPage; 