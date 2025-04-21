import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, message } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { addItemToCart } from '../api/cartApi';

const { Meta } = Card;

const ProductCard = ({ product }) => {
  const userId = '123'; // 模拟用户ID，实际应从认证系统获取
  const defaultUrl = 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch-white?wid=5120&hei=2880&fmt=webp&qlt=70&.v=UXp1U3VDY3IyR1hNdHZwdFdOLzg1V0tFK1lhSCtYSGRqMUdhR284NTN4OWhabGVFdVhnaExpMWhzbVh0SzhIT09MekhWSGZtV1pvV240QzNuTk80VXhseHVZcEw1SmhqcElaQkJMTm9FMytjRGRjd0V1bkY3a0xXbUtlY3VlTmc&traceId=1/300?text=无图片'
  
  // 确保产品数据的安全访问
  const safeProduct = product || {};
  const {
    id = '',
    name = '未知商品',
    priceUsd = { units: 0, nanos: 0 },
    formattedPrice = '¥0.00',
    description = '',
    // 适配图片路径，注意判断不同的图片字段
    picture = defaultUrl,
    imageUrl = defaultUrl
  } = safeProduct;
  
  // 获取实际使用的图片URL
  const actualImageUrl = picture || imageUrl;
  
  const handleAddToCart = async () => {
    try {
      // 获取实际价格 - 确保使用正确的价格数据结构
      const price = priceUsd ? (priceUsd.units + priceUsd.nanos / 1000000000) : 0;
      
      const cartItem = {
        productId: id,
        name: name,
        price: price,
        formattedPrice: formattedPrice, // 添加格式化价格到购物车项
        quantity: 1,
        imageUrl: actualImageUrl
      };
      
      await addItemToCart(userId, cartItem);
      message.success('已添加到购物车');
    } catch (error) {
      console.error('添加到购物车失败:', error);
      message.error('添加到购物车失败');
    }
  };

  return (
    <Card
      hoverable
      className="product-card"
      cover={
        <Link to={`/products/${id}`}>
          <img 
            alt={name} 
            src={actualImageUrl} 
            className="product-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/300?text=图片加载失败';
            }}
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
      <Link to={`/products/${id}`}>
        <Meta
          title={name}
          description={
            <div>
              <div style={{ color: '#ff4d4f', fontWeight: 'bold', fontSize: '16px' }}>
                {formattedPrice}
              </div>
              <div style={{ color: '#999', fontSize: '12px' }}>
                {description}
              </div>
            </div>
          }
        />
      </Link>
    </Card>
  );
};

export default ProductCard; 