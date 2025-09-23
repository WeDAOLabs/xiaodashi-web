'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ContactSupport: React.FC = () => {
  const handleContactSupport = () => {
    // TODO: 实现联系支持团队的逻辑
    console.log('Contact support clicked');
  };

  return (
    <section>
      <Card className="bg-[var(--bg-primary)] p-6 rounded-lg shadow-sm border border-[var(--border-secondary)]">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">没有找到您想要的答案？</h3>
              <p className="text-sm text-[var(--text-secondary)] mt-1">我们的支持团队将很乐意为您提供帮助。</p>
            </div>
            <Button
              onClick={handleContactSupport}
              className="w-full md:w-auto bg-[var(--color-primary-500)] text-white px-5 py-2.5 rounded-lg hover:bg-[var(--color-primary-600)] transition-colors text-sm font-semibold flex-shrink-0"
            >
              联系支持团队
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default ContactSupport;