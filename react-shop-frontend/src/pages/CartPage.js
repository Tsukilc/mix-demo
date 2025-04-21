import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Table,
  Button,
  InputNumber,
  Typography,
  Card,
  Breadcrumb,
  Empty,
  message,
  Popconfirm,
  Image,
  Row,
  Col,
  Divider
} from 'antd';
import { 
  HomeOutlined,
  DeleteOutlined,
  ShoppingOutlined
} from '@ant-design/icons';
import { fetchCart, updateCartItemQuantity, removeItemFromCart, emptyCart } from '../api/cartApi';

const { Title, Text } = Typography;

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const userId = '123'; // 模拟用户ID，实际应从认证系统获取
  
  useEffect(() => {
    loadCart();
  }, []);
  
  const loadCart = async () => {
    setLoading(true);
    try {
      const cartData = await fetchCart(userId);
      setCart(cartData);
    } catch (error) {
      console.error('加载购物车失败', error);
      message.error('加载购物车失败');
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };
  
  const handleQuantityChange = async (itemId, quantity) => {
    try {
      await updateCartItemQuantity(userId, itemId, quantity);
      // 更新本地状态
      setCart(prevCart => ({
        ...prevCart,
        items: prevCart.items.map(item => 
          item.productId === itemId ? { ...item, quantity } : item
        )
      }));
    } catch (error) {
      console.error('更新商品数量失败', error);
      message.error('更新商品数量失败');
    }
  };
  
  const handleRemoveItem = async (itemId) => {
    try {
      await removeItemFromCart(userId, itemId);
      // 更新本地状态
      setCart(prevCart => ({
        ...prevCart,
        items: prevCart.items.filter(item => item.productId !== itemId)
      }));
      message.success('商品已从购物车中移除');
    } catch (error) {
      console.error('移除商品失败', error);
      message.error('移除商品失败');
    }
  };
  
  const handleEmptyCart = async () => {
    try {
      await emptyCart(userId);
      setCart({ items: [] });
      setSelectedItems([]);
      message.success('购物车已清空');
    } catch (error) {
      console.error('清空购物车失败', error);
      message.error('清空购物车失败');
    }
  };
  
  const handleSelectionChange = (selectedRowKeys) => {
    setSelectedItems(selectedRowKeys);
  };
  
  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      message.warning('请选择至少一件商品');
      return;
    }
    
    navigate('/checkout');
  };
  
  const calculateTotal = () => {
    if (!cart.items || cart.items.length === 0) return 0;
    
    return cart.items
      .filter(item => selectedItems.includes(item.productId))
      .reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const columns = [
    {
      title: '商品',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Image 
            src={record.imageUrl || 'https://via.placeholder.com/80'}
            alt={text}
            width={80}
            height={80}
            style={{ objectFit: 'cover', marginRight: 16 }}
          />
          <Link to={`/products/${record.productId}`}>
            {text}
          </Link>
        </div>
      ),
    },
    {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
      align: 'center',
      render: price => `¥${price.toFixed(2)}`,
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      render: (quantity, record) => (
        <InputNumber
          min={1}
          value={quantity}
          onChange={(value) => handleQuantityChange(record.productId, value)}
        />
      ),
    },
    {
      title: '小计',
      key: 'subtotal',
      align: 'center',
      render: record => `¥${(record.price * record.quantity).toFixed(2)}`,
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Popconfirm
          title="确定要移除这件商品吗？"
          onConfirm={() => handleRemoveItem(record.productId)}
          okText="确定"
          cancelText="取消"
        >
          <Button 
            type="text" 
            danger
            icon={<DeleteOutlined />}
          >
            删除
          </Button>
        </Popconfirm>
      ),
    },
  ];
  
  return (
    <div className="cart-page">
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <Link to="/">
            <HomeOutlined />
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>购物车</Breadcrumb.Item>
      </Breadcrumb>
      
      <Title level={3}>我的购物车</Title>
      
      <Card loading={loading}>
        {cart.items.length > 0 ? (
          <>
            <Table
              rowSelection={{
                type: 'checkbox',
                selectedRowKeys: selectedItems,
                onChange: handleSelectionChange,
              }}
              columns={columns}
              dataSource={cart.items.map(item => ({ ...item, key: item.productId }))}
              pagination={false}
              rowKey="productId"
            />
            
            <Divider />
            
            <Row justify="space-between" align="middle">
              <Col>
                <Button 
                  onClick={() => navigate('/products')}
                  icon={<ShoppingOutlined />}
                >
                  继续购物
                </Button>
                <Popconfirm
                  title="确定要清空购物车吗？"
                  onConfirm={handleEmptyCart}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button 
                    style={{ marginLeft: 16 }}
                    danger
                  >
                    清空购物车
                  </Button>
                </Popconfirm>
              </Col>
              <Col>
                <div style={{ textAlign: 'right' }}>
                  <Text style={{ marginRight: 16 }}>
                    已选商品 <Text strong>{selectedItems.length}</Text> 件
                  </Text>
                  <Text>
                    合计: <Text style={{ fontSize: 18, color: '#ff4d4f' }} strong>¥{calculateTotal().toFixed(2)}</Text>
                  </Text>
                  <Button 
                    type="primary" 
                    size="large"
                    style={{ marginLeft: 16 }}
                    onClick={handleCheckout}
                    disabled={selectedItems.length === 0}
                  >
                    结算
                  </Button>
                </div>
              </Col>
            </Row>
          </>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="购物车是空的"
          >
            <Button 
              type="primary" 
              onClick={() => navigate('/products')}
            >
              去购物
            </Button>
          </Empty>
        )}
      </Card>
    </div>
  );
};

export default CartPage; 