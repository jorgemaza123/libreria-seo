import { Metadata } from 'next';
import { HomeClientWrapper } from '@/components/home/HomeClientWrapper';
import { seoConfig } from '@/lib/seo';

export const metadata: Metadata = {
  title: seoConfig.defaultTitle,
  description: seoConfig.defaultDescription,
  openGraph: {
    title: seoConfig.defaultTitle,
    description: seoConfig.defaultDescription,
    images: [
      {
        url: seoConfig.defaultImage,
        width: 1200,
        height: 630,
        alt: seoConfig.siteName,
      },
    ],
    locale: seoConfig.locale,
    type: 'website',
  },
};

// Server component — exports metadata, renders client wrapper
export default function Home() {
  return <HomeClientWrapper />;
}
