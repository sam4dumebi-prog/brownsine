export type CategoryDef = {
  id: string;
  name: string;
  slug: string;
  icon: string;
};

export const CATEGORIES: CategoryDef[] = [
  { id: "cat_phones", name: "Phones & Electronics", slug: "phones-electronics", icon: "📱" },
  { id: "cat_computers", name: "Computers & Laptops", slug: "computers-laptops", icon: "💻" },
  { id: "cat_fashion", name: "Fashion & Clothing", slug: "fashion-clothing", icon: "👗" },
  { id: "cat_shoes", name: "Shoes", slug: "shoes", icon: "👟" },
  { id: "cat_bags", name: "Bags", slug: "bags", icon: "👜" },
  { id: "cat_cars", name: "Cars", slug: "cars", icon: "🚗" },
  { id: "cat_houses", name: "Houses & Land", slug: "houses-land", icon: "🏠" },
  { id: "cat_food", name: "Food & Drinks", slug: "food-drinks", icon: "🍔" },
  { id: "cat_beauty", name: "Beauty Products", slug: "beauty-products", icon: "💄" },
  { id: "cat_appliances", name: "Home Appliances", slug: "home-appliances", icon: "🧺" },
  { id: "cat_gaming", name: "Gaming & Consoles", slug: "gaming-consoles", icon: "🎮" },
  { id: "cat_sports", name: "Sports Equipment", slug: "sports-equipment", icon: "⚽" },
  { id: "cat_accessories", name: "Accessories", slug: "accessories", icon: "⌚" },
  { id: "cat_other", name: "Other", slug: "other", icon: "🛍️" },
];

export function categoryBySlug(slug: string): CategoryDef | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function categoryById(id: string): CategoryDef | undefined {
  return CATEGORIES.find((c) => c.id === id);
}
