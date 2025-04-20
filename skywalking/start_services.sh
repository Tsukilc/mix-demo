#!/bin/bash

# SkyWalking Agent 路径
SKYWALKING_AGENT_PATH="/develop/app/online_bontique_demo/skywalking/skywalking-agent/skywalking-agent.jar"

# SkyWalking OAP 服务器地址
SKYWALKING_OAP="localhost:11800"

# 服务列表（服务名称=JAR路径）
declare -A SERVICES=(
  ["recommendationService"]="./recommendationService/target/recommendationService-1.0-SNAPSHOT.jar"
  ["paymentService"]="./paymentService/target/paymentService-1.0-SNAPSHOT.jar"
  ["interface"]="./interface/target/interface-1.0-SNAPSHOT.jar"
  ["emailService"]="./emailService/target/emailService-1.0-SNAPSHOT.jar"
  ["productCatalogsService"]="./productCatalogsService/target/productCatalogsService-1.0-SNAPSHOT.jar"
  ["cartService"]="./cartService/target/cartService-1.0-SNAPSHOT.jar"
  ["currencyService"]="./currencyService/target/currencyService-1.0-SNAPSHOT.jar"
  ["checkoutService"]="./checkoutService/target/checkoutService-1.0-SNAPSHOT.jar"
  ["frontend"]="./frontend/target/frontend-1.0-SNAPSHOT.jar"
  ["shippingService"]="./shippingService/target/shippingService-1.0-SNAPSHOT.jar"
  ["adService"]="./adService/target/adService-1.0-SNAPSHOT.jar"
)

# 创建日志目录
mkdir -p logs

# 启动每个服务
for SERVICE_NAME in "${!SERVICES[@]}"; do
  JAR_PATH="${SERVICES[$SERVICE_NAME]}"
  
  if [ -f "$JAR_PATH" ]; then
    echo "Starting $SERVICE_NAME..."
    nohup java -javaagent:$SKYWALKING_AGENT_PATH \
      -Dskywalking.agent.service_name=$SERVICE_NAME \
      -Dskywalking.collector.backend_service=$SKYWALKING_OAP \
      -jar $JAR_PATH > logs/$SERVICE_NAME.log 2>&1 &
    echo "$SERVICE_NAME started, logging to logs/$SERVICE_NAME.log"
  else
    echo "Jar file for $SERVICE_NAME not found: $JAR_PATH"
  fi
done

echo "All services started."

