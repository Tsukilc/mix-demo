#!/bin/bash

# 服务列表（key=value 格式）
SERVICES=(
  "recommendationService=./recommendationService/target/recommendationService-1.0-SNAPSHOT.jar"
  "paymentService=./paymentService/target/paymentService-1.0-SNAPSHOT.jar"
  "interface=./interface/target/interface-1.0-SNAPSHOT.jar"
  "emailService=./emailService/target/emailService-1.0-SNAPSHOT.jar"
  "productCatalogsService=./productCatalogsService/target/productCatalogsService-1.0-SNAPSHOT.jar"
  "cartService=./cartService/target/cartService-1.0-SNAPSHOT.jar"
  "currencyService=./currencyService/target/currencyService-1.0-SNAPSHOT.jar"
  "checkoutService=./checkoutService/target/checkoutService-1.0-SNAPSHOT.jar"
  "frontend=./frontend/target/frontend-1.0-SNAPSHOT.jar"
  "shippingService=./shippingService/target/shippingService-1.0-SNAPSHOT.jar"
  "adService=./adService/target/adService-1.0-SNAPSHOT.jar"
)

for entry in "${SERVICES[@]}"; do
  SERVICE_NAME="${entry%%=*}"
  JAR_PATH="${entry#*=}"

  # 精确查找当前 jar 是否在运行
  PID=$(ps -ef | grep "$JAR_PATH" | grep java | grep -v grep | awk '{print $2}')

  if [ ! -z "$PID" ]; then
    echo "Stopping $SERVICE_NAME (PID: $PID)..."
    kill -9 "$PID"
    echo "$SERVICE_NAME stopped."
  else
    echo "$SERVICE_NAME is not running."
  fi
done

echo "✅ All services processed."
