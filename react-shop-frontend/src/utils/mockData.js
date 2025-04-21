/**
 * 模拟产品数据
 */
export const mockProducts = [
  {
    id: '1',
    name: '高品质T恤',
    description: '舒适透气的纯棉T恤',
    price: 99.00,
    originalPrice: 129.00,
    imageUrl: 'https://via.placeholder.com/300?text=T恤',
    category: 'clothing',
    stock: 100,
    sales: 58,
    brand: '服装品牌',
    origin: '中国',
    weight: '200g',
    dimensions: 'M',
    createdAt: '2023-03-15T13:45:30'
  },
  {
    id: '2',
    name: '智能手表',
    description: '多功能运动健康智能手表',
    price: 499.00,
    originalPrice: 699.00,
    imageUrl: 'https://via.placeholder.com/300?text=智能手表',
    category: 'electronics',
    stock: 50,
    sales: 120,
    brand: 'TechWatch',
    origin: '中国',
    weight: '45g',
    dimensions: '44mm',
    createdAt: '2023-04-10T09:30:20'
  },
  {
    id: '3',
    name: '蓝牙耳机',
    description: '高音质无线蓝牙耳机',
    price: 299.00,
    originalPrice: 399.00,
    imageUrl: 'https://via.placeholder.com/300?text=蓝牙耳机',
    category: 'electronics',
    stock: 80,
    sales: 95,
    brand: 'SoundPlus',
    origin: '韩国',
    weight: '65g',
    dimensions: '标准',
    createdAt: '2023-05-20T15:20:10'
  },
  {
    id: '4',
    name: '时尚背包',
    description: '大容量防水休闲背包',
    price: 199.00,
    originalPrice: 259.00,
    imageUrl: 'https://via.placeholder.com/300?text=背包',
    category: 'bags',
    stock: 60,
    sales: 42,
    brand: 'BackPro',
    origin: '中国',
    weight: '850g',
    dimensions: '40*30*15cm',
    createdAt: '2023-02-28T11:15:40'
  },
  {
    id: '5',
    name: '运动鞋',
    description: '专业跑步运动鞋',
    price: 399.00,
    originalPrice: 499.00,
    imageUrl: 'https://via.placeholder.com/300?text=运动鞋',
    category: 'shoes',
    stock: 45,
    sales: 78,
    brand: 'RunFast',
    origin: '越南',
    weight: '340g',
    dimensions: '42码',
    createdAt: '2023-01-15T08:45:55'
  },
  {
    id: '6',
    name: '保温水杯',
    description: '304不锈钢真空保温杯',
    price: 89.00,
    originalPrice: 119.00,
    imageUrl: 'https://via.placeholder.com/300?text=保温杯',
    category: 'home',
    stock: 120,
    sales: 210,
    brand: 'ThermoKeep',
    origin: '中国',
    weight: '290g',
    dimensions: '500ml',
    createdAt: '2023-06-05T14:20:30'
  },
  {
    id: '7',
    name: '无线充电器',
    description: '快速无线充电板',
    price: 129.00,
    originalPrice: 169.00,
    imageUrl: 'https://via.placeholder.com/300?text=无线充电器',
    category: 'electronics',
    stock: 70,
    sales: 65,
    brand: 'ChargeFast',
    origin: '中国',
    weight: '120g',
    dimensions: '10*10*1cm',
    createdAt: '2023-04-25T17:10:25'
  },
  {
    id: '8',
    name: '护肤套装',
    description: '天然有机护肤四件套',
    price: 269.00,
    originalPrice: 329.00,
    imageUrl: 'https://via.placeholder.com/300?text=护肤套装',
    category: 'beauty',
    stock: 30,
    sales: 48,
    brand: 'NatureCare',
    origin: '韩国',
    weight: '500g',
    dimensions: '标准',
    createdAt: '2023-05-30T10:05:15'
  }
];

/**
 * 模拟购物车数据
 */
export const mockCart = {
  userId: '123',
  items: [
    {
      productId: '2',
      name: '智能手表',
      price: 499.00,
      quantity: 1,
      imageUrl: 'https://via.placeholder.com/300?text=智能手表'
    },
    {
      productId: '6',
      name: '保温水杯',
      price: 89.00,
      quantity: 2,
      imageUrl: 'https://via.placeholder.com/300?text=保温杯'
    }
  ]
};

/**
 * 模拟地址数据
 */
export const mockAddresses = [
  {
    id: '1',
    name: '张三',
    phone: '13800138000',
    province: '北京市',
    city: '朝阳区',
    address: '建国路88号',
    isDefault: true
  },
  {
    id: '2',
    name: '李四',
    phone: '13900139000',
    province: '上海市',
    city: '浦东新区',
    address: '陆家嘴金融中心',
    isDefault: false
  }
]; 