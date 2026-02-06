import { motion } from 'framer-motion';
import { FileText, Download, Calendar, Plus, TrendingUp, Fish, Leaf, Droplets } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';

const mockReports = [
  { id: 1, type: 'weekly', title: 'Weekly Growth Report - Week 7', date: new Date(Date.now() - 86400000), summary: 'Average growth rate of 2.3g/week achieved' },
  { id: 2, type: 'daily', title: 'Daily Environmental Summary', date: new Date(Date.now() - 172800000), summary: 'All parameters within optimal range' },
  { id: 3, type: 'monthly', title: 'Monthly Production Report - January', date: new Date(Date.now() - 604800000), summary: 'Survival rate: 96.8%, FCR: 1.42' },
  { id: 4, type: 'weekly', title: 'Weekly Growth Report - Week 6', date: new Date(Date.now() - 1209600000), summary: 'Slight DO fluctuations observed' },
];

const Reports = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Generate and view system reports"
        icon={<FileText className="w-6 h-6 text-accent" />}
        actions={
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Calendar className="w-4 h-4" />
              Schedule Report
            </Button>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Generate New
            </Button>
          </div>
        }
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl border border-border p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-shrimp/10 flex items-center justify-center">
              <Fish className="w-5 h-5 text-shrimp" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Shrimp</p>
              <p className="text-xl font-bold text-foreground font-mono">15,000</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-seaweed">
            <TrendingUp className="w-3 h-3" />
            <span>96.8% survival rate</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl border border-border p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-seaweed/10 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-seaweed" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Seaweed Biomass</p>
              <p className="text-xl font-bold text-foreground font-mono">125 kg</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-seaweed">
            <TrendingUp className="w-3 h-3" />
            <span>+8.5% this week</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl border border-border p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Droplets className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Water Quality</p>
              <p className="text-xl font-bold text-seaweed">Optimal</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>All parameters in range</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-xl border border-border p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-coral/10 flex items-center justify-center">
              <span className="text-lg">📊</span>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">FCR</p>
              <p className="text-xl font-bold text-foreground font-mono">1.42</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-seaweed">
            <span>Better than target (1.6)</span>
          </div>
        </motion.div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="bg-secondary">
          <TabsTrigger value="all">All Reports</TabsTrigger>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {mockReports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card rounded-xl border border-border p-5 flex items-center justify-between hover:border-accent/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{report.title}</h4>
                  <p className="text-sm text-muted-foreground">{report.summary}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Generated: {format(report.date, 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                  report.type === 'daily' ? 'bg-accent/10 text-accent' :
                  report.type === 'weekly' ? 'bg-seaweed/10 text-seaweed' :
                  'bg-coral/10 text-coral'
                }`}>
                  {report.type}
                </span>
                <Button variant="ghost" size="icon">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="daily">
          {mockReports.filter(r => r.type === 'daily').map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-card rounded-xl border border-border p-5"
            >
              <h4 className="font-semibold text-foreground">{report.title}</h4>
              <p className="text-sm text-muted-foreground">{report.summary}</p>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="weekly">
          {mockReports.filter(r => r.type === 'weekly').map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-card rounded-xl border border-border p-5"
            >
              <h4 className="font-semibold text-foreground">{report.title}</h4>
              <p className="text-sm text-muted-foreground">{report.summary}</p>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="monthly">
          {mockReports.filter(r => r.type === 'monthly').map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-card rounded-xl border border-border p-5"
            >
              <h4 className="font-semibold text-foreground">{report.title}</h4>
              <p className="text-sm text-muted-foreground">{report.summary}</p>
            </motion.div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
