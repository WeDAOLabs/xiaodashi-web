import CheckIcon from './CheckIcon';

const ComparisonTable = () => {
  const features = [
    { name: 'AI 营销活动', personal: '每月 5 次', professional: '无限制', enterprise: '无限制' },
    { name: '关键词研究', personal: '基础', professional: '高级', enterprise: '高级' },
    { name: '社交媒体管理', personal: '1 个账户', professional: '10 个账户', enterprise: '无限制' },
    { name: '高级数据分析', personal: null, professional: true, enterprise: true },
    { name: '专属客户经理', personal: null, professional: null, enterprise: true },
  ];

  const renderCell = (content: string | boolean | null) => {
    if (content === null) {
      return <span className="text-gray-400">-</span>;
    }
    if (typeof content === 'boolean' && content) {
      return <CheckIcon className="w-6 h-6 mx-auto text-blue-600" />;
    }
    return content;
  };

  return (
    <div className="mt-32">
      <h2 className="text-center text-4xl font-bold text-gray-900 mb-16">功能比较</h2>
      <div className="max-w-6xl mx-auto overflow-x-auto">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-base text-left">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="px-8 py-5 font-semibold min-w-[250px]" scope="col">功能</th>
                <th className="px-8 py-5 text-center font-semibold" scope="col">个人版</th>
                <th className="px-8 py-5 text-center font-semibold" scope="col">专业版</th>
                <th className="px-8 py-5 text-center font-semibold" scope="col">企业版</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {features.map((feature, index) => (
                <tr key={feature.name} className="border-b border-gray-200 last:border-b-0">
                  <th className="px-8 py-4 font-medium text-gray-900 whitespace-nowrap" scope="row">{feature.name}</th>
                  <td className="px-8 py-4 text-center">{renderCell(feature.personal)}</td>
                  <td className="px-8 py-4 text-center">{renderCell(feature.professional)}</td>
                  <td className="px-8 py-4 text-center">{renderCell(feature.enterprise)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ComparisonTable;
