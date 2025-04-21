import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Result, Button, Typography, Card, Row, Col, Divider, message } from 'antd';
import { ShoppingOutlined, FileTextOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 从location.state获取订单信息
  const orderInfo = location.state || { orderId: 'unknown', total: 0 };
  
  return (
    <div className="order-success-page">
      <Result
        status="success"
        title="订单提交成功！"
        subTitle={`订单号: ${orderInfo.orderId}`}
        extra={[
          <Button 
            type="primary" 
            key="console" 
            icon={<FileTextOutlined />}
            onClick={() => message.info('订单详情功能尚未实现')}
          >
            查看订单详情
          </Button>,
          <Button 
            key="buy" 
            icon={<ShoppingOutlined />}
            onClick={() => navigate('/products')}
          >
            继续购物
          </Button>,
        ]}
      />
      
      <Row justify="center">
        <Col xs={24} sm={20} md={16} lg={12}>
          <Card>
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <Title level={4}>订单信息</Title>
            </div>
            <Divider />
            <Row>
              <Col span={12}><Text strong>订单编号</Text></Col>
              <Col span={12}><Text>{orderInfo.orderId}</Text></Col>
            </Row>
            <Row style={{ marginTop: 16 }}>
              <Col span={12}><Text strong>订单金额</Text></Col>
              <Col span={12}><Text>¥{orderInfo.total.toFixed(2)}</Text></Col>
            </Row>
            <Row style={{ marginTop: 16 }}>
              <Col span={12}><Text strong>支付方式</Text></Col>
              <Col span={12}><Text>在线支付</Text></Col>
            </Row>
            <Row style={{ marginTop: 16 }}>
              <Col span={12}><Text strong>订单时间</Text></Col>
              <Col span={12}><Text>{new Date().toLocaleString()}</Text></Col>
            </Row>
            <Divider />
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <Text>感谢您的购买！我们将尽快为您发货。</Text>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OrderSuccessPage; 