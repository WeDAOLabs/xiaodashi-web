import Image from 'next/image';

interface ContactSalesModalProps {
  onClose: () => void;
}

const ContactSalesModal = ({ onClose }: ContactSalesModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center relative border border-gray-200/50">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 h-8 w-8 rounded-full bg-black/10 flex items-center justify-center text-gray-600 hover:bg-black/20 hover:text-gray-800 transition-all duration-300"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">联系销售顾问</h2>
        <p className="text-gray-600 mb-6">微信扫码，开启增长之旅</p>
        <div className="my-4 bg-white p-4 rounded-xl border border-gray-200 shadow-lg inline-block">
          <Image
            src="/qr-code-saler.png"
            alt="销售顾问微信二维码"
            width={200}
            height={200}
            className="rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactSalesModal;
