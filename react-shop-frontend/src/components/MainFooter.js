import React from 'react';
import { Layout, Row, Col, Divider } from 'antd';

const { Footer } = Layout;

const MainFooter = () => {
  return (
    <Footer style={{ textAlign: 'center', background: '#001529', color: 'white' }}>
      <div className="footer-content">
        <Row gutter={[16, 32]}>
          <Col xs={24} sm={8}>
            <h3>关于我们</h3>
            <p>我们是一家专注于提供优质商品和服务的电商平台。</p>
          </Col>
          <Col xs={24} sm={8}>
            <h3>客户服务</h3>
            <p>联系我们: contact@example.com</p>
            <p>客服热线: 400-123-4567</p>
          </Col>
          <Col xs={24} sm={8}>
            <h3>支付方式</h3>
            <p>支持支付宝、微信支付、银联等多种支付方式</p>
          </Col>
        </Row>
        <Divider style={{ background: 'rgba(255,255,255,0.2)' }} />
        <p style={{ marginBottom: 0 }}>© 2023 React商城. 版权所有.</p>
      </div>
    </Footer>
  );
};

export default MainFooter; 