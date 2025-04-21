import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, message } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { addItemToCart } from '../api/cartApi';

const { Meta } = Card;

const ProductCard = ({ product }) => {
  const userId = '123'; // 模拟用户ID，实际应从认证系统获取
  
  const handleAddToCart = async () => {
    try {
      await addItemToCart(userId, {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        imageUrl: product.imageUrl
      });
      message.success('已添加到购物车');
    } catch (error) {
      message.error('添加到购物车失败');
    }
  };

  return (
    <Card
      hoverable
      className="product-card"
      cover={
        <Link to={`/products/${product.id}`}>
          <img 
            alt={product.name} 
            src={product.imageUrl || 'https://via.placeholder.com/300'} 
            className="product-image"
          />
        </Link>
      }
      actions={[
        <Button 
          icon={<ShoppingCartOutlined />} 
          onClick={handleAddToCart}
          type="primary"
        >
          加入购物车
        </Button>
      ]}
    >
      <Link to={`/products/${product.id}`}>
        <Meta
          title={product.name}
          description={
            <div>
              <div style={{ color: '#ff4d4f', fontWeight: 'bold', fontSize: '16px' }}>
                ¥{product.price}
              </div>
              <div style={{ color: '#999', fontSize: '12px' }}>
                {product.description}
              </div>
            </div>
          }
        />
      </Link>
    </Card>
  );
};

export default ProductCard; 