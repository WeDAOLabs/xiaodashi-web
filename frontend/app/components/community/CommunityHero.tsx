'use client';

import ContactSalesModal from '@/app/components/ContactSalesModal';
import { Button } from '@/app/components/ui/Button';
import React, { useState } from 'react';

// Community-specific hero component that extends PageHero functionality
// Following KISS principle with proper layout and typography
const CommunityHero: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  return (
    <section className="w-full text-center py-20 md:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Main title with proper typography hierarchy */}
          <h1 className="text-4xl font-bold leading-tight tracking-tighter text-gray-900 sm:text-5xl mb-4">
            销岛 (S DAO)：AI营销人的共振之地
          </h1>
          
          {/* Badge/Tag with proper spacing */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-base font-medium mb-6">
            DAO组织模式 · 用户共建 · 知识共享 · 持续进化
          </div>
          
          {/* Description with proper line height and spacing */}
          <p className="mx-auto max-w-4xl text-lg font-normal leading-relaxed text-gray-700 mb-8">
            不仅仅是使用工具，更要融入社群。在这里，您将获取前沿知识、拓展人脉、与专家交流，<br />
            共同推动营销智能化发展。加入我们，成为未来营销的共创者。
          </p>
          
          {/* CTA Button with proper centering */}
          <div className="flex justify-center">
            <Button 
              onClick={handleButtonClick}
              className="bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] text-white font-semibold px-10 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 rounded-full"
            >
              立即登岛，开启共创之旅
            </Button>
          </div>
        </div>
      </div>
      
      {/* Contact Sales Modal */}
      {isModalOpen && (
        <ContactSalesModal onClose={handleCloseModal} />
      )}
    </section>
  );
};

export default CommunityHero;