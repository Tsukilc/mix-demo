import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Typography, Input, Select, Pagination, Empty, Spin, Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import ProductCard from '../components/ProductCard';
import { fetchProducts, searchProducts } from '../api/productApi';

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
  
  // 加载产品数据
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        let productData;
        
        if (searchQuery) {
          // 搜索产品
          productData = await searchProducts(searchQuery);
        } else {
          // 获取所有产品
          productData = await fetchProducts();
          // 这里可以根据分类或其他条件进行筛选
          if (categoryParam) {
            productData = productData.filter(p => p.category === categoryParam);
          }
        }
        
        // 这里模拟分页，实际应该由后端分页
        setProducts(productData);
        setPagination({
          ...pagination,
          total: productData.length,
        });
        setLoading(false);
      } catch (error) {
        console.error('加载产品失败', error);
        setLoading(false);
        setProducts([]);
      }
    };
    
    loadProducts();
  }, [searchQuery, categoryParam, location.search]);
  
  // 排序产品
  const sortProducts = (products, sortBy) => {
    const sortedProducts = [...products];
    switch (sortBy) {
      case 'priceAsc':
        return sortedProducts.sort((a, b) => a.price - b.price);
      case 'priceDesc':
        return sortedProducts.sort((a, b) => b.price - a.price);
      case 'newest':
        return sortedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'popular':
        return sortedProducts.sort((a, b) => b.sales - a.sales);
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
            {getCurrentPageProducts().map(product => (
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