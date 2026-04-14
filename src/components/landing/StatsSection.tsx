import { motion } from "framer-motion";

const stats = [
  { value: "500+", label: "Faculty Members" },
  { value: "10K+", label: "Research Papers" },
  { value: "50+", label: "Departments" },
  { value: "100%", label: "Digital Tracking" },
];

const StatsSection = () => {
  return (
    <section className="py-16 border-y border-border bg-card">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
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
