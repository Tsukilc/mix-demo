#!/bin/bash

# SkyWalking Agent 路径
SKYWALKING_AGENT_PATH="./skywalking-agent.jar"

# SkyWalking OAP 服务器地址
SKYWALKING_OAP="10.21.32.14:11800"

# 服务列表（使用 key=value 方式存储）
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

mkdir -p logs

for entry in "${SERVICES[@]}"; do
  SERVICE_NAME="${entry%%=*}"
  JAR_PATH="${entry#*=}"

  if [ -f "$JAR_PATH" ]; then
    # 查找该服务是否已经运行
    PID=$(ps -ef | grep "$JAR_PATH" | grep java | grep -v grep | awk '{print $2}')
    if [ ! -z "$PID" ]; then
      echo "$SERVICE_NAME is already running (PID $PID), stopping it first..."
      kill -9 "$PID"
      echo "$SERVICE_NAME stopped."
    fi

    echo "Starting $SERVICE_NAME..."
    nohup java -javaagent:$SKYWALKING_AGENT_PATH \
      -Dskywalking.agent.service_name=$SERVICE_NAME \
      -Dskywalking.collector.backend_service=$SKYWALKING_OAP \
      -jar $JAR_PATH > logs/$SERVICE_NAME.log 2>&1 &

    echo "$SERVICE_NAME started, logging to logs/$SERVICE_NAME.log"
  else
    echo "JAR not found for $SERVICE_NAME: $JAR_PATH"
  fi
done

echo "✅ All services processed."
