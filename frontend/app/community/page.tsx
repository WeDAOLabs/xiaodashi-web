import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import CommunityFeatureSection from '@/app/components/community/CommunityFeatureSection';
import Faq from '@/app/components/ui/Faq';

const communityFeatures = [
    {
        title: '加入我们的讨论',
        description: '在我们的官方论坛和社交媒体群组中，与AI营销爱好者和专家互动。分享您的成功故事，提出问题，并协作寻找创新的解决方案。',
        links: [
            { href: '#', text: '访问论坛' },
            { href: '#', text: '查找社交群组' },
        ],
        imageUrl: '/community-discussion.png',
        imageAlt: 'A vibrant community discussion illustrated.',
    },
    {
        title: '学习与成长',
        description: '深入了解我们丰富的知识库。探索专家文章、详细的案例研究和实用的教程，以增强您的AI营销技能。',
        links: [
            { href: '#', text: '浏览资源' },
            { href: '#', text: '阅读案例' },
        ],
        imageUrl: '/community-learning.png',
        imageAlt: 'A collection of learning resources like articles and case studies.',
        reverse: true,
    },
];

const communityFaqItems = [
    {
      question: '什么是智商180的AI全域营销大师？',
      answer: '智商180的AI全域营销大师是一套全面的工具，旨在利用人工智能为B2B公司优化营销策略、自动化营销活动并提供深度分析。'
    },
    {
      question: 'AI如何增强我的营销活动？',
      answer: 'AI可以通过个性化客户体验、预测消费者行为、自动化重复性任务、优化广告支出以及提供数据驱动的洞察力来增强您的营销活动，从而做出更好的决策。'
    },
    {
      question: '有哪些可用于学习AI营销的资源？',
      answer: '我们提供丰富的资源库，包括深度文章、真实案例研究、分步教程、与行业专家共同举办的网络研讨会以及全面的知识库，帮助您掌握AI营销。'
    }
];

const CommunityPage = () => {
    return (
        <div className="flex flex-col min-h-screen bg-white text-gray-800">
            <Header />
            <main className="flex-grow">
                <section className="text-center py-20 lg:py-32">
                    <div className="container mx-auto px-6">
                        <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">欢迎来到社区</h2>
                        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">一个让用户建立连接、分享见解、并获得支持的中心。</p>
                    </div>
                </section>
                
                {communityFeatures.map(feature => (
                    <CommunityFeatureSection key={feature.title} {...feature} />
                ))}

                <div className="bg-gray-50">
                    <Faq title="常见问题解答" items={communityFaqItems} />
                </div>

            </main>
            <Footer />
        </div>
    );
};

export default CommunityPage;
