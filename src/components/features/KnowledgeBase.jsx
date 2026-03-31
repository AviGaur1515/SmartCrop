import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, Leaf, Droplet, Bug, Shield, TrendingUp, X, ExternalLink } from 'lucide-react';

const KnowledgeBase = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedArticle, setSelectedArticle] = useState(null);

    const categories = [
        { id: 'all', name: 'All Topics', icon: BookOpen },
        { id: 'diseases', name: 'Diseases', icon: Bug },
        { id: 'prevention', name: 'Prevention', icon: Shield },
        { id: 'nutrition', name: 'Nutrition', icon: Leaf },
        { id: 'irrigation', name: 'Irrigation', icon: Droplet },
        { id: 'yield', name: 'Yield Tips', icon: TrendingUp }
    ];

    const articles = [
        {
            id: 1,
            category: 'diseases',
            title: 'Apple Scab: Complete Guide',
            description: 'Learn about apple scab disease, its symptoms, and treatment methods',
            content: `Apple scab is a fungal disease that affects apple trees. It causes dark, scabby lesions on leaves and fruit.
            
**Symptoms:**
- Olive-green or brown spots on leaves
- Velvety appearance on infected areas
- Fruit with corky, cracked lesions
- Premature leaf drop

**Treatment:**
1. Remove infected leaves and fruit
2. Apply fungicides during wet periods
3. Prune trees for better air circulation
4. Use resistant apple varieties

**Prevention:**
- Plant disease-resistant varieties
- Ensure proper spacing between trees
- Remove fallen leaves in autumn
- Apply preventive fungicide sprays`,
            tags: ['apple', 'fungal', 'scab']
        },
        {
            id: 2,
            category: 'prevention',
            title: 'Crop Rotation Best Practices',
            description: 'Maximize soil health and prevent disease buildup with proper rotation',
            content: `Crop rotation is essential for maintaining soil health and preventing disease and pest buildup.

**Benefits:**
- Reduces soil-borne diseases
- Improves soil structure
- Balances nutrient requirements
- Controls weed populations

**4-Year Rotation Example:**
Year 1: Legumes (beans, peas)
Year 2: Brassicas (cabbage, broccoli)
Year 3: Fruiting crops (tomatoes, peppers)
Year 4: Root vegetables (carrots, potatoes)

**Key Principles:**
1. Never plant the same family in succession
2. Follow heavy feeders with nitrogen-fixers
3. Rotate deep-rooted with shallow-rooted crops
4. Keep detailed records of planting`,
            tags: ['prevention', 'soil', 'rotation']
        },
        {
            id: 3,
            category: 'nutrition',
            title: 'Understanding NPK Ratios',
            description: 'Master fertilizer selection for optimal plant growth',
            content: `NPK stands for Nitrogen (N), Phosphorus (P), and Potassium (K) - the three essential macronutrients.

**Nitrogen (N):**
- Promotes leafy green growth
- Essential for chlorophyll production
- Deficiency: yellowing leaves
- Sources: urea, ammonium nitrate

**Phosphorus (P):**
- Supports root development
- Enhances flowering and fruiting
- Deficiency: purple-tinted leaves
- Sources: bone meal, rock phosphate

**Potassium (K):**
- Improves disease resistance
- Regulates water uptake
- Deficiency: brown leaf edges
- Sources: potash, wood ash

**Application Tips:**
- Test soil before fertilizing
- Apply during active growth periods
- Water after application
- Avoid over-fertilization`,
            tags: ['nutrition', 'fertilizer', 'NPK']
        },
        {
            id: 4,
            category: 'irrigation',
            title: 'Drip Irrigation Setup Guide',
            description: 'Save water and improve yields with efficient irrigation',
            content: `Drip irrigation delivers water directly to plant roots, reducing waste and disease.

**Advantages:**
- 90% water efficiency (vs 60% for sprinklers)
- Reduces weed growth
- Prevents foliar diseases
- Automated scheduling possible

**Components:**
1. Main water line
2. Filter system
3. Pressure regulator
4. Drip lines or emitters
5. End caps

**Installation Steps:**
1. Plan layout and measure
2. Install mainline and headers
3. Connect drip lines
4. Place emitters near plants
5. Test system and adjust flow
6. Add mulch to reduce evaporation

**Maintenance:**
- Flush system monthly
- Replace clogged emitters
- Check for leaks regularly`,
            tags: ['irrigation', 'water', 'drip']
        },
        {
            id: 5,
            category: 'yield',
            title: '10 Ways to Boost Crop Yield',
            description: 'Proven strategies to maximize your harvest',
            content: `Increase your farm productivity with these evidence-based techniques.

**1. Soil Testing**
Test soil pH and nutrients annually to optimize fertilizer use.

**2. Proper Spacing**
Follow recommended plant spacing to reduce competition.

**3. Mulching**
Apply organic mulch to retain moisture and suppress weeds.

**4. Companion Planting**
Plant complementary crops together (e.g., corn + beans + squash).

**5. Integrated Pest Management**
Use biological controls before chemicals.

**6. Timely Harvesting**
Harvest at peak ripeness to maximize quality.

**7. Quality Seeds**
Invest in certified, disease-resistant seed varieties.

**8. Proper Watering**
Water deeply but infrequently to encourage deep roots.

**9. Pruning**
Remove diseased or unproductive growth regularly.

**10. Record Keeping**
Track planting dates, yields, and conditions to improve each season.`,
            tags: ['yield', 'productivity', 'harvest']
        },
        {
            id: 6,
            category: 'diseases',
            title: 'Tomato Late Blight Control',
            description: 'Protect your tomatoes from this devastating disease',
            content: `Late blight can destroy an entire tomato crop in days if not managed properly.

**Identification:**
- Water-soaked lesions on leaves
- White fungal growth on undersides
- Brown spots on stems and fruit
- Rapid spread during humid weather

**Immediate Actions:**
1. Remove and destroy infected plants
2. Do NOT compost infected material
3. Apply copper-based fungicide
4. Improve air circulation

**Long-term Prevention:**
- Choose resistant varieties
- Use drip irrigation (avoid wetting foliage)
- Space plants properly
- Rotate crops annually
- Monitor weather (ideal: 60-70°F + humidity)

**Organic Solutions:**
- Copper sulfate sprays
- Bacillus subtilis products
- Neem oil applications`,
            tags: ['tomato', 'blight', 'fungal']
        }
    ];

    const filteredArticles = articles.filter(article => {
        const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
        const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="glass-card rounded-[3rem] p-10 shadow-2xl">
            <div className="flex items-center space-x-5 mb-10">
                <div className="h-16 w-16 bg-primary gradient-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                    <BookOpen className="h-9 w-9 text-slate-950" />
                </div>
                <div>
                    <h2 className="text-3xl font-display font-black text-slate-950 tracking-tight">
                        Knowledge <span className="text-primary italic">Base</span>
                    </h2>
                    <p className="text-sm font-medium text-slate-500">Expert guides and resources for farmers</p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-8">
                <div className="relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search articles, diseases, or topics..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border-2 border-slate-200 text-slate-950 pl-14 pr-6 py-4 rounded-2xl focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-medium placeholder:text-slate-400"
                    />
                </div>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-3 mb-8">
                {categories.map(category => {
                    const Icon = category.icon;
                    const isActive = selectedCategory === category.id;
                    return (
                        <motion.button
                            key={category.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center space-x-2 transition-all ${isActive
                                    ? 'bg-primary text-slate-950 shadow-lg shadow-primary/20'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            <Icon className="h-4 w-4" />
                            <span>{category.name}</span>
                        </motion.button>
                    );
                })}
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredArticles.map((article, index) => (
                    <motion.div
                        key={article.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                        onClick={() => setSelectedArticle(article)}
                        className="p-6 rounded-2xl bg-white border-2 border-slate-100 cursor-pointer hover:border-primary/30 hover:shadow-lg transition-all group"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <h3 className="font-display font-black text-slate-950 text-lg mb-2 group-hover:text-primary transition-colors">
                                    {article.title}
                                </h3>
                                <p className="text-sm text-slate-600 font-medium line-clamp-2">
                                    {article.description}
                                </p>
                            </div>
                            <ExternalLink className="h-5 w-5 text-slate-300 group-hover:text-primary transition-colors shrink-0 ml-4" />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {article.tags.map(tag => (
                                <span
                                    key={tag}
                                    className="px-3 py-1 rounded-lg bg-slate-100 text-xs font-bold text-slate-600"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>

            {filteredArticles.length === 0 && (
                <div className="text-center py-16">
                    <SearchX className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">No articles found matching your search</p>
                </div>
            )}

            {/* Article Modal */}
            <AnimatePresence>
                {selectedArticle && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedArticle(null)}
                        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 50 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-3xl p-10 max-w-3xl w-full max-h-[80vh] overflow-y-auto relative"
                        >
                            <button
                                onClick={() => setSelectedArticle(null)}
                                className="absolute top-6 right-6 h-10 w-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                            >
                                <X className="h-5 w-5 text-slate-600" />
                            </button>

                            <h2 className="text-3xl font-display font-black text-slate-950 mb-4 pr-12">
                                {selectedArticle.title}
                            </h2>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {selectedArticle.tags.map(tag => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 text-xs font-bold text-primary"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="prose prose-slate max-w-none">
                                {selectedArticle.content.split('\n').map((paragraph, i) => (
                                    <p key={i} className="text-slate-700 leading-relaxed mb-4 font-medium">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default KnowledgeBase;
