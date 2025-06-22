
const Stats = () => {
  const stats = [
    { number: "653", label: "Projects Done" },
    { number: "753", label: "Team Members" },
    { number: "428", label: "Awards Won" },
    { number: "932", label: "Global Partners" }
  ];

  return (
    <section className="py-20 bg-[#1e2a39] text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border border-white rounded-full"></div>
        <div className="absolute top-32 right-20 w-24 h-24 border border-white rounded-full"></div>
        <div className="absolute bottom-20 left-32 w-20 h-20 border border-white rounded-full"></div>
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-white">
                {stat.number}
              </div>
              <div className="text-gray-300 uppercase tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
