import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// 创建一个axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 创建订单
export const createOrder = async (userId, orderData) => {
  try {
    const response = await apiClient.post(`/checkout/${userId}/orders`, orderData);
    return response.data;
  } catch (error) {
    console.error('创建订单失败:', error);
    throw error;
  }
};

// 处理支付
export const processPayment = async (orderId, paymentInfo) => {
  try {
    const response = await apiClient.post(`/checkout/payment/${orderId}`, paymentInfo);
    return response.data;
  } catch (error) {
    console.error('处理支付失败:', error);
    throw error;
  }
};

// 获取用户的配送地址
export const getShippingAddresses = async (userId) => {
  try {
    const response = await apiClient.get(`/checkout/${userId}/addresses`);
    return response.data;
  } catch (error) {
    console.error('获取配送地址失败:', error);
    throw error;
  }
};

// 添加新的配送地址
export const addShippingAddress = async (userId, addressData) => {
  try {
    const response = await apiClient.post(`/checkout/${userId}/addresses`, addressData);
    return response.data;
  } catch (error) {
    console.error('添加配送地址失败:', error);
    throw error;
  }
}; 