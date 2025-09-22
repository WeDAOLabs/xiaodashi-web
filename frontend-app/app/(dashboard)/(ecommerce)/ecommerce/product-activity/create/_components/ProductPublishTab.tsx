'use client';

import React, { useState } from 'react';
import ProductInfoForm from './ProductInfoForm';
import SkuManager from './SkuManager';

const ProductPublishTab: React.FC = () => {
  const [productInfo, setProductInfo] = useState({
    name: '',
    subtitle: '',
    description: '',
    mainImages: null as FileList | null,
    detailImages: null as FileList | null,
    video: null as File | null
  });

  const [skuList, setSkuList] = useState([
    {
      id: '1',
      color: '黑色',
      size: 'M',
      skuCode: 'BLK-M-001',
      salePrice: 199,
      marketPrice: 299,
      stock: 100
    }
  ]);

  return (
    <div className="space-y-6">
      {/* 商品基础信息 */}
      <ProductInfoForm
        productInfo={productInfo}
        onInfoChange={setProductInfo}
      />

      {/* SKU管理 */}
      <SkuManager
        skuList={skuList}
        onSkuListChange={setSkuList}
      />
    </div>
  );
};

export default ProductPublishTab;