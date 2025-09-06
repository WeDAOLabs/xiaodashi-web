import PlusIcon from './PlusIcon';

interface FaqItemProps {
  question: string;
  children: React.ReactNode;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, children }) => (
  <details className="group rounded-xl bg-white border border-gray-200 overflow-hidden">
    <summary className="flex cursor-pointer items-center justify-between p-6 list-none">
      <h3 className="text-lg font-semibold text-gray-900">{question}</h3>
      <div className="text-gray-500 group-open:rotate-45 transition-transform">
        <PlusIcon />
      </div>
    </summary>
    <div className="px-6 pb-6 text-gray-600">
      {children}
    </div>
  </details>
);

const Faq = () => {
  const faqItems = [
    {
      question: '我该如何订阅？',
      answer: '只需选择您想要的方案，点击“选择”或“免费开始”按钮，然后按照屏幕上的指示完成注册和支付流程即可。整个过程只需几分钟。'
    },
    {
      question: '我可以随时更改或取消我的计划吗？',
      answer: '是的，您可以随时在您的账户设置中轻松升级、降级或取消您的计划。更改将立即生效。'
    },
    {
      question: '支持哪些付款方式？',
      answer: '我们接受所有主流信用卡（Visa, MasterCard, American Express），以及支付宝和微信支付，为您提供灵活便捷的支付选择。'
    }
  ];

  return (
    <div className="mt-32">
      <h2 className="text-center text-4xl font-bold text-gray-900 mb-16">常见问题</h2>
      <div className="max-w-3xl mx-auto flex flex-col gap-4">
        {faqItems.map(item => (
          <FaqItem key={item.question} question={item.question}>
            {item.answer}
          </FaqItem>
        ))}
      </div>
    </div>
  );
};

export default Faq;
