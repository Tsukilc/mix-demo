import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Carousel, Card, Typography, Button, Spin } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../api/productApi';

const { Title } = Typography;

const HomePage = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await fetchProducts();
        // 这里模拟获取精选产品，实际应该由后端提供专门的API
        setFeaturedProducts(products.slice(0, 8));
        setLoading(false);
      } catch (error) {
        console.error('加载产品失败', error);
        setLoading(false);
        setFeaturedProducts([]);
      }
    };
    
    loadProducts();
  }, []);
  
  // 轮播图内容
  const carouselItems = [
    {
      id: 1,
      title: '夏季大促',
      description: '全场商品低至5折',
      imageUrl: 'https://via.placeholder.com/1200x400?text=夏季大促',
    },
    {
      id: 2,
      title: '新品上市',
      description: '限时抢购',
      imageUrl: 'https://via.placeholder.com/1200x400?text=新品上市',
    },
    {
      id: 3,
      title: '会员专享',
      description: '会员专享优惠',
      imageUrl: 'https://via.placeholder.com/1200x400?text=会员专享',
    },
  ];

  return (
    <div className="homepage">
      <Carousel autoplay>
        {carouselItems.map(item => (
          <div key={item.id}>
            <div 
              style={{ 
                height: '400px', 
                background: `url(${item.imageUrl}) center center no-repeat`,
                backgroundSize: 'cover',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <div style={{ maxWidth: '50%', padding: '0 50px' }}>
                <Title level={2} style={{ color: '#fff', textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>
                  {item.title}
                </Title>
                <Title level={4} style={{ color: '#fff', textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>
                  {item.description}
                </Title>
                <Button type="primary" size="large" onClick={() => navigate('/products')}>
                  立即查看
                </Button>
              </div>
            </div>
          </div>
        ))}
      </Carousel>

      <div style={{ margin: '40px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <Title level={3}>精选商品</Title>
          <Button 
            type="link" 
            onClick={() => navigate('/products')}
            icon={<RightOutlined />}
          >
            查看全部
          </Button>
        </div>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" />
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            {featuredProducts.length > 0 ? (
              featuredProducts.map(product => (
                <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                  <ProductCard product={product} />
                </Col>
              ))
            ) : (
              <Col span={24}>
                <Card style={{ textAlign: 'center' }}>
                  暂无商品
                </Card>
              </Col>
            )}
          </Row>
        )}
      </div>
      
      {/* 促销专区 */}
      <div style={{ margin: '40px 0' }}>
        <Title level={3}>促销专区</Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card
              hoverable
              cover={<img alt="促销1" src="https://via.placeholder.com/400x200?text=限时特惠" />}
              onClick={() => navigate('/products?category=sale')}
            >
              <Card.Meta title="限时特惠" description="限时特价商品，错过再等一年" />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card
              hoverable
              cover={<img alt="促销2" src="https://via.placeholder.com/400x200?text=新品上市" />}
              onClick={() => navigate('/products?category=new')}
            >
              <Card.Meta title="新品上市" description="最新上架商品，潮流尖货" />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card
              hoverable
              cover={<img alt="促销3" src="https://via.placeholder.com/400x200?text=热卖商品" />}
              onClick={() => navigate('/products?category=hot')}
            >
              <Card.Meta title="热卖商品" description="大家都在买，好评如潮" />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default HomePage; 