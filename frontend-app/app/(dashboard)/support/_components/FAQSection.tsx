'use client';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: '如何重置我的密码？',
    answer: '您可以在登录页点击"忘记密码"链接，然后按照屏幕上的指示进行操作。系统将向您的注册邮箱发送一封包含重置链接的邮件。'
  },
  {
    question: '智赢平台支持哪些付款方式？',
    answer: '我们支持多种付款方式，包括主流信用卡（Visa, MasterCard, American Express）、借记卡以及银行转账。所有交易都经过安全加密处理。'
  },
  {
    question: '如何创建一个新的营销活动？',
    answer: '登录您的账户后，点击导航栏的"营销活动"，然后点击"创建新活动"按钮。按照引导流程填写活动详情、设置目标受众和预算即可。'
  },
  {
    question: '我可以邀请团队成员协作吗？',
    answer: '是的，在"账户设置"中的"团队管理"部分，您可以邀请新成员加入您的工作区，并为他们分配不同的角色和权限。'
  }
];

const FAQSection: React.FC = () => {
  return (
    <section>
      <h2 className="text-lg font-semibold mb-5 text-[var(--text-primary)]">常见问题 (FAQ)</h2>
      <div className="space-y-4">
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqData.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="bg-[var(--bg-primary)] border border-[var(--border-secondary)] rounded-lg shadow-sm transition-all duration-300">
              <AccordionTrigger className="w-full flex justify-between items-center p-5 text-left hover:no-underline">
                <span className="font-semibold text-sm text-[var(--text-primary)]">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-5">
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {faq.answer}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;