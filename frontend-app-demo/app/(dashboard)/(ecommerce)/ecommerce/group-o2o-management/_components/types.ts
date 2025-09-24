// 团购产品接口
export interface GroupProduct {
  id: string;
  name: string;
  platform: string;
  type: 'package' | 'voucher' | 'service';
  price: string;
  sales: number;
  status: 'active' | 'inactive';
}

// 核销记录接口
export interface VerificationRecord {
  id: string;
  productName: string;
  verificationCode: string;
  customerName: string;
  verificationDate: string | null;
  status: 'verified' | 'pending' | 'expired';
}

// 核销统计接口
export interface VerificationStats {
  todayVerifications: number;
  verificationRate: number;
  pendingVerifications: number;
  todayChange: string;
  rateChange: string;
  pendingChange: string;
}

// 履约效率数据接口
export interface EfficiencyData {
  category: string;
  reservationRate: number;
  arrivalRate: number;
}

// O2O产品关联接口
export interface O2OAssociation {
  id: string;
  groupProductName: string;
  associatedProduct: string;
  inventorySync: boolean;
}

// AI定价建议接口
export interface AIPricingSuggestion {
  productName: string;
  recommendedPrice: string;
  conversionImprovement: string;
  reasoning: string;
}