import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Typography, Input, Select, Pagination, Empty, Spin, Breadcrumb, message } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import ProductCard from '../components/ProductCard';
import { fetchProducts, searchProducts } from '../api/productApi';
import { safelyParseResponse } from '../utils/apiUtils';

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 12,
    total: 0,
  });
  const [sortBy, setSortBy] = useState('recommended');
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // 从URL中提取搜索参数
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || '';
  
  // 格式化价格展示
  const formatPrice = (priceUsd) => {
    if (!priceUsd) return '¥0.00';
    const { units, nanos } = priceUsd;
    const price = units + nanos / 1000000000;
    return `¥${price.toFixed(2)}`;
  };
  
  // 加载产品数据
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        let productData = [];
        
        if (searchQuery) {
          // 搜索产品
          const searchResponse = await searchProducts(searchQuery);
          console.log('搜索原始响应:', searchResponse);
          
          // 尝试从搜索响应中获取产品列表
          if (searchResponse && typeof searchResponse === 'object') {
            if (Array.isArray(searchResponse)) {
              productData = searchResponse;
            } else if (searchResponse.products && Array.isArray(searchResponse.products)) {
              productData = searchResponse.products;
            }
          }
          
        } else {
          // 获取所有产品
          const response = await fetchProducts();
          console.log('产品列表原始响应:', response);
          
          // 尝试从响应中获取产品列表
          if (response && typeof response === 'object') {
            if (Array.isArray(response)) {
              productData = response;
            } else if (response.products && Array.isArray(response.products)) {
              productData = response.products;
            }
          }
          
          // 这里可以根据分类或其他条件进行筛选
          if (categoryParam && productData.length > 0) {
            productData = productData.filter(p => p.category === categoryParam);
          }
        }
        
        console.log('处理后的产品数据:', productData);
        
        // 这里模拟分页，实际应该由后端分页
        setProducts(productData);
        setPagination(prev => ({
          ...prev,
          total: productData.length,
        }));
      } catch (error) {
        console.error('加载产品失败:', error);
        message.error('无法加载产品数据，请稍后再试');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, [searchQuery, categoryParam, location.search]);
  
  // 排序产品
  const sortProducts = (products, sortBy) => {
    const sortedProducts = [...products];
    switch (sortBy) {
      case 'priceAsc':
        return sortedProducts.sort((a, b) => {
          const priceA = a.priceUsd ? (a.priceUsd.units + a.priceUsd.nanos / 1000000000) : 0;
          const priceB = b.priceUsd ? (b.priceUsd.units + b.priceUsd.nanos / 1000000000) : 0;
          return priceA - priceB;
        });
      case 'priceDesc':
        return sortedProducts.sort((a, b) => {
          const priceA = a.priceUsd ? (a.priceUsd.units + a.priceUsd.nanos / 1000000000) : 0;
          const priceB = b.priceUsd ? (b.priceUsd.units + b.priceUsd.nanos / 1000000000) : 0;
          return priceB - priceA;
        });
      case 'newest':
        return sortedProducts.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      case 'popular':
        return sortedProducts.sort((a, b) => (b.sales || 0) - (a.sales || 0));
      default:
        return sortedProducts; // 默认推荐排序
    }
  };
  
  // 处理搜索
  const handleSearch = (value) => {
    const params = new URLSearchParams(location.search);
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    navigate(`/products?${params.toString()}`);
  };
  
  // 处理排序变化
  const handleSortChange = (value) => {
    setSortBy(value);
  };
  
  // 处理分页变化
  const handlePageChange = (page, pageSize) => {
    setPagination({
      ...pagination,
      current: page,
      pageSize: pageSize,
    });
  };
  
  // 获取当前分页的产品
  const getCurrentPageProducts = () => {
    const sortedProducts = sortProducts(products, sortBy);
    const { current, pageSize } = pagination;
    const startIndex = (current - 1) * pageSize;
    return sortedProducts.slice(startIndex, startIndex + pageSize);
  };
  
  // 处理产品数据，添加格式化的价格
  const processedProducts = getCurrentPageProducts().map(product => ({
    ...product,
    formattedPrice: formatPrice(product.priceUsd)
  }));
  
  return (
    <div className="product-list-page">
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item href="/">
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          {searchQuery ? `搜索结果: ${searchQuery}` : categoryParam ? `分类: ${categoryParam}` : '全部商品'}
        </Breadcrumb.Item>
      </Breadcrumb>
      
      <Card style={{ marginBottom: 16 }}>
        <Title level={4}>
          {searchQuery 
            ? `搜索 "${searchQuery}" 的结果` 
            : categoryParam 
              ? `分类: ${categoryParam}` 
              : '全部商品'}
        </Title>
        
        <Row gutter={16} align="middle">
          <Col xs={24} md={8}>
            <Search 
              placeholder="搜索商品" 
              defaultValue={searchQuery}
              onSearch={handleSearch} 
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} md={8}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: 8 }}>排序:</span>
              <Select 
                style={{ width: 150 }} 
                defaultValue={sortBy}
                onChange={handleSortChange}
              >
                <Option value="recommended">推荐</Option>
                <Option value="priceAsc">价格从低到高</Option>
                <Option value="priceDesc">价格从高到低</Option>
                <Option value="newest">最新</Option>
                <Option value="popular">最热销</Option>
              </Select>
            </div>
          </Col>
        </Row>
      </Card>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" />
        </div>
      ) : products.length > 0 ? (
        <>
          <Row gutter={[16, 16]}>
            {processedProducts.map(product => (
              <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
          
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Pagination 
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={handlePageChange}
              showSizeChanger
              showQuickJumper
              showTotal={(total) => `共 ${total} 个商品`}
            />
          </div>
        </>
      ) : (
        <Empty 
          description={searchQuery ? `没有找到 "${searchQuery}" 相关的商品` : "暂无商品"} 
          style={{ padding: '40px 0' }}
        />
      )}
    </div>
  );
};

export default ProductListPage; 