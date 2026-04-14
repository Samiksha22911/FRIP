import { motion } from "framer-motion";
import { Shield, GraduationCap, UserCog } from "lucide-react";

const roles = [
  {
    icon: Shield,
    title: "Admin",
    color: "bg-primary/10 text-primary",
    items: [
      "Create and manage dynamic forms",
      "Send notifications to all users",
      "View institution-wide analytics",
      "Manage faculty and HOD accounts",
      "Generate research rankings",
    ],
  },
  {
    icon: UserCog,
    title: "Head of Department",
    color: "bg-accent/10 text-accent",
    items: [
      "View department-level rankings",
      "Monitor faculty research output",
      "Send department notifications",
      "Access graphical analytics",
      "Review submitted research data",
    ],
  },
  {
    icon: GraduationCap,
    title: "Faculty",
    color: "bg-emerald-500/10 text-emerald-600",
    items: [
      "Fill out research submission forms",
      "Track personal research history",
      "View personal ranking and score",
      "Receive notifications & updates",
      "Update profile and publications",
    ],
  },
];

const RolesSection = () => {
  return (
    <section id="roles" className="py-20 md:py-28 bg-card border-y border-border">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Built for Every Role
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Three distinct dashboards designed for the unique needs of each user type.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {roles.map((role, i) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="p-8 rounded-xl bg-background border border-border"
              style={{ boxShadow: "var(--card-shadow)" }}
            >
              <div className={`w-12 h-12 rounded-xl ${role.color} flex items-center justify-center mb-5`}>
                <role.icon className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-foreground mb-4">{role.title}</h3>
              <ul className="space-y-3">
                {role.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RolesSection;
