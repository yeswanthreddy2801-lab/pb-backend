-- 3 subscription plans
INSERT INTO subscription_plans (name, slug, description, category, base_price, max_items, color, icon) VALUES
('Veg Protein Box', 'veg-protein', 'Pure vegetarian protein sources', 'veg', 299, 6, '#16A34A', '🥗'),
('Non-Veg Protein Box', 'nonveg-protein', 'Egg and meat protein sources', 'nonveg', 399, 6, '#EA580C', '🍗'),
('High Protein Fitness Box', 'fitness-protein', 'Maximum protein for fitness goals', 'fitness', 499, 6, '#7C3AED', '💪');

-- 1 default admin (password: Admin@1234)
INSERT INTO admins (name, mobile, email, password_hash, role) VALUES
('Admin', '9999999999', 'admin@proteinbox.in', '$2b$10$m2uZ6S0yz6gKVKBWC7qQ3uW08yVrhqxXIXFDj8e4CrgPuBY2X63gG', 'superadmin');

-- 25 food items
INSERT INTO food_items (name, category, plan_type, protein_g, calories, price, emoji, color, description) VALUES
('Whole Egg', 'egg', 'nonveg', 6, 78, 8, '🥚', '#FEF9C3', 'Rich in complete protein'),
('Boiled Egg', 'egg', 'nonveg', 6.5, 72, 8, '🍳', '#FEF9C3', 'Easy digestible protein'),
('Paneer (100g)', 'dairy', 'veg', 18, 265, 35, '🧀', '#FFF7ED', 'High protein cottage cheese'),
('Curd (150g)', 'dairy', 'veg', 5, 98, 15, '🥛', '#F0FDF4', 'Probiotic-rich protein'),
('Milk (250ml)', 'dairy', 'veg', 8, 150, 20, '🥛', '#F0F9FF', 'Classic protein source'),
('Oats (50g)', 'grain', 'veg', 6.5, 189, 12, '🌾', '#FFFBEB', 'Slow-release energy'),
('Besan Chilla', 'grain', 'veg', 9, 180, 25, '🫓', '#FEF3C7', 'Protein-packed pancake'),
('Idli (2 pcs)', 'grain', 'veg', 4, 130, 20, '🍚', '#F8FAFC', 'Light fermented rice cake'),
('Poha (100g)', 'grain', 'veg', 3.5, 180, 18, '🍽️', '#FFFBEB', 'Flattened rice delight'),
('Upma (100g)', 'grain', 'veg', 4, 170, 20, '🫕', '#FEF3C7', 'Semolina protein bowl'),
('Sprouts (100g)', 'legume', 'veg', 8, 62, 15, '🌱', '#F0FDF4', 'Live enzymes and protein'),
('Chana (100g)', 'legume', 'veg', 19, 364, 20, '🫘', '#FEF9C3', 'High protein chickpeas'),
('Rajma (100g)', 'legume', 'veg', 24, 337, 22, '🫘', '#FEE2E2', 'Kidney bean powerhouse'),
('Moong Dal (100g)', 'legume', 'veg', 24, 347, 18, '🫛', '#ECFDF5', 'Easily digestible lentil'),
('Soya Chunks (50g)', 'legume', 'veg', 25, 173, 18, '🫘', '#EDE9FE', 'Highest plant protein'),
('Banana', 'fruit', 'veg', 1.3, 89, 10, '🍌', '#FEFCE8', 'Natural energy booster'),
('Apple', 'fruit', 'veg', 0.5, 52, 20, '🍎', '#FEF2F2', 'Fiber-rich morning fruit'),
('Sweet Potato', 'vegetable', 'veg', 2, 86, 15, '🍠', '#FFF7ED', 'Complex carbs and protein'),
('Peanuts (30g)', 'nut', 'veg', 7.7, 170, 12, '🥜', '#FEF3C7', 'Healthy fat and protein'),
('Protein Shake', 'supplement', 'both', 25, 130, 60, '🥤', '#EDE9FE', 'Whey protein blend'),
('Chicken Breast (100g)', 'meat', 'nonveg', 31, 165, 60, '🍗', '#FEF9C3', 'Lean muscle builder'),
('Fish Steamed (100g)', 'meat', 'nonveg', 22, 128, 55, '🐟', '#EFF6FF', 'Omega-3 rich protein'),
('Tofu (100g)', 'dairy', 'veg', 8, 76, 30, '🍱', '#F0FDF4', 'Plant-based protein block'),
('Greek Yogurt (150g)', 'dairy', 'veg', 15, 130, 40, '🥣', '#F8FAFC', 'Thick protein-rich yogurt'),
('Quinoa (75g)', 'grain', 'veg', 8, 222, 45, '🌾', '#ECFDF5', 'Complete amino acid grain');
