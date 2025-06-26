const StatCard = ({ icon, title, value, description }) => {
    return (
      <div className="bg-secondary p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-tertiary text-accent">
            {icon}
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-text-secondary uppercase">{title}</p>
            <p className="text-2xl font-bold text-text-primary">{value}</p>
          </div>
        </div>
        <p className="text-sm text-text-secondary mt-4">{description}</p>
      </div>
    );
};
  
export default StatCard;