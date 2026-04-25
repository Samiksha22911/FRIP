import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { api, formatCompact, type PortalStats } from "@/lib/api";

const StatsSection = () => {
  const [portalStats, setPortalStats] = useState<PortalStats>({
    facultyMembers: 500,
    researchPapers: 10000,
    departments: 50,
    digitalTracking: 100,
  });

  useEffect(() => {
    api.portalStats().then(setPortalStats);
  }, []);

  const liveStats = [
    { value: formatCompact(portalStats.facultyMembers), label: "Faculty Members" },
    { value: formatCompact(portalStats.researchPapers), label: "Research Papers" },
    { value: formatCompact(portalStats.departments), label: "Departments" },
    { value: `${portalStats.digitalTracking}%`, label: "Digital Tracking" },
  ];

  return (
    <section className="py-16 border-y border-border bg-card">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {liveStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
