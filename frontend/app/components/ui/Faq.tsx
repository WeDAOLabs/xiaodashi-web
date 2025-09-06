import PlusIcon from './PlusIcon';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqProps {
  title: string;
  items: FaqItem[];
}

const FaqItem: React.FC<FaqItem> = ({ question, answer }) => (
  <details className="group rounded-xl bg-white border border-gray-200 overflow-hidden">
    <summary className="flex cursor-pointer items-center justify-between p-6 list-none">
      <h3 className="text-lg font-semibold text-gray-900">{question}</h3>
      <div className="text-gray-500 group-open:rotate-45 transition-transform">
        <PlusIcon />
      </div>
    </summary>
    <div className="px-6 pb-6 text-gray-600">
      {answer}
    </div>
  </details>
);

const Faq: React.FC<FaqProps> = ({ title, items }) => {
  return (
    <div className="mt-32">
      <h2 className="text-center text-4xl font-bold text-gray-900 mb-16">{title}</h2>
      <div className="max-w-3xl mx-auto flex flex-col gap-4">
        {items.map(item => (
          <FaqItem key={item.question} question={item.question} answer={item.answer} />
        ))}
      </div>
    </div>
  );
};

export default Faq;
