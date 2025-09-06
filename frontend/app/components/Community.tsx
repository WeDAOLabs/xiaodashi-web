import Link from 'next/link';
import { Button } from '@/app/components/ui/Button';

const Community = () => (
  <section className="rounded-2xl bg-gray-50 p-8 text-center sm:p-12">
    <h2 className="text-3xl font-bold leading-tight tracking-tighter text-gray-900 sm:text-4xl">
      加入我们的社区
    </h2>
    <p className="mx-auto mt-6 max-w-3xl text-base font-normal leading-relaxed text-gray-600 sm:text-lg">
      与成千上万的智商180的AI全域营销大师的用户交流，分享营销洞见，洞悉行业最新趋势。我们的社区是您学习与合作的宝贵平台。
    </p>
    <div className="mt-8 flex justify-center">
      <Button href="/community">立即加入</Button>
    </div>
  </section>
);

export default Community;
