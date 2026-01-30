# Animation Components

A comprehensive collection of animation components built with Framer Motion for modern web applications.

## Overview

This package provides a variety of animation components designed to enhance user experience with smooth, performant animations. All components are built using Framer Motion with LazyMotion for optimal performance.

## Components

### Background Animations

#### StandardNeuralNetwork
Animated neural network with connecting nodes and flowing data visualization.

```tsx
import { StandardNeuralNetwork } from '@asyml8/ui';

<Box sx={{ height: 400, position: 'relative' }}>
  <StandardNeuralNetwork />
</Box>
```

**Props:**
- No props required - fully self-contained

**Use Cases:**
- Hero section backgrounds
- Technology-focused landing pages
- AI/ML product showcases

#### HeroParticles
Dynamic particle system perfect for hero sections with floating animated particles.

```tsx
import { HeroParticles } from '@asyml8/ui';

<Box sx={{ height: '100vh', position: 'relative' }}>
  <HeroParticles />
  <Container sx={{ position: 'relative', zIndex: 2 }}>
    {/* Your content */}
  </Container>
</Box>
```

**Props:**
- No props required

**Use Cases:**
- Hero section backgrounds
- Landing page headers
- Full-screen overlays

#### SubtleParticles
Gentle floating particles for subtle background ambiance.

```tsx
import { SubtleParticles } from '@asyml8/ui';

<SubtleParticles />
```

**Props:**
- No props required

**Use Cases:**
- Section backgrounds
- Subtle page ambiance
- Content area backgrounds

### Shape Animations

#### HeroMorphingShape
Large morphing blob animation perfect for hero sections.

```tsx
import { HeroMorphingShape } from '@asyml8/ui';

<Box sx={{ width: 300, height: 300, position: 'relative' }}>
  <HeroMorphingShape />
</Box>
```

#### BackgroundMorphingElement
Subtle morphing background element for decorative purposes.

```tsx
import { BackgroundMorphingElement } from '@asyml8/ui';

<BackgroundMorphingElement />
```

#### FeatureMorphingIcon
Small morphing shape suitable for icon-sized elements.

```tsx
import { FeatureMorphingIcon } from '@asyml8/ui';

<FeatureMorphingIcon />
```

### Interactive Elements

#### CtaLiquidButton
Engaging button with liquid morphing effects on hover.

```tsx
import { CtaLiquidButton } from '@asyml8/ui';
import { Iconify } from '@asyml8/ui';

<CtaLiquidButton>Click me</CtaLiquidButton>

<CtaLiquidButton startIcon={<Iconify icon="solar:eye-bold" width={20} />}>
  With Icon
</CtaLiquidButton>
```

**Props:**
- `children`: Button content
- `startIcon`: Optional icon at the start
- `onClick`: Click handler
- All standard MUI Button props

#### FeatureGlassCard
Glass morphism card with hover effects.

```tsx
import { FeatureGlassCard, FeatureHoverCard } from '@asyml8/ui';

<FeatureHoverCard>
  <FeatureGlassCard>
    <Box sx={{ p: 3 }}>
      Your content here
    </Box>
  </FeatureGlassCard>
</FeatureHoverCard>
```

#### TestimonialHoverCard
Hover effect wrapper for testimonial cards.

```tsx
import { TestimonialHoverCard } from '@asyml8/ui';

<TestimonialHoverCard>
  <Card sx={{ p: 3 }}>
    Your testimonial content
  </Card>
</TestimonialHoverCard>
```

### Icon Animations

#### FeatureIcon
Animated icon with various animation types.

```tsx
import { FeatureIcon } from '@asyml8/ui';

<FeatureIcon
  icon={<YourIcon />}
  animationType="bounce" // "bounce" | "scale" | "rotate"
/>
```

**Props:**
- `icon`: React element for the icon
- `animationType`: Type of animation ("bounce", "scale", "rotate")

#### AnimatedIcon
Generic animated icon wrapper with customizable animations.

```tsx
import { AnimatedIcon } from '@asyml8/ui';

<AnimatedIcon animationType="scale" size={40}>
  <YourIcon />
</AnimatedIcon>
```

**Props:**
- `children`: Icon element
- `animationType`: Animation type
- `size`: Icon size in pixels

### Counters

#### StatCounter
Smooth counting animation for statistics and metrics.

```tsx
import { StatCounter } from '@asyml8/ui';

<StatCounter 
  value={1000} 
  suffix="+" 
  label="Users" 
/>

<StatCounter 
  value={99.9} 
  suffix="%" 
  label="Uptime" 
  decimals={1} 
/>
```

**Props:**
- `value`: Target number to count to
- `suffix`: Text to append after the number
- `label`: Label text below the counter
- `decimals`: Number of decimal places (optional)

### Scroll Animations

#### SimpleScrollReveal
Reveals content with animation when scrolled into view.

```tsx
import { SimpleScrollReveal } from '@asyml8/ui';

<SimpleScrollReveal direction="up">
  <Card>Your content</Card>
</SimpleScrollReveal>

<SimpleScrollReveal direction="left">
  <Box>Slides in from right</Box>
</SimpleScrollReveal>

<SimpleScrollReveal direction="fade">
  <Typography>Fades in</Typography>
</SimpleScrollReveal>
```

**Props:**
- `children`: Content to animate
- `direction`: Animation direction ("up", "left", "fade")

#### ScrollProgress
Wrapper that adds a scroll progress indicator.

```tsx
import { ScrollProgress } from '@asyml8/ui';

<ScrollProgress showProgressBar progressHeight={3}>
  <YourPageContent />
</ScrollProgress>
```

**Props:**
- `children`: Page content
- `showProgressBar`: Whether to show progress bar
- `progressHeight`: Height of progress bar in pixels

### Background Variants

#### GradientBackground
Animated gradient backgrounds for different sections.

```tsx
import { GradientBackground } from '@asyml8/ui';

<GradientBackground variant="hero" sx={{ height: 400 }}>
  <Container>
    Your hero content
  </Container>
</GradientBackground>

<GradientBackground variant="section" sx={{ height: 200 }}>
  Section content
</GradientBackground>

<GradientBackground variant="minimal" sx={{ height: 100 }}>
  Minimal background
</GradientBackground>
```

**Props:**
- `variant`: Background style ("hero", "section", "minimal")
- `sx`: MUI sx prop for styling
- `children`: Content to overlay

## Performance Considerations

All animations are optimized for performance:

- **LazyMotion**: Only loads animation features when needed
- **GPU Acceleration**: Uses transform properties for smooth animations
- **Intersection Observer**: Scroll animations only trigger when elements are visible
- **Reduced Motion**: Respects user's motion preferences

## Best Practices

1. **Layer Management**: Use `position: relative` and `zIndex` to properly layer animated backgrounds
2. **Container Sizing**: Provide explicit dimensions for background animations
3. **Content Overlay**: Ensure content has proper contrast over animated backgrounds
4. **Performance**: Limit the number of simultaneous complex animations
5. **Accessibility**: Test with reduced motion preferences enabled

## Examples

### Hero Section with Multiple Animations

```tsx
import { 
  StandardNeuralNetwork, 
  HeroParticles, 
  CtaLiquidButton,
  SimpleScrollReveal 
} from '@asyml8/ui';

function HeroSection() {
  return (
    <Box sx={{ height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Background Animations */}
      <StandardNeuralNetwork />
      <HeroParticles />
      
      {/* Content */}
      <Container sx={{ 
        position: 'relative', 
        zIndex: 2, 
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <SimpleScrollReveal direction="fade">
          <Stack spacing={4} alignItems="center" textAlign="center">
            <Typography variant="h1" color="white">
              Welcome to the Future
            </Typography>
            <Typography variant="h5" color="white" sx={{ opacity: 0.8 }}>
              Experience next-generation animations
            </Typography>
            <CtaLiquidButton size="large">
              Get Started
            </CtaLiquidButton>
          </Stack>
        </SimpleScrollReveal>
      </Container>
    </Box>
  );
}
```

### Feature Section with Cards

```tsx
import { 
  FeatureHoverCard, 
  FeatureGlassCard, 
  FeatureIcon,
  SimpleScrollReveal 
} from '@asyml8/ui';

function FeatureSection() {
  const features = [
    { icon: 'solar:eye-bold', title: 'Visual', description: 'Beautiful animations' },
    { icon: 'solar:heart-bold', title: 'Engaging', description: 'User-friendly interactions' },
    { icon: 'solar:settings-bold', title: 'Customizable', description: 'Flexible configuration' }
  ];

  return (
    <Container sx={{ py: 10 }}>
      <SimpleScrollReveal direction="fade">
        <Typography variant="h2" textAlign="center" gutterBottom>
          Features
        </Typography>
      </SimpleScrollReveal>
      
      <Grid container spacing={4} sx={{ mt: 4 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <SimpleScrollReveal direction="up" delay={index * 0.2}>
              <FeatureHoverCard>
                <FeatureGlassCard>
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <FeatureIcon
                      icon={<Iconify icon={feature.icon} width={48} />}
                      animationType="bounce"
                    />
                    <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Box>
                </FeatureGlassCard>
              </FeatureHoverCard>
            </SimpleScrollReveal>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
```

### Statistics Section

```tsx
import { StatCounter, SimpleScrollReveal } from '@asyml8/ui';

function StatsSection() {
  return (
    <Container sx={{ py: 10 }}>
      <SimpleScrollReveal direction="fade">
        <Typography variant="h2" textAlign="center" gutterBottom>
          Our Impact
        </Typography>
      </SimpleScrollReveal>
      
      <SimpleScrollReveal direction="up">
        <Stack 
          direction="row" 
          spacing={4} 
          justifyContent="center" 
          sx={{ mt: 6 }}
        >
          <StatCounter value={10000} suffix="+" label="Happy Users" />
          <StatCounter value={99.9} suffix="%" label="Uptime" decimals={1} />
          <StatCounter value={500} suffix="K" label="Downloads" />
          <StatCounter value={50} suffix="+" label="Countries" />
        </Stack>
      </SimpleScrollReveal>
    </Container>
  );
}
```

## Troubleshooting

### Common Issues

1. **Animations not showing**: Ensure LazyMotion is properly configured in your app
2. **Performance issues**: Limit concurrent animations and use `will-change: transform` sparingly
3. **Layout shifts**: Provide explicit dimensions for animated containers
4. **Z-index conflicts**: Use consistent z-index values for layered animations

### Browser Support

- Modern browsers with CSS transforms support
- Graceful degradation for older browsers
- Respects `prefers-reduced-motion` setting

## Contributing

When adding new animation components:

1. Use Framer Motion's LazyMotion for performance
2. Include TypeScript types
3. Add comprehensive documentation
4. Create Storybook stories with examples
5. Test with reduced motion preferences
6. Ensure accessibility compliance
