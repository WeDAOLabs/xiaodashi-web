'use client';

import './BusinessTransformation.css';
import StarIcon from '@/app/components/icons/business-transformation/StarIcon';
import ArrowLeftIcon from '@/app/components/icons/business-transformation/ArrowLeftIcon';
import ArrowRightIcon from '@/app/components/icons/business-transformation/ArrowRightIcon';

const BusinessTransformation = () => {
  return (
    <div className="business-transformation-wrapper">
      <div className="business-transformation-container">
        <div className="business-transformation-left">
          <span className="business-transformation-title">没有智赢</span>
          <div className="business-transformation-button">
            <span>企业很难拥有自己的营销专家<br />100%的工作由人工完成<br />AI工具让你的工作效率提升10%</span>
          </div>
        </div>
        <div className="business-transformation-middle">
          <div className="business-transformation-arrow-left">
            <ArrowLeftIcon />
          </div>
          <div className="business-transformation-process">
            <div className="font-handwritten text-red-500 text-3xl md:text-4xl leading-tight -rotate-3 relative">
              <p>我们创造了一整个数字人营销专家团队</p>
              <p className="relative">
                然后营销专家团队在24小时为你工作
                <span className="absolute -top-4 -right-10 md:-top-4 md:-right-12 text-yellow-400">
                  <StarIcon className="w-8 h-8" />
                </span>
              </p>
            </div>
          </div>
          <div className="business-transformation-arrow-right">
            <ArrowRightIcon />
          </div>
        </div>
        <div className="business-transformation-right">
          <span className="business-transformation-title">有了智赢</span>
          <div className="business-transformation-button">
            <span>企业拥有营销梦之队<br />80%的工作由数字营销专家完成<br />人只需要做判断，以及和用户面对面待在一起</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessTransformation;