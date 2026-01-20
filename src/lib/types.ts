// Core types for the application
// Prepared for Supabase integration

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number;
  sku: string;
  category: string;
  categorySlug: string;
  stock?: number;
  image: string;
  gallery?: string[];
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  gallery?: string[];  // Imágenes para mostrar en el modal
  order: number;
  isActive: boolean;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  icon: string;
  price?: string;
  image?: string;
  isActive: boolean;
  order: number;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  image: string;
  discount?: number;
  discountType?: 'percentage' | 'fixed';
  startDate: string;
  endDate: string;
  isActive: boolean;
  products?: string[]; // Product IDs
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  order: number;
  isActive: boolean;
}

export interface ContactInfo {
  phone: string;
  whatsapp: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  hours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

export interface SiteContent {
  heroTitle: string;
  heroSubtitle: string;
  heroCTA: string;
  aboutTitle: string;
  aboutDescription: string;
  servicesTitle: string;
  servicesSubtitle: string;
  productsTitle: string;
  productsSubtitle: string;
  promotionsTitle: string;
  contactTitle: string;
  contactSubtitle: string;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  order: number;
  isVisible: boolean;
}

export interface InstagramPost {
  id: string;
  imageUrl: string;
  permalink: string;
  caption?: string;
}