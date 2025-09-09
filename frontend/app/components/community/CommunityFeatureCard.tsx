// Community feature card component - high cohesion, low coupling
interface CommunityFeatureCardProps {
  title: string;
  description: string;
  detailedDescription: string;
  iconPath: string;
}

const CommunityFeatureCard = ({ title, description, detailedDescription, iconPath }: CommunityFeatureCardProps) => (
  <div className="rounded-xl p-6 border border-gray-200 bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-lg transition-all duration-300">
    {/* Icon positioned on the left with better spacing */}
    <div className="flex items-start gap-4 mb-4">
      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-[var(--primary-color)]/10 to-[var(--accent-color)]/10 flex items-center justify-center">
        <svg className="w-6 h-6 text-[var(--primary-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
        </svg>
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
    {/* Detailed description with better spacing */}
    <p className="text-sm text-gray-700 leading-relaxed pl-16">{detailedDescription}</p>
  </div>
);

export default CommunityFeatureCard;