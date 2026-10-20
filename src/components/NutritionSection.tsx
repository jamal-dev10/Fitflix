import React, { useState } from 'react';
import { RECIPES } from '../data/fitnessData';
import { Recipe } from '../types';
import { Utensils, Check, ChefHat, Clock, Sparkles } from 'lucide-react';

export const NutritionSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<0 | 1 | 2>(0);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const pillars = [
    {
      title: 'Tailored Meal Plans for Your Unique Goals and Lifestyle',
      nav: 'PERSONALIZED MEAL PLANS',
      image: '/assets/img/nutri3.jpg',
      description:
        'We offer customized meal plans based on your goals, dietary preferences, and lifestyle. We can create meal plans for weight loss, muscle gain, improved energy levels, or specific health conditions.',
      highlights: [
        'Precise caloric and macronutrient targets calculated for your metabolism',
        'Custom grocery lists categorized for efficient weekly shopping',
        'Vegetarian, vegan, keto, and paleo adaptations readily available',
        'Weekly adjustments based on body composition and scale progress'
      ]
    },
    {
      title: 'Unlock the Power of Healthy Food Choices and Balanced Meal Creation',
      nav: 'NUTRITIONAL COACHING',
      image: '/assets/img/nutri1.jpg',
      description:
        'We provide one-on-one coaching to help you make healthy food choices and learn how to create balanced meals. We can also educate you on the importance of macronutrients (carbohydrates, proteins, and fats) and micronutrients (vitamins and minerals).',
      highlights: [
        'Dedicated 1-on-1 bi-weekly check-ins with our sports dietitian',
        'Behavioral coaching to eliminate chronic sugar cravings and binge eating',
        'Peri-workout timing protocols to maximize gym energy and fast recovery',
        'Supplement auditing to stop wasting money on ineffective products'
      ]
    },
    {
      title: 'Discover our Extensive Database of Healthy Recipes',
      nav: 'RECIPE DATABASE',
      image: '/assets/img/nutri2.jpg',
      description:
        'We create a database of healthy recipes that you can access to make meal planning and prep easier. We can categorize the recipes by meal type, dietary preference, and ingredients.',
      highlights: [
        'Over 120+ high-protein, chef-approved fitness recipes',
        'Under 30-minute quick-prep meals designed for busy professionals',
        'Full macro breakdowns verified with raw ingredient weights',
        'Batch-cooking and meal prep container storage guides'
      ]
    }
  ];

  return (
    <section id="nutrition" className="py-24 bg-neutral-950 text-white border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Mark icon */}
        <div className="flex items-center gap-4 mb-4">
          <img
            src="/assets/img/mark.png"
            alt="FitFlex Mark"
            className="w-7 h-7 object-contain"
          />
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white">
            Nutrition
          </h2>
        </div>

        <p className="text-neutral-400 text-sm sm:text-base max-w-3xl mb-12 leading-relaxed">
          Our nutrition guides will help you to excel in achieving your goals. Food is fuel: optimize what you eat
          to maximize gym performance and body recomposition.
        </p>

        {/* 3 Nav Tabs matching original FitFlex */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 border-b border-neutral-800 pb-2 mb-10">
          {pillars.map((pillar, idx) => (
            <button
              key={pillar.nav}
              onClick={() => {
                setActiveTab(idx as 0 | 1 | 2);
                setSelectedRecipe(null);
              }}
              className={`py-3.5 px-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-center transition-all duration-200 cursor-pointer ${
                activeTab === idx
                  ? 'bg-[#FFFF00] text-black shadow-md'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {pillar.nav}
            </button>
          ))}
        </div>

        {/* Active Pillar Card (Original style with modern polish) */}
        <div className="bg-neutral-900 border border-neutral-800 overflow-hidden mb-14 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            <div className="lg:col-span-5 relative min-h-[340px] overflow-hidden">
              <img
                src={pillars[activeTab].image}
                alt={pillars[activeTab].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/80 lg:from-transparent via-transparent to-transparent" />
            </div>

            <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
              <span className="text-xs uppercase font-bold tracking-widest text-[#FFFF00] mb-2">
                Pillar 0{activeTab + 1} // Nutrition Science
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white mb-4 leading-tight">
                {pillars[activeTab].title}
              </h3>
              <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-6">
                {pillars[activeTab].description}
              </p>

              <div className="space-y-2.5 mb-8">
                {pillars[activeTab].highlights.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-300">
                    <Check className="w-4 h-4 text-[#FFFF00] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {activeTab === 2 && (
                <div>
                  <button
                    onClick={() => {
                      const recipeAnchor = document.querySelector('#recipe-showcase');
                      recipeAnchor?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#FFFF00] text-black font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors cursor-pointer"
                  >
                    <Utensils className="w-4 h-4" />
                    <span>Explore Featured Recipes Below</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Featured High-Protein Recipe Showcase */}
        <div id="recipe-showcase">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FFFF00] mb-1">
                <ChefHat className="w-4 h-4" />
                <span>Chef Curated Macro Kitchen</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-wide text-white">
                Featured Muscle Fuel Recipes
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {RECIPES.map((recipe) => (
              <div
                key={recipe.id}
                className="bg-neutral-900 border border-neutral-800 flex flex-col justify-between overflow-hidden hover:border-neutral-700 transition-all duration-300 group"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-black">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-black/80 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#FFFF00] border border-neutral-800">
                      {recipe.mealType}
                    </div>
                    <div className="absolute top-3 right-3 bg-black/80 px-2 py-1 text-[11px] text-neutral-300 flex items-center gap-1 border border-neutral-800">
                      <Clock className="w-3 h-3 text-[#FFFF00]" />
                      <span>{recipe.prepTime}</span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h4 className="text-lg font-bold uppercase tracking-wide text-white mb-2 group-hover:text-[#FFFF00] transition-colors">
                      {recipe.title}
                    </h4>
                    <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed mb-4">
                      {recipe.description}
                    </p>

                    {/* Macro Strip */}
                    <div className="grid grid-cols-4 gap-1 p-2 bg-neutral-950 border border-neutral-800 text-center mb-4">
                      <div>
                        <div className="text-xs font-bold text-white tabular-nums">{recipe.calories}</div>
                        <div className="text-[10px] text-neutral-500 uppercase">kcal</div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#FFFF00] tabular-nums">{recipe.protein}g</div>
                        <div className="text-[10px] text-neutral-500 uppercase">Protein</div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-neutral-300 tabular-nums">{recipe.carbs}g</div>
                        <div className="text-[10px] text-neutral-500 uppercase">Carbs</div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-neutral-300 tabular-nums">{recipe.fat}g</div>
                        <div className="text-[10px] text-neutral-500 uppercase">Fat</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => setSelectedRecipe(selectedRecipe?.id === recipe.id ? null : recipe)}
                    className="w-full py-2.5 bg-neutral-800 hover:bg-[#FFFF00] text-white hover:text-black font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    {selectedRecipe?.id === recipe.id ? 'Close Details' : 'View Ingredients & Prep'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Expanded Recipe Detail Card */}
          {selectedRecipe && (
            <div className="mt-8 p-6 sm:p-8 bg-neutral-900 border border-[#FFFF00] animate-in fade-in duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-4 mb-6">
                <div>
                  <span className="text-xs font-bold uppercase text-[#FFFF00] tracking-wider block mb-1">
                    {selectedRecipe.mealType} · {selectedRecipe.prepTime} Prep
                  </span>
                  <h4 className="text-2xl font-bold uppercase text-white">
                    {selectedRecipe.title}
                  </h4>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs text-neutral-400 block">Total Fuel</span>
                    <span className="text-lg font-bold text-[#FFFF00]">{selectedRecipe.calories} kcal</span>
                  </div>
                  <button
                    onClick={() => setSelectedRecipe(null)}
                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs font-bold uppercase text-white cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h5 className="text-sm font-bold uppercase tracking-wider text-white mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#FFFF00]" />
                    <span>Ingredients Required:</span>
                  </h5>
                  <ul className="space-y-2">
                    {selectedRecipe.ingredients.map((ing, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs sm:text-sm text-neutral-300 bg-neutral-950 p-2.5 border border-neutral-800/80">
                        <Check className="w-3.5 h-3.5 text-[#FFFF00] shrink-0" />
                        <span>{ing}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="text-sm font-bold uppercase tracking-wider text-white mb-3 flex items-center gap-2">
                    <ChefHat className="w-4 h-4 text-[#FFFF00]" />
                    <span>Preparation Method:</span>
                  </h5>
                  <ol className="space-y-3">
                    {selectedRecipe.instructions.map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-neutral-300 bg-neutral-950 p-3 border border-neutral-800/80">
                        <span className="w-5 h-5 bg-[#FFFF00] text-black font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
