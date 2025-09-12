'use client';

import './BusinessTransformation.css';

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
            <div className="arrow-placeholder"></div>
          </div>
          <div className="business-transformation-process">
            <div className="process-placeholder">我们创造了一整个数字人营销专家团队<br />然后营销专家团队在24小时为你工作</div>
          </div>
          <div className="business-transformation-arrow-right">
            <div className="arrow-placeholder"></div>
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