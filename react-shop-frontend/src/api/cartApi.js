import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// 创建一个axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 获取购物车
export const fetchCart = async (userId) => {
  try {
    const response = await apiClient.get(`/cart/${userId}`);
    return response.data;
  } catch (error) {
    console.error('获取购物车失败:', error);
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
    throw error;
  }
}; 