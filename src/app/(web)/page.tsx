import { Metadata } from 'next';
import HomeClient from './HomeClient';
import { JsonLd } from '@/components/seo/json-ld';

export const metadata: Metadata = {
  title: "Baxtli Men — Yoga & Yogaterapiya | Sabina Polatova",
  description: "Ayollar uchun eksklyuziv yoga platformasi. Sabina Polatova bilan sog'lom tana va baxtli hayot sari yo'lingizni boshlang.",
};

export default function HomePage() {
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Baxtli Men',
    url: 'https://baxtli-men.uz',
    logo: 'https://baxtli-men.uz/brand/logo-original.png',
    founder: {
      '@type': 'Person',
      name: 'Sabina Polatova',
    },
  };

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Sabina Polatova',
    jobTitle: 'Yoga Instructor & Therapist',
    url: 'https://baxtli-men.uz',
    sameAs: [
      'https://www.instagram.com/sabina_polatova', // Placeholder, update if known
    ],
  };

  return (
    <>
      <JsonLd data={organizationJsonLd} />
      <JsonLd data={personJsonLd} />
      <HomeClient />
    </>
  );
}
