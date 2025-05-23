/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.apache.dubbo.shop.service;

import org.apache.dubbo.shop.common.dto.request.GetProductRequest;
import org.apache.dubbo.shop.common.dto.request.SearchProductsRequest;
import org.apache.dubbo.shop.common.dto.response.ListProductsResponse;
import org.apache.dubbo.shop.common.dto.response.SearchProductsResponse;
import org.apache.dubbo.shop.common.pojo.Empty;
import org.apache.dubbo.shop.common.pojo.Product;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;
import java.util.concurrent.CompletableFuture;

/**
 * 商品目录服务
 */
@RequestMapping("/api")
public interface ProductCatalogService {
    
    /**
     * 获取商品列表
     */
    @GetMapping("/products")
    ListProductsResponse listProducts(Empty request);
    
    /**
     * 获取商品
     */
    @GetMapping("/products/{id}")
    Product getProduct(@PathVariable("id") String id);
}
