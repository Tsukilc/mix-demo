import axios from 'axios';
import { mockCart } from '../utils/mockData';

const API_BASE_URL = 'http://10.21.32.14:80/api';

// 创建一个axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// 是否使用模拟数据(在正式环境中设置为false)
const USE_MOCK_DATA = process.env.NODE_ENV === 'development';

// 获取购物车
export const fetchCart = async (userId) => {
  try {
    const response = await apiClient.get(`/cart/${userId}`);
    return response.data;
  } catch (error) {
    console.error('获取购物车失败:', error);
    
    // 如果允许使用模拟数据，返回模拟购物车
    if (USE_MOCK_DATA) {
      console.warn('使用模拟购物车数据');
      return mockCart;
    }
    
    throw error;
  }
};

// 添加商品到购物车
export const addItemToCart = async (userId, item) => {
  try {
    const response = await apiClient.post(`/cart/${userId}/items`, item);
    return response.data;
  } catch (error) {
    console.error('添加商品到购物车失败:', error);
    
    // 如果允许使用模拟数据，模拟添加操作
    if (USE_MOCK_DATA) {
      console.warn('使用模拟数据添加购物车项');
      // 模拟添加操作
      const existingItemIndex = mockCart.items.findIndex(i => i.productId === item.productId);
      
      if (existingItemIndex >= 0) {
        // 更新已存在的项
        mockCart.items[existingItemIndex].quantity += item.quantity;
      } else {
        // 添加新项
        mockCart.items.push(item);
      }
      
      return { success: true };
    }
    
    throw error;
  }
};

// 从购物车中移除商品
export const removeItemFromCart = async (userId, itemId) => {
  try {
    const response = await apiClient.delete(`/cart/${userId}/items/${itemId}`);
    return response.data;
  } catch (error) {
    console.error('从购物车中移除商品失败:', error);
    
    // 如果允许使用模拟数据，模拟移除操作
    if (USE_MOCK_DATA) {
      console.warn('使用模拟数据移除购物车项');
      mockCart.items = mockCart.items.filter(item => item.productId !== itemId);
      return { success: true };
    }
    
    throw error;
  }
};

// 更新购物车中的商品数量
export const updateCartItemQuantity = async (userId, itemId, quantity) => {
  try {
    const response = await apiClient.patch(`/cart/${userId}/items/${itemId}`, { quantity });
    return response.data;
  } catch (error) {
    console.error('更新购物车中的商品数量失败:', error);
    
    // 如果允许使用模拟数据，模拟更新操作
    if (USE_MOCK_DATA) {
      console.warn('使用模拟数据更新购物车项数量');
      const item = mockCart.items.find(item => item.productId === itemId);
      if (item) {
        item.quantity = quantity;
      }
      return { success: true };
    }
    
    throw error;
  }
};

// 清空购物车
export const emptyCart = async (userId) => {
  try {
    const response = await apiClient.delete(`/cart/${userId}`);
    return response.data;
  } catch (error) {
    console.error('清空购物车失败:', error);
    
    // 如果允许使用模拟数据，模拟清空操作
    if (USE_MOCK_DATA) {
      console.warn('使用模拟数据清空购物车');
      mockCart.items = [];
      return { success: true };
    }
    
    throw error;
  }
}; 