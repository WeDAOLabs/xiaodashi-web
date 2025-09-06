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
    return <span className="text-gray-800 font-medium">{content}</span>;
  };

  return (
    <div className="mt-32">
      <h2 className="text-center text-4xl font-bold text-gray-900 mb-16">功能比较</h2>
      
      {/* Desktop View: Table */}
      <div className="hidden md:block max-w-6xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-base text-left min-w-[700px]">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="px-8 py-5 font-semibold min-w-[250px]" scope="col">功能</th>
                <th className="px-8 py-5 text-center font-semibold" scope="col">个人版</th>
                <th className="px-8 py-5 text-center font-semibold" scope="col">专业版</th>
                <th className="px-8 py-5 text-center font-semibold" scope="col">企业版</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {features.map((feature) => (
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

      {/* Mobile View: Cards */}
      <div className="block md:hidden max-w-md mx-auto space-y-4">
        {features.map((feature) => (
          <div key={feature.name} className="p-4 bg-white rounded-lg border border-gray-200">
            <h4 className="font-bold text-lg text-gray-900 mb-4 text-center border-b pb-2">{feature.name}</h4>
            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <div>
                <p className="font-semibold text-gray-500 mb-1">个人版</p>
                <div>{renderCell(feature.personal)}</div>
              </div>
              <div>
                <p className="font-semibold text-gray-500 mb-1">专业版</p>
                <div>{renderCell(feature.professional)}</div>
              </div>
              <div>
                <p className="font-semibold text-gray-500 mb-1">企业版</p>
                <div>{renderCell(feature.enterprise)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default ComparisonTable;
