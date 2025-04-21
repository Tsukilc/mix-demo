/**
 * 安全处理API响应，确保返回期望的数据类型
 * @param {any} response - API响应数据
 * @param {string} expectedType - 期望的数据类型 ('array', 'object')
 * @param {any} defaultValue - 当数据类型不匹配时返回的默认值
 * @returns {any} 处理后的数据
 */
export const safelyParseResponse = (response, expectedType, defaultValue) => {
  if (response === null || response === undefined) {
    console.warn('API响应为空');
    return defaultValue;
  }
  
  switch (expectedType) {
    case 'array':
      if (!Array.isArray(response)) {
        console.warn('API响应不是数组:', response);
        return defaultValue;
      }
      return response;
    case 'object':
      if (typeof response !== 'object' || Array.isArray(response)) {
        console.warn('API响应不是对象:', response);
        return defaultValue;
      }
      return response;
    default:
      return response;
  }
};

/**
 * 安全获取对象属性值，避免空值引起的错误
 * @param {object} obj - 源对象
 * @param {string} key - 属性键
 * @param {any} defaultValue - 当属性不存在时返回的默认值
 * @returns {any} 属性值或默认值
 */
export const safelyGetValue = (obj, key, defaultValue) => {
  if (!obj || typeof obj !== 'object') {
    return defaultValue;
  }
  
  return obj[key] !== undefined && obj[key] !== null ? obj[key] : defaultValue;
};

/**
 * 为API错误创建标准化的错误信息
 * @param {Error} error - 错误对象
 * @param {string} defaultMessage - 默认错误消息
 * @returns {string} 格式化的错误消息
 */
export const formatApiError = (error, defaultMessage = '操作失败，请稍后再试') => {
  if (!error) {
    return defaultMessage;
  }
  
  // 处理axios错误
  if (error.response) {
    // 服务器返回了错误状态码
    const status = error.response.status;
    const data = error.response.data;
    
    if (data && data.message) {
      return data.message;
    }
    
    if (status === 404) {
      return '请求的资源不存在';
    } else if (status === 401) {
      return '未授权，请重新登录';
    } else if (status === 403) {
      return '无权限执行此操作';
    } else if (status === 500) {
      return '服务器错误，请稍后再试';
    }
  } else if (error.request) {
    // 请求已发出，但没有收到响应
    return '无法连接到服务器，请检查网络连接';
  }
  
  // 其他类型的错误
  return error.message || defaultMessage;
}; 