import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// 创建一个axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 获取所有产品列表
export const fetchProducts = async () => {
  try {
    const response = await apiClient.get('/products');
    return response.data;
  } catch (error) {
    console.error('获取产品列表失败:', error);
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
    throw error;
  }
}; 