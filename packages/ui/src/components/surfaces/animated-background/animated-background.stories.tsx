import type { Meta, StoryObj } from '@storybook/react';

import { AnimatedBackground } from './animated-background';

// ----------------------------------------------------------------------

const DEFAULT_HERO_DATA = {
  title: "Animated Background Component",
  highlightText: "with Scroll Effects",
  subtitle: "A surface component that provides animated backgrounds with scroll progress tracking and smooth transitions.",
  description: "Perfect for landing pages, marketing sites, and any page that needs engaging visual effects with scroll-based animations.",
  tagline: "Compound component pattern for flexible composition.",
  buttons: [
    { text: "Explore Features" },
    { text: "View Demo", icon: "solar:eye-bold" }
  ],
  stats: [
    { value: 10000, suffix: "+", label: "Active Users" },
    { value: 99.9, suffix: "%", label: "Uptime", decimals: 1 },
    { value: 50, suffix: "+", label: "Integrations" }
  ]
};

const DEFAULT_FEATURES = [
  {
    icon: 'solar:rocket-2-bold',
    title: 'AI Acceleration Framework',
    subtitle: 'Weeks, Not Months',
    description: 'Pre-built architectures, reusable components, and proven pipelines to deliver near-production POCs in record time.',
  },
  {
    icon: 'solar:shield-check-bold',
    title: 'Enterprise-Grade Readiness',
    subtitle: 'Deployment Without Rework',
    description: 'Every POC is designed with security, compliance, and scalability in mind—so the leap to production is seamless.',
  },
  {
    icon: 'solar:users-group-two-rounded-bold',
    title: 'Human-in-the-Loop Design',
    subtitle: 'Intelligence That Works With You',
    description: 'We embed domain experts into every AI cycle to ensure outputs align with business goals, ethics, and real-world constraints.',
  },
];

const DEFAULT_TESTIMONIALS = [
  {
    name: 'Sarah Johnson',
    role: 'CTO, TechCorp',
    review: 'Our first POC with Asyml8 was 85% production-ready—saving us months of re-engineering.',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Product Manager',
    review: 'Asyml8\'s acceleration framework helped us validate a critical AI use case in just four weeks—then deploy it in production two months later.',
    rating: 5,
  },
  {
    name: 'Emily Davis',
    role: 'Lead Data Scientist',
    review: 'We used to take 6–9 months to go from concept to launch. With Asyml8, it\'s closer to 10 weeks.',
    rating: 5,
  },
];

// ----------------------------------------------------------------------

const meta: Meta<typeof AnimatedBackground> = {
  title: 'Surfaces/Animated Background',
  component: AnimatedBackground,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

// ----------------------------------------------------------------------

export const Default: Story = {
  render: () => (
    <AnimatedBackground>
      <AnimatedBackground.Hero {...DEFAULT_HERO_DATA} />
      <AnimatedBackground.Features features={DEFAULT_FEATURES} />
      <AnimatedBackground.Testimonials testimonials={DEFAULT_TESTIMONIALS} />
      <AnimatedBackground.CTA />
    </AnimatedBackground>
  ),
};

export const HeroOnly: Story = {
  render: () => (
    <AnimatedBackground>
      <AnimatedBackground.Hero {...DEFAULT_HERO_DATA} />
    </AnimatedBackground>
  ),
};

export const FeaturesOnly: Story = {
  render: () => (
    <AnimatedBackground>
      <AnimatedBackground.Features features={DEFAULT_FEATURES} />
    </AnimatedBackground>
  ),
};

export const TestimonialsOnly: Story = {
  render: () => (
    <AnimatedBackground>
      <AnimatedBackground.Testimonials testimonials={DEFAULT_TESTIMONIALS} />
    </AnimatedBackground>
  ),
};

export const CTAOnly: Story = {
  render: () => (
    <AnimatedBackground>
      <AnimatedBackground.CTA />
    </AnimatedBackground>
  ),
};

export const CustomOrder: Story = {
  render: () => (
    <AnimatedBackground>
      <AnimatedBackground.Hero {...DEFAULT_HERO_DATA} />
      <AnimatedBackground.CTA />
      <AnimatedBackground.Features features={DEFAULT_FEATURES} />
      <AnimatedBackground.Testimonials testimonials={DEFAULT_TESTIMONIALS} />
    </AnimatedBackground>
  ),
};

export const MinimalHero: Story = {
  render: () => (
    <AnimatedBackground>
      <AnimatedBackground.Hero
        title="Simple Landing Page"
        highlightText="Made Easy"
        subtitle="Build beautiful landing pages with compound components."
        description="Mix and match sections to create the perfect layout."
        buttons={[
          { text: "Get Started" },
        ]}
      />
    </AnimatedBackground>
  ),
};
