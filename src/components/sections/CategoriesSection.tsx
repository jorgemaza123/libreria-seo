"use client"

import { mockCategories } from '@/lib/mock-data';

export function CategoriesSection() {
  const activeCategories = mockCategories.filter((cat) => cat.isActive);

  return (
    <section className="py-12 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {activeCategories.map((category, index) => (
            <a
              key={category.id}
              href={`/#productos?category=${category.slug}`}
              className="group flex items-center gap-2 px-6 py-3 bg-card rounded-full shadow-sm hover:shadow-md transition-all hover:-translate-y-1 card-elevated animate-fade-up border border-border"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">
                {category.icon}
              </span>
              <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                {category.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}