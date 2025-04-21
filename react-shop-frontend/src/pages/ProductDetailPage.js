import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Row, 
  Col, 
  Typography, 
  Button, 
  InputNumber, 
  Tabs, 
  Breadcrumb, 
  Image, 
  Spin,
  Card,
  Divider,
  message 
} from 'antd';
import { 
  HomeOutlined, 
  ShoppingCartOutlined, 
  HeartOutlined,
  ShareAltOutlined 
} from '@ant-design/icons';
import { fetchProductById } from '../api/productApi';
import { addItemToCart } from '../api/cartApi';
import { safelyParseResponse } from '../utils/apiUtils';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const userId = '123'; // 模拟用户ID，实际应该从认证系统获取
  
  // 格式化价格展示
  const formatPrice = (priceUsd) => {
    if (!priceUsd) return '¥0.00';
    const { units, nanos } = priceUsd;
    const price = units + nanos / 1000000000;
    return `¥${price.toFixed(2)}`;
  };
  
  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const response = await fetchProductById(id);
        console.log('商品详情原始响应:', response);
        
        if (response && typeof response === 'object') {
          setProduct(response);
        } else {
          console.warn('产品数据格式不正确:', response);
          message.error('无法加载产品详情');
          setProduct(null);
        }
      } catch (error) {
        console.error('加载产品详情失败:', error);
        message.error('加载产品详情失败');
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    
    loadProduct();
  }, [id]);
  
  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      // 获取实际价格
      const price = product.priceUsd ? 
        (product.priceUsd.units + product.priceUsd.nanos / 1000000000) : 0;
      
      const cartItem = {
        productId: product.id,
        name: product.name,
        price: price,
        quantity: quantity,
        imageUrl: product.picture || 'https://via.placeholder.com/300'
      };
      
      await addItemToCart(userId, cartItem);
      message.success('已添加到购物车');
    } catch (error) {
      console.error('添加到购物车失败:', error);
      message.error('添加到购物车失败');
    }
  };
  
  const handleBuyNow = async () => {
    try {
      await handleAddToCart();
      navigate('/checkout');
    } catch (error) {
      // 错误处理已在handleAddToCart中完成
    }
  };
  
  const handleQuantityChange = (value) => {
    setQuantity(value);
  };
  
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    );
  }
  
  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Title level={4}>产品不存在</Title>
        <Button type="primary" onClick={() => navigate('/products')}>
          返回商品列表
        </Button>
      </div>
    );
  }
  
  // 获取价格显示
  const displayPrice = formatPrice(product.priceUsd);
  // 获取图片URL
  const imageUrl = product.picture || 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch-white?wid=5120&hei=2880&fmt=webp&qlt=70&.v=UXp1U3VDY3IyR1hNdHZwdFdOLzg1V0tFK1lhSCtYSGRqMUdhR284NTN4OWhabGVFdVhnaExpMWhzbVh0SzhIT09MekhWSGZtV1pvV240QzNuTk80VXhseHVZcEw1SmhqcElaQkJMTm9FMytjRGRjd0V1bkY3a0xXbUtlY3VlTmc&traceId=1';
  
  return (
    <div className="product-detail-page">
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <Link to="/">
            <HomeOutlined />
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/products">商品</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{product.name}</Breadcrumb.Item>
      </Breadcrumb>
      
      <Card>
        <Row gutter={[32, 16]}>
          <Col xs={24} md={12}>
            <Image 
              src={imageUrl}
              alt={product.name}
              style={{ width: '100%', maxHeight: '500px', objectFit: 'contain' }}
              fallback="https://via.placeholder.com/500?text=图片加载失败"
            />
            <Row gutter={8} style={{ marginTop: 8 }}>
              {[1, 2, 3, 4].map((i) => (
                <Col span={6} key={i}>
                  <Image 
                    src={`https://via.placeholder.com/100?text=图片${i}`}
                    style={{ width: '100%', cursor: 'pointer' }}
                  />
                </Col>
              ))}
            </Row>
          </Col>
          
          <Col xs={24} md={12}>
            <Title level={3}>{product.name}</Title>
            <Divider />
            
            <div className="price-section" style={{ marginBottom: 16 }}>
              <Text type="secondary">价格:</Text>
              <br />
              <Text style={{ fontSize: 24, color: '#ff4d4f', fontWeight: 'bold' }}>
                {displayPrice}
              </Text>
              {product.originalPrice && (
                <Text delete style={{ marginLeft: 8, color: '#999' }}>
                  ¥{product.originalPrice}
                </Text>
              )}
            </div>
            
            <div className="quantity-section" style={{ marginBottom: 24 }}>
              <Text style={{ marginRight: 16 }}>数量:</Text>
              <InputNumber 
                min={1} 
                defaultValue={1} 
                onChange={handleQuantityChange}
                style={{ width: 120 }}
              />
              <Text type="secondary" style={{ marginLeft: 16 }}>
                库存 {product.availableQuantity || 100} 件
              </Text>
            </div>
            
            <div className="action-section">
              <Button 
                type="primary" 
                icon={<ShoppingCartOutlined />}
                size="large"
                onClick={handleAddToCart}
                style={{ marginRight: 16 }}
              >
                加入购物车
              </Button>
              <Button 
                type="danger" 
                size="large"
                onClick={handleBuyNow}
              >
                立即购买
              </Button>
              <div style={{ marginTop: 16 }}>
                <Button 
                  type="text" 
                  icon={<HeartOutlined />}
                  onClick={() => message.info('收藏功能暂未实现')}
                  style={{ marginRight: 16 }}
                >
                  收藏
                </Button>
                <Button 
                  type="text" 
                  icon={<ShareAltOutlined />}
                  onClick={() => message.info('分享功能暂未实现')}
                >
                  分享
                </Button>
              </div>
            </div>
          </Col>
        </Row>
        
        <Divider style={{ margin: '32px 0' }} />
        
        <Tabs defaultActiveKey="details">
          <TabPane tab="商品详情" key="details">
            <div dangerouslySetInnerHTML={{ __html: product.description || '<p>暂无详情</p>' }} />
          </TabPane>
          <TabPane tab="规格参数" key="specs">
            <p>品牌: {product.brand || '未知'}</p>
            <p>产地: {product.origin || '未知'}</p>
            <p>重量: {product.weight || '未知'}</p>
            <p>尺寸: {product.dimensions || '未知'}</p>
          </TabPane>
          <TabPane tab="评价(0)" key="reviews">
            <p>暂无评价</p>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default ProductDetailPage;