import React, { useEffect, useState } from 'react';
import { Row, Col, Typography, Carousel, Card, Button, Spin, Empty, message } from 'antd';
import { Link } from 'react-router-dom';
import { ArrowRightOutlined } from '@ant-design/icons';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../api/productApi';
import { safelyParseResponse, formatApiError } from '../utils/apiUtils';

const { Title } = Typography;

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 格式化价格展示
  const formatPrice = (priceUsd) => {
    if (!priceUsd) return '¥0.00';
    const { units, nanos } = priceUsd;
    const price = units + nanos / 1000000000;
    return `¥${price.toFixed(2)}`;
  };

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const response = await fetchProducts();
        console.log('产品原始响应:', response);
        
        // 使用安全解析函数处理响应
        const products = safelyParseResponse(response, []);
        
        // 尝试从响应中获取产品列表
        let productData = [];
        if (Array.isArray(products)) {
          productData = products;
        } else if (products && products.products && Array.isArray(products.products)) {
          productData = products.products;
        }
        
        console.log('处理后的产品数据:', productData);
        
        // 添加格式化的价格
        const processedProducts = productData.map(product => ({
          ...product,
          formattedPrice: formatPrice(product.priceUsd)
        }));
        
        // 按照不同条件筛选产品
        if (processedProducts.length > 0) {
          // 特色商品 - 随机选择
          const shuffled = [...processedProducts].sort(() => 0.5 - Math.random());
          setFeaturedProducts(shuffled.slice(0, 4));
          
          // 新品 - 按创建时间排序
          const sorted = [...processedProducts].sort((a, b) => 
            new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
          );
          setNewArrivals(sorted.slice(0, 4));
          
          // 畅销品 - 按销量排序
          const popular = [...processedProducts].sort((a, b) => 
            (b.sales || 0) - (a.sales || 0)
          );
          setBestSellers(popular.slice(0, 4));
        }
      } catch (error) {
        console.error('加载产品失败:', error);
        const errorMessage = formatApiError(error);
        message.error(`无法加载产品: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // 轮播图配置
  const carouselSettings = {
    autoplay: true,
    dots: true,
  };

  const defaultImage = 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch-white?wid=5120&hei=2880&fmt=webp&qlt=70&.v=UXp1U3VDY3IyR1hNdHZwdFdOLzg1V0tFK1lhSCtYSGRqMUdhR284NTN4OWhabGVFdVhnaExpMWhzbVh0SzhIT09MekhWSGZtV1pvV240QzNuTk80VXhseHVZcEw1SmhqcElaQkJMTm9FMytjRGRjd0V1bkY3a0xXbUtlY3VlTmc&traceId=1'

  // 轮播图内容
  const banners = [
    {
      image: defaultImage,
      title: '夏季大促销',
      description: '全场商品低至5折',
      link: '/products?category=summer',
    },
    {
      image: defaultImage,
      title: '新品上市',
      description: '发现最新潮流单品',
      link: '/products?category=new',
    },
    {
      image: defaultImage,
      title: '限时抢购',
      description: '每天10点开始',
      link: '/products?category=flash',
    },
  ];

  return (
    <div className="home-page">
      {/* 轮播图 */}
      <Carousel {...carouselSettings} className="home-carousel">
        {banners.map((banner, index) => (
          <div key={index}>
            <div
              className="carousel-item"
              style={{
                backgroundImage: `url(${banner.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '400px',
                position: 'relative',
              }}
            >
              <div
                className="carousel-content"
                style={{
                  position: 'absolute',
                  bottom: '50px',
                  left: '50px',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  padding: '20px',
                  borderRadius: '5px',
                  maxWidth: '400px',
                }}
              >
                <Title level={2}>{banner.title}</Title>
                <p>{banner.description}</p>
                <Link to={banner.link}>
                  <Button type="primary" size="large">
                    查看详情
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </Carousel>

      {/* 特色商品 */}
      <div className="section" style={{ margin: '40px 0' }}>
        <div className="section-header" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={3}>特色商品</Title>
          <Link to="/products">
            <Button type="link">
              查看全部 <ArrowRightOutlined />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" />
          </div>
        ) : featuredProducts.length > 0 ? (
          <Row gutter={[16, 16]}>
            {featuredProducts.map(product => (
              <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        ) : (
          <Empty description="暂无特色商品" />
        )}
      </div>

      {/* 新品上市 */}
      <div className="section" style={{ margin: '40px 0' }}>
        <div className="section-header" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={3}>新品上市</Title>
          <Link to="/products?sortBy=newest">
            <Button type="link">
              查看全部 <ArrowRightOutlined />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" />
          </div>
        ) : newArrivals.length > 0 ? (
          <Row gutter={[16, 16]}>
            {newArrivals.map(product => (
              <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        ) : (
          <Empty description="暂无新品" />
        )}
      </div>

      {/* 畅销商品 */}
      <div className="section" style={{ margin: '40px 0' }}>
        <div className="section-header" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={3}>畅销商品</Title>
          <Link to="/products?sortBy=popular">
            <Button type="link">
              查看全部 <ArrowRightOutlined />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" />
          </div>
        ) : bestSellers.length > 0 ? (
          <Row gutter={[16, 16]}>
            {bestSellers.map(product => (
              <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        ) : (
          <Empty description="暂无畅销商品" />
        )}
      </div>
    </div>
  );
};

export default HomePage;
