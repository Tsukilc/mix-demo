import axios from 'axios';
import { mockAddresses } from '../utils/mockData';

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

// 创建订单
export const createOrder = async (userId, orderData) => {
  try {
    const response = await apiClient.post(`/checkout/${userId}/orders`, orderData);
    return response.data;
  } catch (error) {
    console.error('创建订单失败:', error);
    
    // 如果允许使用模拟数据，模拟创建订单
    if (USE_MOCK_DATA) {
      console.warn('使用模拟数据创建订单');
      return {
        id: 'order_' + Date.now(),
        userId: userId,
        items: orderData.items,
        total: orderData.total,
        status: 'created',
        createdAt: new Date().toISOString()
      };
    }
    
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
    
    // 如果允许使用模拟数据，模拟支付处理
    if (USE_MOCK_DATA) {
      console.warn('使用模拟数据处理支付');
      return {
        orderId: orderId,
        paymentId: 'payment_' + Date.now(),
        status: 'completed',
        amount: paymentInfo.amount,
        method: paymentInfo.method,
        completedAt: new Date().toISOString()
      };
    }
    
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
    
    // 如果允许使用模拟数据，返回模拟地址
    if (USE_MOCK_DATA) {
      console.warn('使用模拟配送地址数据');
      return mockAddresses;
    }
    
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
    
    // 如果允许使用模拟数据，模拟添加地址
    if (USE_MOCK_DATA) {
      console.warn('使用模拟数据添加配送地址');
      const newAddress = {
        id: 'addr_' + Date.now(),
        ...addressData,
        userId: userId
      };
      mockAddresses.push(newAddress);
      return newAddress;
    }
    
    throw error;
  }
}; 