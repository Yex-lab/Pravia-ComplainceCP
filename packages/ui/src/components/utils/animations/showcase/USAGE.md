# Animation Components - Quick Usage Guide

## Getting Started

All animation components are available in the `@asyml8/ui` package and can be imported individually:

```tsx
import { 
  StandardNeuralNetwork,
  CtaLiquidButton,
  SimpleScrollReveal,
  StatCounter 
} from '@asyml8/ui';
```

## Common Patterns

### 1. Hero Section with Background Animation

```tsx
function HeroSection() {
  return (
    <Box sx={{ height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Background animations */}
      <StandardNeuralNetwork />
      <HeroParticles />
      
      {/* Content overlay */}
      <Container sx={{ 
        position: 'relative', 
        zIndex: 2, 
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Stack spacing={4} alignItems="center" textAlign="center">
          <Typography variant="h1" color="white">
            Your Hero Title
          </Typography>
          <CtaLiquidButton size="large">
            Get Started
          </CtaLiquidButton>
        </Stack>
      </Container>
    </Box>
  );
}
```

### 2. Feature Section with Scroll Reveals

```tsx
function FeatureSection() {
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
            <SimpleScrollReveal direction="up">
              <FeatureHoverCard>
                <FeatureGlassCard>
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <FeatureIcon
                      icon={<Iconify icon={feature.icon} width={48} />}
                      animationType="bounce"
                    />
                    <Typography variant="h5" sx={{ mt: 2 }}>
                      {feature.title}
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

### 3. Statistics Section

```tsx
function StatsSection() {
  return (
    <Container sx={{ py: 8 }}>
      <SimpleScrollReveal direction="fade">
        <Typography variant="h2" textAlign="center" gutterBottom>
          Our Impact
        </Typography>
      </SimpleScrollReveal>
      
      <SimpleScrollReveal direction="up">
        <Stack direction="row" spacing={4} justifyContent="center" sx={{ mt: 6 }}>
          <StatCounter value={10000} suffix="+" label="Happy Users" />
          <StatCounter value={99.9} suffix="%" label="Uptime" decimals={1} />
          <StatCounter value={500} suffix="K" label="Downloads" />
        </Stack>
      </SimpleScrollReveal>
    </Container>
  );
}
```

## Component Categories

### Background Animations
- `StandardNeuralNetwork` - Animated neural network
- `HeroParticles` - Dynamic particle system
- `SubtleParticles` - Gentle floating particles
- `GradientBackground` - Animated gradient backgrounds

### Interactive Elements
- `CtaLiquidButton` - Liquid morphing button
- `FeatureHoverCard` - Hover effect wrapper
- `FeatureGlassCard` - Glass morphism card
- `TestimonialHoverCard` - Testimonial hover effects

### Shape Animations
- `HeroMorphingShape` - Large morphing blob
- `BackgroundMorphingElement` - Subtle morphing element
- `FeatureMorphingIcon` - Small morphing shape

### Scroll Animations
- `SimpleScrollReveal` - Reveal content on scroll
- `ScrollProgress` - Scroll progress indicator

### Icons & Counters
- `FeatureIcon` - Animated feature icons
- `AnimatedIcon` - Generic animated icon wrapper
- `StatCounter` - Animated number counter

## Best Practices

### Performance
1. **Limit concurrent animations** - Don't run too many complex animations simultaneously
2. **Use LazyMotion** - Already configured in the components for optimal performance
3. **Provide container dimensions** - Give explicit sizes to background animation containers

### Accessibility
1. **Respect reduced motion** - All components automatically respect `prefers-reduced-motion`
2. **Maintain contrast** - Ensure text remains readable over animated backgrounds
3. **Focus management** - Interactive elements maintain proper focus states

### Layout
1. **Z-index management** - Use consistent z-index values for layered animations
2. **Overflow handling** - Set `overflow: hidden` on containers when needed
3. **Responsive design** - Test animations on different screen sizes

## Troubleshooting

### Common Issues

**Animations not showing:**
- Ensure Framer Motion is installed and LazyMotion is configured
- Check that the component is properly imported

**Performance issues:**
- Reduce the number of simultaneous animations
- Use `will-change: transform` sparingly
- Check for memory leaks in long-running animations

**Layout problems:**
- Provide explicit dimensions for animated containers
- Use `position: relative` for proper layering
- Check z-index conflicts

### Browser Support
- Modern browsers with CSS transforms support
- Graceful degradation for older browsers
- Automatic reduced motion support

## Examples in Storybook

Visit the Storybook documentation to see all components in action:
- **Complete Showcase** - All components together
- **Background Animations** - Background-only examples
- **Interactive Elements** - Buttons and cards
- **Scroll Animations** - Scroll-triggered effects
- **Counters & Icons** - Statistics and icon animations

Each story includes:
- Live interactive examples
- Complete source code
- Usage documentation
- Performance notes
