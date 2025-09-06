import Image from 'next/image';

interface TestimonialProps {
  quote: string;
  author: string;
  title: string;
  avatarUrl: string;
}

const Testimonial: React.FC<TestimonialProps> = ({ quote, author, title, avatarUrl }) => {
  return (
    <div className="bg-white rounded-2xl p-8 flex flex-col justify-between border border-gray-200">
      <div className="flex-grow">
        <p className="text-lg text-[var(--text-secondary)] leading-relaxed">{quote}</p>
      </div>
      <div className="mt-8 flex items-center gap-4">
        <Image
          alt={author}
          className="w-14 h-14 rounded-full"
          src={avatarUrl}
          width={56}
          height={56}
        />
        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)]">{author}</p>
          <p className="text-sm text-[var(--text-secondary)]">{title}</p>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
