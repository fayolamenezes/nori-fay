import { motion } from 'framer-motion';
import { FlaskConical, BookOpen, FileText, ExternalLink, Database, Brain, Leaf, Fish } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ResearchPage = () => {
  const references = [
    {
      id: 1,
      title: 'Co-Culture of Gracilariopsis longissima and Penaeus monodon in IMTA Systems',
      authors: 'R. W. Nauta et al.',
      journal: 'Sustainability',
      year: 2025,
      doi: '10.1234/example1',
    },
    {
      id: 2,
      title: 'Prediction of Shrimp Growth by Machine Learning with SHAP Explainability',
      authors: 'M. A. A. A. Mujahid et al.',
      journal: 'Aquaculture Journal',
      year: 2025,
      doi: '10.1234/example2',
    },
    {
      id: 3,
      title: 'A Unified Approach to Interpreting Model Predictions',
      authors: 'S. Lundberg, S. Lee',
      journal: 'NeurIPS',
      year: 2017,
      doi: '10.1234/example3',
    },
    {
      id: 4,
      title: 'The State of World Fisheries and Aquaculture',
      authors: 'FAO',
      journal: 'FAO Publications',
      year: 2024,
      doi: '10.1234/example4',
    },
  ];

  const sdgAlignments = [
    { id: 2, title: 'Zero Hunger', description: 'Sustainable food production through efficient aquaculture practices', color: 'bg-yellow-500' },
    { id: 13, title: 'Climate Action', description: 'Reduced environmental impact through IMTA co-culture systems', color: 'bg-green-600' },
    { id: 14, title: 'Life Below Water', description: 'Sustainable use of marine resources and ecosystem protection', color: 'bg-blue-500' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Research & Documentation"
        description="Scientific background and methodology documentation"
        icon={<FlaskConical className="w-6 h-6 text-accent" />}
      />

      <Tabs defaultValue="methodology" className="space-y-4">
        <TabsList className="bg-secondary">
          <TabsTrigger value="methodology">Methodology</TabsTrigger>
          <TabsTrigger value="references">References</TabsTrigger>
          <TabsTrigger value="sdg">SDG Alignment</TabsTrigger>
          <TabsTrigger value="data">Data Sources</TabsTrigger>
        </TabsList>

        <TabsContent value="methodology" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl border border-border p-6"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-accent" />
              Machine Learning Approach
            </h3>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Our system employs XGBoost and Random Forest algorithms trained on synthetic datasets 
                validated with real-world observations. The models predict shrimp growth rates based 
                on environmental parameters and historical data.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 rounded-lg bg-secondary/50">
                  <h4 className="font-medium text-foreground mb-2">Model Features</h4>
                  <ul className="text-sm space-y-1">
                    <li>• age_days (shrimp age)</li>
                    <li>• avg_weight_g (average weight)</li>
                    <li>• do_min_mg_l (dissolved oxygen)</li>
                    <li>• nh3_mg_l (ammonia)</li>
                    <li>• seaweed_biomass_kg</li>
                    <li>• TAN, temperature, pH</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50">
                  <h4 className="font-medium text-foreground mb-2">SHAP Explainability</h4>
                  <p className="text-sm">
                    SHAP (SHapley Additive exPlanations) is used to interpret model predictions, 
                    identifying which features most influence growth outcomes and providing 
                    actionable insights for farmers.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-xl border border-border p-6"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-seaweed" />
              IMTA Co-Culture System
            </h3>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Integrated Multi-Trophic Aquaculture (IMTA) combines shrimp (Penaeus monodon) with 
                seaweed (Gracilariopsis longissima) in a symbiotic relationship where seaweed 
                absorbs excess nutrients produced by shrimp, improving water quality naturally.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-seaweed/10 border border-seaweed/20">
                  <h4 className="font-medium text-seaweed mb-2">Seaweed Benefits</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Ammonia absorption (92% efficiency)</li>
                    <li>• Oxygen production during photosynthesis</li>
                    <li>• Nitrate removal from water</li>
                    <li>• Additional revenue stream</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-shrimp/10 border border-shrimp/20">
                  <h4 className="font-medium text-shrimp mb-2">Shrimp Benefits</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Improved water quality</li>
                    <li>• Reduced ammonia stress</li>
                    <li>• Natural habitat enrichment</li>
                    <li>• Better growth rates</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="references" className="space-y-4">
          {references.map((ref, index) => (
            <motion.div
              key={ref.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-xl border border-border p-5 hover:border-accent/30 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">{ref.title}</h4>
                  <p className="text-sm text-muted-foreground">{ref.authors}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {ref.journal}, {ref.year}
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="gap-1">
                  <ExternalLink className="w-4 h-4" />
                  DOI
                </Button>
              </div>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="sdg" className="space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-card rounded-xl border border-border p-6 mb-6"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">
              UN Sustainable Development Goals Alignment
            </h3>
            <p className="text-muted-foreground">
              This smart aquaculture system directly contributes to multiple UN SDGs through 
              sustainable food production, climate-conscious practices, and marine ecosystem protection.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sdgAlignments.map((sdg, index) => (
              <motion.div
                key={sdg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl border border-border p-5"
              >
                <div className={`w-12 h-12 ${sdg.color} rounded-lg flex items-center justify-center mb-4`}>
                  <span className="text-2xl font-bold text-white">{sdg.id}</span>
                </div>
                <h4 className="font-semibold text-foreground mb-2">SDG {sdg.id}: {sdg.title}</h4>
                <p className="text-sm text-muted-foreground">{sdg.description}</p>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl border border-border p-6"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-accent" />
              Data Sources & Validation
            </h3>
            <div className="space-y-4 text-muted-foreground">
              <p>
                The system uses both synthetic datasets for model training and real-world 
                observations for validation. Data collection includes:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-secondary/50">
                  <h4 className="font-medium text-foreground mb-2">Synthetic Datasets</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Nutrient uptake patterns</li>
                    <li>• Weekly shrimp growth data</li>
                    <li>• Environmental parameter ranges</li>
                    <li>• 10,000+ data points</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50">
                  <h4 className="font-medium text-foreground mb-2">Real-World Validation</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Field observations from IMTA farms</li>
                    <li>• Expert validation (Harini Ma'am)</li>
                    <li>• Continuous sensor data streams</li>
                    <li>• Peer-reviewed literature</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-xl border border-border p-6"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Key Environmental Thresholds
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-muted-foreground">Parameter</th>
                    <th className="text-left py-2 text-muted-foreground">Optimal Range</th>
                    <th className="text-left py-2 text-muted-foreground">Critical Threshold</th>
                    <th className="text-left py-2 text-muted-foreground">SHAP Impact</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="py-2 text-foreground">Dissolved Oxygen</td>
                    <td className="py-2">5.0 - 8.0 mg/L</td>
                    <td className="py-2 text-destructive">&lt; 4.0 mg/L</td>
                    <td className="py-2 text-seaweed">+0.18</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 text-foreground">Ammonia (NH₃)</td>
                    <td className="py-2">0 - 0.05 mg/L</td>
                    <td className="py-2 text-destructive">&gt; 0.1 mg/L</td>
                    <td className="py-2 text-destructive">-0.04</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 text-foreground">Temperature</td>
                    <td className="py-2">27 - 30°C</td>
                    <td className="py-2 text-destructive">&gt; 32°C</td>
                    <td className="py-2 text-seaweed">+0.08</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-foreground">Seaweed Biomass</td>
                    <td className="py-2">&gt; 100 kg</td>
                    <td className="py-2 text-warning">&lt; 50 kg</td>
                    <td className="py-2 text-seaweed">+0.12</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResearchPage;
