import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Form, 
  Input, 
  Button, 
  Radio, 
  Divider, 
  Steps, 
  Row, 
  Col, 
  Card, 
  Typography, 
  Table,
  Breadcrumb,
  message,
  List,
  Space,
  Spin
} from 'antd';
import { 
  HomeOutlined,
  EnvironmentOutlined,
  CreditCardOutlined,
  ShoppingCartOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { fetchCart } from '../api/cartApi';
import { getShippingAddresses, createOrder, processPayment } from '../api/checkoutApi';

const { Title, Text } = Typography;
const { Step } = Steps;
const { TextArea } = Input;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [cart, setCart] = useState({ items: [] });
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('alipay');
  const [loading, setLoading] = useState(true);
  const [processingOrder, setProcessingOrder] = useState(false);
  const userId = '123'; // 模拟用户ID，实际应从认证系统获取
  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // 并行加载购物车和地址信息
        const [cartResponse, addressesResponse] = await Promise.all([
          fetchCart(userId),
          getShippingAddresses(userId)
        ]);
        
        // 处理购物车数据
        if (cartResponse && typeof cartResponse === 'object') {
          const items = Array.isArray(cartResponse.items) ? cartResponse.items : [];
          setCart({ ...cartResponse, items });
        } else {
          console.warn('购物车数据格式不正确:', cartResponse);
          setCart({ items: [] });
        }
        
        // 处理地址数据
        if (Array.isArray(addressesResponse)) {
          setAddresses(addressesResponse);
          
          // 如果有地址，选择第一个作为默认
          if (addressesResponse.length > 0) {
            setSelectedAddress(addressesResponse[0].id);
          }
        } else {
          console.warn('地址数据格式不正确:', addressesResponse);
          setAddresses([]);
        }
      } catch (error) {
        console.error('加载结账数据失败:', error);
        message.error('加载结账数据失败');
        setCart({ items: [] });
        setAddresses([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [userId]);
  
  const handleAddressChange = (addressId) => {
    setSelectedAddress(addressId);
  };
  
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };
  
  const calculateSubtotal = () => {
    if (!cart.items || cart.items.length === 0) return 0;
    return cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const calculateShipping = () => {
    // 简单的运费计算逻辑
    const subtotal = calculateSubtotal();
    return subtotal > 100 ? 0 : 10; // 满100包邮
  };
  
  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };
  
  const handleNextStep = () => {
    if (currentStep === 0 && !selectedAddress) {
      message.error('请选择收货地址');
      return;
    }
    
    setCurrentStep(currentStep + 1);
  };
  
  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };
  
  const handleAddNewAddress = () => {
    form.validateFields().then(values => {
      // 模拟添加新地址
      const newAddress = {
        id: Date.now().toString(),
        name: values.name,
        phone: values.phone,
        province: values.province,
        city: values.city,
        address: values.address,
        isDefault: addresses.length === 0
      };
      
      setAddresses([...addresses, newAddress]);
      setSelectedAddress(newAddress.id);
      message.success('新地址添加成功');
      
      // 清空表单
      form.resetFields();
    });
  };
  
  const handleSubmitOrder = async () => {
    if (!selectedAddress) {
      message.error('请选择收货地址');
      return;
    }
    
    setProcessingOrder(true);
    try {
      // 创建订单
      const orderData = {
        items: cart.items,
        addressId: selectedAddress,
        paymentMethod: paymentMethod,
        total: calculateTotal(),
        shippingFee: calculateShipping()
      };
      
      const order = await createOrder(userId, orderData);
      
      // 处理支付
      const paymentInfo = {
        orderId: order.id,
        method: paymentMethod,
        amount: calculateTotal()
      };
      
      await processPayment(order.id, paymentInfo);
      
      // 支付成功，跳转到订单成功页面
      navigate('/order-success', { 
        state: { 
          orderId: order.id,
          total: calculateTotal()
        } 
      });
    } catch (error) {
      console.error('提交订单失败', error);
      message.error('提交订单失败');
    } finally {
      setProcessingOrder(false);
    }
  };
  
  const renderAddressStep = () => {
    return (
      <Row gutter={24}>
        <Col span={16}>
          <Card title="选择收货地址">
            <div className="address-list">
              <Radio.Group 
                onChange={(e) => handleAddressChange(e.target.value)} 
                value={selectedAddress}
                style={{ width: '100%' }}
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  {addresses.map(address => (
                    <Radio key={address.id} value={address.id}>
                      <Card size="small" style={{ marginBottom: 8, width: '100%' }}>
                        <div>
                          <Text strong>{address.name}</Text>
                          <Text style={{ marginLeft: 16 }}>{address.phone}</Text>
                          {address.isDefault && (
                            <Text type="secondary" style={{ marginLeft: 16 }}>默认</Text>
                          )}
                        </div>
                        <div>
                          <Text>{address.province} {address.city} {address.address}</Text>
                        </div>
                      </Card>
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
              
              {addresses.length === 0 && (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <Text type="secondary">暂无收货地址，请添加新地址</Text>
                </div>
              )}
            </div>
          </Card>
          
          <Card title="添加新地址" style={{ marginTop: 16 }}>
            <Form form={form} layout="vertical">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label="收货人"
                    rules={[{ required: true, message: '请输入收货人姓名' }]}
                  >
                    <Input placeholder="请输入收货人姓名" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="phone"
                    label="手机号码"
                    rules={[{ required: true, message: '请输入手机号码' }]}
                  >
                    <Input placeholder="请输入手机号码" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="province"
                    label="省份"
                    rules={[{ required: true, message: '请输入省份' }]}
                  >
                    <Input placeholder="请输入省份" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="city"
                    label="城市"
                    rules={[{ required: true, message: '请输入城市' }]}
                  >
                    <Input placeholder="请输入城市" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                name="address"
                label="详细地址"
                rules={[{ required: true, message: '请输入详细地址' }]}
              >
                <TextArea rows={3} placeholder="请输入详细地址" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" onClick={handleAddNewAddress}>
                  添加新地址
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        
        <Col span={8}>
          <Card title="订单摘要">
            <List
              dataSource={cart.items}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={item.name}
                    description={`数量: ${item.quantity}`}
                  />
                  <div>¥{(item.price * item.quantity).toFixed(2)}</div>
                </List.Item>
              )}
            />
            <Divider />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text>小计:</Text>
              <Text>¥{calculateSubtotal().toFixed(2)}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '8px 0' }}>
              <Text>运费:</Text>
              <Text>¥{calculateShipping().toFixed(2)}</Text>
            </div>
            <Divider />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text strong>总计:</Text>
              <Text style={{ fontSize: 18, color: '#ff4d4f' }} strong>¥{calculateTotal().toFixed(2)}</Text>
            </div>
          </Card>
        </Col>
      </Row>
    );
  };
  
  const renderPaymentStep = () => {
    return (
      <Row gutter={24}>
        <Col span={16}>
          <Card title="支付方式">
            <Radio.Group onChange={handlePaymentMethodChange} value={paymentMethod}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Radio value="alipay">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img 
                      src="https://via.placeholder.com/120x40?text=Alipay" 
                      alt="支付宝" 
                      style={{ marginRight: 16 }} 
                    />
                    支付宝
                  </div>
                </Radio>
                <Radio value="wechat">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img 
                      src="https://via.placeholder.com/120x40?text=WeChat" 
                      alt="微信支付" 
                      style={{ marginRight: 16 }} 
                    />
                    微信支付
                  </div>
                </Radio>
                <Radio value="unionpay">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img 
                      src="https://via.placeholder.com/120x40?text=UnionPay" 
                      alt="银联" 
                      style={{ marginRight: 16 }} 
                    />
                    银联支付
                  </div>
                </Radio>
              </Space>
            </Radio.Group>
          </Card>
          
          <Card title="收货地址" style={{ marginTop: 16 }}>
            {addresses.find(a => a.id === selectedAddress) && (
              <div>
                <div>
                  <Text strong>{addresses.find(a => a.id === selectedAddress).name}</Text>
                  <Text style={{ marginLeft: 16 }}>{addresses.find(a => a.id === selectedAddress).phone}</Text>
                </div>
                <div>
                  <Text>
                    {addresses.find(a => a.id === selectedAddress).province} 
                    {addresses.find(a => a.id === selectedAddress).city} 
                    {addresses.find(a => a.id === selectedAddress).address}
                  </Text>
                </div>
              </div>
            )}
            <Button 
              type="link" 
              onClick={() => setCurrentStep(0)}
              style={{ padding: 0, marginTop: 8 }}
            >
              修改
            </Button>
          </Card>
        </Col>
        
        <Col span={8}>
          <Card title="订单摘要">
            <List
              dataSource={cart.items}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={item.name}
                    description={`数量: ${item.quantity}`}
                  />
                  <div>¥{(item.price * item.quantity).toFixed(2)}</div>
                </List.Item>
              )}
            />
            <Divider />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text>小计:</Text>
              <Text>¥{calculateSubtotal().toFixed(2)}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '8px 0' }}>
              <Text>运费:</Text>
              <Text>¥{calculateShipping().toFixed(2)}</Text>
            </div>
            <Divider />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text strong>总计:</Text>
              <Text style={{ fontSize: 18, color: '#ff4d4f' }} strong>¥{calculateTotal().toFixed(2)}</Text>
            </div>
          </Card>
        </Col>
      </Row>
    );
  };
  
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    );
  }
  
  if (cart.items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Title level={4}>您的购物车是空的</Title>
        <Button type="primary" onClick={() => navigate('/products')}>
          去购物
        </Button>
      </div>
    );
  }
  
  return (
    <div className="checkout-page">
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <Link to="/">
            <HomeOutlined />
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/cart">购物车</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>结算</Breadcrumb.Item>
      </Breadcrumb>
      
      <Title level={3}>订单结算</Title>
      
      <Card style={{ marginBottom: 24 }}>
        <Steps current={currentStep}>
          <Step title="确认收货信息" icon={<EnvironmentOutlined />} />
          <Step title="支付订单" icon={<CreditCardOutlined />} />
          <Step title="完成" icon={<CheckCircleOutlined />} />
        </Steps>
      </Card>
      
      {currentStep === 0 && renderAddressStep()}
      {currentStep === 1 && renderPaymentStep()}
      
      <div style={{ textAlign: 'center', marginTop: 24 }}>
        {currentStep > 0 && (
          <Button style={{ marginRight: 16 }} onClick={handlePrevStep}>
            上一步
          </Button>
        )}
        
        {currentStep < 1 ? (
          <Button type="primary" onClick={handleNextStep}>
            下一步
          </Button>
        ) : (
          <Button 
            type="primary" 
            onClick={handleSubmitOrder}
            loading={processingOrder}
          >
            提交订单
          </Button>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage; 