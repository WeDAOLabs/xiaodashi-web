'use client';

import Image from 'next/image';
import './UserVoices.css';

// 用户评价数据类型定义
interface UserReview {
  id: string;
  content: string;
  avatar: string;
  name: string;
  rating: string;
}

// 用户评价数据
const userReviews: UserReview[] = [
  {
    id: 'review-1',
    content: '当我们有了智能客服，我的员工终于可以有一点空闲时间开始思考，慢下来也许能发生奇迹！',
    avatar: '/images/user-voices/user_avatar_1.png',
    name: '匿名',
    rating: '/images/user-voices/star_rating.png'
  },
  {
    id: 'review-2',
    content: '智赢帮我们找到了产品"新手引导流程"的致命痛点，甚至可以直接生成了优化任务给研发团队，不再是凭感觉做迭代了！',
    avatar: '/images/user-voices/user_avatar_2.png',
    name: 'Erma',
    rating: '/images/user-voices/star_rating.png'
  },
  {
    id: 'review-3',
    content: '现在我知道我的客户都在关注些什么，智赢帮我生成了关于"产品X与竞品Y差异"的初步对比草稿，这比我绞尽脑汁去想内容效率高太多了！',
    avatar: '/images/user-voices/user_avatar_3.png',
    name: '匿名',
    rating: '/images/user-voices/star_rating.png'
  },
  {
    id: 'review-4',
    content: '智赢的自动化客户旅程太给力了，新加好友自动推送介绍，直播后推送回放和优惠，大大减少了我们人工跟进的工作量，转化率真的提升了！',
    avatar: '/images/user-voices/user_avatar_1.png',
    name: '张经理',
    rating: '/images/user-voices/star_rating.png'
  }
];

// 用户评价卡片组件
interface ReviewCardProps {
  review: UserReview;
}

const ReviewCard = ({ review }: ReviewCardProps) => (
  <div className="user-voices-review-card">
    <p className="user-voices-review-content">
      "{review.content}"
    </p>
    <div className="user-voices-review-bottom">
      <div className="user-voices-review-user">
        <Image
          src={review.avatar}
          alt={`${review.name}的头像`}
          width={24}
          height={24}
          className="w-6 h-6 rounded-full"
        />
        <span className="user-voices-review-name">
          {review.name}
        </span>
      </div>
      <Image
        src={review.rating}
        alt="五星评分"
        width={66}
        height={10}
        className="user-voices-review-rating"
      />
    </div>
  </div>
);

// 主要评价展示区域
const MainReviewSection = () => (
  <div className="user-voices-main-section">
    {/* 左侧评价卡片 */}
    <div className="user-voices-main-card user-voices-main-card-left">
      <div className="user-voices-main-card-content">
        <Image
          src="/images/user-voices/icon_quo.svg"
          alt="引号"
          width={24}
          height={30}
          className="w-6 h-8 -mt-2.5"
        />
        <h3 className="user-voices-main-card-title">
          当我们有了智能客服，我的员工终于可以有一点空闲时间开始思考，慢下来也许能发生奇迹！
        </h3>
      </div>
    </div>

    {/* 右侧评价卡片 */}
    <div className="user-voices-main-card user-voices-main-card-right">
      <div className="user-voices-main-card-content">
        <Image
          src="/images/user-voices/icon_quo_white.svg"
          alt="白色引号"
          width={24}
          height={30}
          className="w-6 h-8 -mt-2.5"
        />
        <h3 className="user-voices-main-card-title">
          智赢帮我们找到了产品"新手引导流程"的致命痛点，甚至可以直接生成了优化任务给研发团队，不再是凭感觉做迭代了！
        </h3>
      </div>
    </div>
  </div>
);

// 滚动评价区域
const ScrollableReviews = () => (
  <div className="user-voices-scrollable-section">
    {/* 上方文字内容 */}
    <div className="user-voices-scrollable-content">
      <h3 className="user-voices-scrollable-title">
        用户的支持是我们最大的前进动力，对这份珍贵的支持，我们充满真挚的感激。
      </h3>
    </div>
    
    {/* 下方评价滚动区域 */}
    <div className="user-voices-scrollable-container">
      <div className="user-voices-scrollable-list">
        {userReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
        {/* 重复显示以创建无缝滚动效果 */}
        {userReviews.map((review) => (
          <ReviewCard key={`${review.id}-dup`} review={review} />
        ))}
      </div>
    </div>
  </div>
);

// 主组件
const UserVoices = () => {
  return (
    <section className="section-container text-center bg-gray-50 my-16">
      {/* 标题区域 */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold leading-tight tracking-tighter text-[var(--text-primary)] md:text-5xl text-center mb-12">
          智赢用户反馈
        </h2>
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
          真实用户评价 · 用户信任 · 产品价值 · 持续改进
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="flex flex-col items-center">
        {/* 主要评价展示 */}
        <MainReviewSection />
        
        {/* 滚动评价区域 */}
        <ScrollableReviews />
      </div>
    </section>
  );
};

export default UserVoices;
