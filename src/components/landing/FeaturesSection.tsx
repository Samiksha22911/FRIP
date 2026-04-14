import { motion } from "framer-motion";
import { BarChart3, Bell, FileText, Award, Users, BookOpen } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Dynamic Forms",
    description: "Admin creates custom forms for publications, conferences, books, and more — faculty fills them in seamlessly.",
  },
  {
    icon: BarChart3,
    title: "Visual Rankings",
    description: "Graphical dashboards display faculty rankings based on research contributions across departments.",
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Admins and HODs can broadcast announcements, deadlines, and updates to all faculty members.",
  },
  {
    icon: Award,
    title: "Research Tracking",
    description: "Track publications, patents, conferences, book chapters, and funded projects in one place.",
  },
  {
    icon: Users,
    title: "Role-Based Access",
    description: "Three distinct roles — Admin, HOD, and Faculty — each with tailored dashboards and permissions.",
  },
  {
    icon: BookOpen,
    title: "Department Analytics",
    description: "HODs get department-level insights showing research output, trends, and faculty performance.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 md:py-28">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Replace manual Google Forms and spreadsheets with a purpose-built research management platform.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="group p-6 rounded-xl bg-card border border-border hover:border-accent/30 transition-all duration-300"
              style={{ boxShadow: "var(--card-shadow)" }}
            >
              <div className="w-11 h-11 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <feature.icon className="h-5 w-5 text-accent" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
