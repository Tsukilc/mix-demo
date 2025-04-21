import axios from 'axios';
import { mockProducts } from '../utils/mockData';

const API_BASE_URL = 'http://10.21.32.14:80/api';

// 创建一个axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // 超时时间
  timeout: 10000,
});

// 是否使用模拟数据(在正式环境中设置为false)
const USE_MOCK_DATA = process.env.NODE_ENV === 'development';

// 获取所有产品列表
export const fetchProducts = async () => {
  try {
    const response = await apiClient.get('/products');
    return response.data;
  } catch (error) {
    console.error('获取产品列表失败:', error);
    
    // 如果允许使用模拟数据并且是开发环境，返回模拟数据
    if (USE_MOCK_DATA) {
      console.warn('使用模拟产品数据');
      return mockProducts;
    }
    
    throw error;
  }
};

// 获取单个产品详情
export const fetchProductById = async (productId) => {
  try {
    const response = await apiClient.get(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error(`获取产品ID:${productId}的详情失败:`, error);
    
    // 如果允许使用模拟数据并且是开发环境，返回模拟数据中的对应产品
    if (USE_MOCK_DATA) {
      console.warn(`使用模拟数据获取产品ID:${productId}`);
      const product = mockProducts.find(p => p.id === productId);
      if (product) {
        return product;
      }
    }
    
    throw error;
  }
};

// 搜索产品
export const searchProducts = async (query) => {
  try {
    const response = await apiClient.get('/products/search', { params: { query } });
    return response.data;
  } catch (error) {
    console.error('搜索产品失败:', error);
    
    // 如果允许使用模拟数据并且是开发环境，返回模拟搜索结果
    if (USE_MOCK_DATA) {
      console.warn(`使用模拟数据搜索产品:${query}`);
      // 简单实现：在名称和描述中搜索关键词
      const filteredProducts = mockProducts.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        p.description.toLowerCase().includes(query.toLowerCase())
      );
      return filteredProducts;
    }
    
    throw error;
  }
}; 