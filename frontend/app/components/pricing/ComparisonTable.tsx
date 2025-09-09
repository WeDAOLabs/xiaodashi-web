import CheckIcon from '@/app/components/ui/CheckIcon';

const ComparisonTable = () => {
  const features = [
    { name: 'AI内容创作', individual: '基础工具', semiAuto: '高级优化', fullAuto: '全链路自动化' },
    { name: '营销策略规划', individual: '简单建议', semiAuto: '智能规划', fullAuto: '高级战略支持' },
    { name: '数据分析洞察', individual: '基础分析', semiAuto: '深度洞察', fullAuto: '企业级分析' },
    { name: '多渠道营销', individual: null, semiAuto: '自动化执行', fullAuto: '全渠道智能运营' },
    { name: '专属客户经理', individual: null, semiAuto: true, fullAuto: true },
    { name: '技术支持', individual: '邮件支持', semiAuto: '7x24小时', fullAuto: '专业团队驻场' },
    { name: '品牌资产管理', individual: null, semiAuto: null, fullAuto: true },
    { name: '定制化解决方案', individual: null, semiAuto: null, fullAuto: true }
  ];

  const renderCell = (content: string | boolean | null) => {
    if (content === null) {
      return <span className="text-[var(--text-secondary)]">-</span>;
    }
    if (typeof content === 'boolean' && content) {
      return <CheckIcon className="w-4 h-4 md:w-6 md:h-6 mx-auto text-[var(--primary-color)]" />;
    }
    return <span className="text-[var(--text-primary)] font-medium text-xs md:text-sm">{content}</span>;
  };

  return (
    <div className="mt-32">
      <h2 className="text-center text-4xl font-bold text-[var(--text-primary)] mb-16">功能比较</h2>
      
      {/* Desktop View: Table */}
      <div className="hidden md:block max-w-6xl mx-auto">
        <div className="bg-[var(--background-color)] rounded-xl border border-[var(--border-color)] overflow-x-auto">
          <table className="w-full text-base text-left min-w-[700px]">
            <thead className="border-b border-[var(--border-color)]">
              <tr>
                <th className="px-8 py-5 font-semibold min-w-[250px]" scope="col">功能</th>
                <th className="px-8 py-5 text-center font-semibold" scope="col">超级个体</th>
                <th className="px-8 py-5 text-center font-semibold" scope="col">企业半自动化</th>
                <th className="px-8 py-5 text-center font-semibold" scope="col">企业全自动化</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-secondary)]">
              {features.map((feature) => (
                <tr key={feature.name} className="border-b border-[var(--border-color)] last:border-b-0">
                  <th className="px-8 py-4 font-medium text-[var(--text-primary)] whitespace-nowrap" scope="row">{feature.name}</th>
                  <td className="px-8 py-4 text-center">{renderCell(feature.individual)}</td>
                  <td className="px-8 py-4 text-center">{renderCell(feature.semiAuto)}</td>
                  <td className="px-8 py-4 text-center">{renderCell(feature.fullAuto)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile View: Cards */}
      <div className="block md:hidden max-w-md mx-auto space-y-4">
        {features.map((feature) => (
          <div key={feature.name} className="p-4 bg-[var(--background-color)] rounded-lg border border-[var(--border-color)]">
            <h4 className="font-bold text-lg text-[var(--text-primary)] mb-4 text-center border-b pb-2">{feature.name}</h4>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <p className="font-semibold text-[var(--text-secondary)] mb-1 leading-tight">超级个体</p>
                <div className="text-xs">{renderCell(feature.individual)}</div>
              </div>
              <div>
                <p className="font-semibold text-[var(--text-secondary)] mb-1 leading-tight">企业半自动</p>
                <div className="text-xs">{renderCell(feature.semiAuto)}</div>
              </div>
              <div>
                <p className="font-semibold text-[var(--text-secondary)] mb-1 leading-tight">企业全自动</p>
                <div className="text-xs">{renderCell(feature.fullAuto)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default ComparisonTable;
