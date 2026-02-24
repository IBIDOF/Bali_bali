export interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  size?: string;
  condition: string;
  city: string;
  deliveryPrice: number;
  deliveryTime: string;
  description: string;
  images: string[];
  seller: {
    name: string;
    rating: number;
    sales: number;
    city: string;
    responseTime: string;
    yearsActive: number;
  };
  reviews: Review[];
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  verified: boolean;
}

export const categories = [
  { id: "all", label: "All", icon: "✨" },
  { id: "jackets", label: "Jackets", icon: "🧥" },
  { id: "pants", label: "Pants", icon: "👖" },
  { id: "tshirts", label: "T-shirts", icon: "👕" },
  { id: "tops", label: "Tops", icon: "👚" },
  { id: "dresses", label: "Dresses", icon: "👗" },
  { id: "accessories", label: "Accessories", icon: "💍" },
  { id: "shoes", label: "Shoes", icon: "👢" },
];

const seller = {
  name: "Amal Closet",
  rating: 4.7,
  sales: 32,
  city: "Casablanca",
  responseTime: "Within 1 hour",
  yearsActive: 2,
};

const sampleReviews: Review[] = [
  { id: "r1", author: "Sara M.", rating: 5, text: "Exactly as described! Great quality.", date: "2026-01-15", verified: true },
  { id: "r2", author: "Youssef K.", rating: 4, text: "Fast delivery, good condition.", date: "2026-01-10", verified: true },
  { id: "r3", author: "Fatima Z.", rating: 5, text: "Love it! Will buy again.", date: "2025-12-28", verified: true },
];

export const products: Product[] = [
  {
    id: "1",
    title: "Burgundy Faux Leather Jacket",
    category: "jackets",
    price: 220,
    size: "M",
    condition: "Used – good condition",
    city: "Casablanca",
    deliveryPrice: 29,
    deliveryTime: "24–48h",
    description: "Burgundy faux leather jacket with silver zipper details. Slight signs of wear but still in good condition. Perfect for autumn and winter outfits.",
    images: ["/images/burgundy-jacket.jpeg"],
    seller,
    reviews: sampleReviews,
  },
  {
    id: "2",
    title: "Black Leather Jacket",
    category: "jackets",
    price: 250,
    size: "S",
    condition: "Very good",
    city: "Rabat",
    deliveryPrice: 29,
    deliveryTime: "24–48h",
    description: "Classic black leather-style jacket with front zip and side pockets. Stylish and versatile for everyday wear.",
    images: ["/images/black-jacket.jpeg"],
    seller,
    reviews: sampleReviews.slice(0, 2),
  },
  {
    id: "3",
    title: "Blue High-Waisted Jeans",
    category: "pants",
    price: 120,
    size: "38",
    condition: "Good",
    city: "Marrakech",
    deliveryPrice: 29,
    deliveryTime: "24–48h",
    description: "Blue high-waisted jeans with straight-leg fit. Comfortable and easy to style with tops or jackets.",
    images: ["/images/blue-jeans.jpeg", "/images/blue-jeans-2.jpeg"],
    seller,
    reviews: sampleReviews,
  },
  {
    id: "4",
    title: "Black Winter Boots",
    category: "shoes",
    price: 180,
    size: "38",
    condition: "Good",
    city: "Casablanca",
    deliveryPrice: 29,
    deliveryTime: "24–48h",
    description: "Black winter boots with fur lining and lace detail. Warm and practical for cold weather.",
    images: ["/images/black-boots.jpeg"],
    seller,
    reviews: sampleReviews.slice(1),
  },
  {
    id: "5",
    title: "Gold Necklace",
    category: "accessories",
    price: 80,
    condition: "Like new",
    city: "Tangier",
    deliveryPrice: 19,
    deliveryTime: "24h",
    description: "Minimal gold-tone necklace, lightweight and elegant. Perfect for layering or everyday wear.",
    images: ["/images/gold-necklace.jpeg"],
    seller,
    reviews: sampleReviews,
  },
  {
    id: "6",
    title: "Green Necklace",
    category: "accessories",
    price: 70,
    condition: "Very good",
    city: "Agadir",
    deliveryPrice: 29,
    deliveryTime: "24–48h",
    description: "Green pendant necklace with subtle shine. Adds a pop of color to simple outfits.",
    images: ["/images/green-necklace.jpeg"],
    seller,
    reviews: sampleReviews.slice(0, 1),
  },
  {
    id: "7",
    title: "Pink Lefties Top",
    category: "tops",
    price: 90,
    size: "S",
    condition: "Very good",
    city: "Rabat",
    deliveryPrice: 29,
    deliveryTime: "24–48h",
    description: "Soft pink Lefties top, lightweight and comfortable. Ideal for casual or layered looks.",
    images: ["/images/pink-top.jpeg"],
    seller,
    reviews: sampleReviews,
  },
  {
    id: "8",
    title: "Grey Dress",
    category: "dresses",
    price: 140,
    size: "M",
    condition: "Very good",
    city: "Casablanca",
    deliveryPrice: 29,
    deliveryTime: "24–48h",
    description: "Simple grey dress with clean silhouette. Suitable for everyday wear or semi-formal occasions.",
    images: ["/images/grey-dress.jpeg"],
    seller,
    reviews: sampleReviews.slice(0, 2),
  },
  {
    id: "9",
    title: "Leopard Printed Dress",
    category: "dresses",
    price: 160,
    size: "S",
    condition: "Like new",
    city: "Marrakech",
    deliveryPrice: 29,
    deliveryTime: "24–48h",
    description: "Leopard print mini dress with adjustable straps and side detail. Trendy and perfect for outings.",
    images: ["/images/leopard-dress.jpeg"],
    seller,
    reviews: sampleReviews,
  },
];
