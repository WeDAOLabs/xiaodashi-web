'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';

// IP创建数据类型定义
export interface IPCreationData {
  // Step 1: IP档案与核心信息
  ipName: string;
  ipType: 'virtual-character' | 'spiritual-symbol' | 'story-framework' | 'cultural-symbol' | 'personal-brand';
  keywords: string[];
  coreSellingPoint: string;

  // Step 2: IP概念与定位
  targetVision: string;
  targetAudience: string;
  coreConceptValue: string;
  competitorAnalysis: string;
  positioningReport: string;

  // Step 3: 视觉形象与人格化
  imageSketch: string[];
  personalityTraits: string;

  // Step 4: 故事与内容叙事
  coreStoryline: string;
  contentExamples: string;

  // Step 5: 孵化与发布计划
  distributionChannels: string[];
  publishStrategy: string;
  riskAssessment: string;
}

// 初始状态
const initialState: IPCreationData = {
  ipName: '我的新IP',
  ipType: 'virtual-character',
  keywords: ['可爱', '未来感'],
  coreSellingPoint: '',
  targetVision: '',
  targetAudience: '',
  coreConceptValue: '',
  competitorAnalysis: '',
  positioningReport: '',
  imageSketch: [],
  personalityTraits: '',
  coreStoryline: '',
  contentExamples: '',
  distributionChannels: [],
  publishStrategy: '',
  riskAssessment: '',
};

// Action 类型
type IPCreationAction =
  | { type: 'UPDATE_FIELD'; field: keyof IPCreationData; value: string | string[] }
  | { type: 'UPDATE_KEYWORDS'; keywords: string[] }
  | { type: 'ADD_KEYWORD'; keyword: string }
  | { type: 'REMOVE_KEYWORD'; index: number }
  | { type: 'UPDATE_IMAGE_SKETCH'; images: string[] }
  | { type: 'LOAD_FROM_STORAGE'; data: IPCreationData }
  | { type: 'RESET' };

// Reducer
function ipCreationReducer(state: IPCreationData, action: IPCreationAction): IPCreationData {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value };
    case 'UPDATE_KEYWORDS':
      return { ...state, keywords: action.keywords };
    case 'ADD_KEYWORD':
      if (!state.keywords.includes(action.keyword)) {
        return { ...state, keywords: [...state.keywords, action.keyword] };
      }
      return state;
    case 'REMOVE_KEYWORD':
      return {
        ...state,
        keywords: state.keywords.filter((_, index) => index !== action.index)
      };
    case 'UPDATE_IMAGE_SKETCH':
      return { ...state, imageSketch: action.images };
    case 'LOAD_FROM_STORAGE':
      return action.data;
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

// Context 类型
interface IPCreationContextType {
  data: IPCreationData;
  currentStep: number;
  dispatch: React.Dispatch<IPCreationAction>;
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  saveProgress: () => void;
  canGoToStep: (step: number) => boolean;
}

const IPCreationContext = createContext<IPCreationContextType | undefined>(undefined);

// Provider 组件
interface IPCreationProviderProps {
  children: React.ReactNode;
}

export function IPCreationProvider({ children }: IPCreationProviderProps) {
  const [data, dispatch] = useReducer(ipCreationReducer, initialState);
  const params = useParams();
  const router = useRouter();

  // 从路由参数获取当前步骤
  const currentStep = React.useMemo(() => {
    const step = params?.step as string;
    if (step?.startsWith('step')) {
      const stepNumber = parseInt(step.replace('step', ''), 10);
      return stepNumber >= 1 && stepNumber <= 5 ? stepNumber : 1;
    }
    return 1;
  }, [params?.step]);

  // 检查是否可以跳转到某个步骤
  const canGoToStep = (step: number): boolean => {
    if (step === 1) return true;
    if (step === 2) return !!data.ipName && !!data.ipType;
    if (step === 3) return !!data.targetVision;
    if (step === 4) return !!data.personalityTraits;
    if (step === 5) return !!data.coreStoryline;
    return false;
  };

  // 导航函数
  const goToStep = (step: number) => {
    if (step >= 1 && step <= 5 && canGoToStep(step)) {
      router.push(`/brand-management-ip-creation/create/step${step}`);
    }
  };

  const nextStep = () => {
    if (currentStep < 5) {
      goToStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  };

  // 保存进度到 localStorage
  const saveProgress = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ip-creation-data', JSON.stringify(data));
    }
  }, [data]);

  // 从 localStorage 加载数据
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ip-creation-data');
      if (saved) {
        try {
          const parsedData = JSON.parse(saved);
          dispatch({ type: 'LOAD_FROM_STORAGE', data: parsedData });
        } catch (error) {
          console.error('Failed to load saved data:', error);
        }
      }
    }
  }, []);

  // 自动保存
  useEffect(() => {
    saveProgress();
  }, [data, saveProgress]);

  const contextValue: IPCreationContextType = {
    data,
    currentStep,
    dispatch,
    goToStep,
    nextStep,
    prevStep,
    saveProgress,
    canGoToStep,
  };

  return (
    <IPCreationContext.Provider value={contextValue}>
      {children}
    </IPCreationContext.Provider>
  );
}

// Hook
export function useIPCreation() {
  const context = useContext(IPCreationContext);
  if (context === undefined) {
    throw new Error('useIPCreation must be used within an IPCreationProvider');
  }
  return context;
}