import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Menu, Input, Badge, Drawer, List, Button, Avatar, message } from 'antd';
import { ShoppingCartOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons';
import { fetchCart } from '../api/cartApi';

const { Header } = Layout;
const { Search } = Input;

const MainHeader = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [] });
  const [cartVisible, setCartVisible] = useState(false);
  const userId = '123'; // 模拟用户ID，实际应该从用户认证系统获取
  
  useEffect(() => {
    // 组件挂载时加载购物车数据
    loadCart();
  }, []);
  
  const loadCart = async () => {
    try {
      const cartData = await fetchCart(userId);
      setCart(cartData);
    } catch (error) {
      console.error('加载购物车失败', error);
      // 显示空购物车
      setCart({ items: [] });
    }
  };
  
  const showCart = () => {
    // 打开购物车前重新获取最新数据
    loadCart();
    setCartVisible(true);
  };
  
  const hideCart = () => {
    setCartVisible(false);
  };
  
  const onSearch = (value) => {
    if (value.trim()) {
      navigate(`/products?search=${encodeURIComponent(value.trim())}`);
    }
  };
  
  const getTotalItems = () => {
    return cart.items.reduce((total, item) => total + (item.quantity || 0), 0);
  };
  
  const getTotalPrice = () => {
    return cart.items.reduce((total, item) => total + ((item.price || 0) * (item.quantity || 0)), 0);
  };
  
  return (
    <>
      <Header className="header" style={{ position: 'fixed', zIndex: 1, width: '100%', display: 'flex', alignItems: 'center' }}>
        <div className="logo" style={{ width: 120 }}>
          <Link to="/">
            <h1 style={{ color: 'white', margin: 0 }}>商城</h1>
          </Link>
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['home']}
          style={{ flex: 1 }}
        >
          <Menu.Item key="home">
            <Link to="/">首页</Link>
          </Menu.Item>
          <Menu.Item key="products">
            <Link to="/products">商品</Link>
          </Menu.Item>
        </Menu>
        <Search 
          placeholder="搜索商品" 
          onSearch={onSearch} 
          style={{ width: 200, marginRight: 20 }}
        />
        <div>
          <Badge count={getTotalItems()} showZero>
            <Button 
              type="primary" 
              shape="circle" 
              icon={<ShoppingCartOutlined />} 
              onClick={showCart}
              style={{ marginRight: 16 }}
            />
          </Badge>
          <Button 
            type="default" 
            shape="circle" 
            icon={<UserOutlined />} 
            style={{ marginRight: 8 }}
          />
        </div>
      </Header>
      
      <Drawer
        title="购物车"
        placement="right"
        onClose={hideCart}
        visible={cartVisible}
        width={350}
        className="cart-drawer"
        footer={
          <div className="cart-footer">
            <div style={{ marginBottom: 16 }}>
              总计: ¥{getTotalPrice().toFixed(2)}
            </div>
            <Button 
              type="primary" 
              disabled={cart.items.length === 0}
              onClick={() => {
                navigate('/checkout');
                hideCart();
              }}
              block
            >
              结算
            </Button>
          </div>
        }
      >
        {cart.items.length > 0 ? (
          <List
            className="cart-list"
            itemLayout="horizontal"
            dataSource={cart.items}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <a key="delete" onClick={() => message.info('功能尚未实现')}>删除</a>
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={item.imageUrl} shape="square" size={64} />}
                  title={item.name}
                  description={
                    <div>
                      <div>¥{item.price} × {item.quantity}</div>
                      <div>小计: ¥{(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <div style={{ padding: 24, textAlign: 'center' }}>
            购物车为空
          </div>
        )}
      </Drawer>
    </>
  );
};

export default MainHeader; 