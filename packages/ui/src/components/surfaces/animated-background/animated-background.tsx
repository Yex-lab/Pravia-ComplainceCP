'use client';

import { ScrollProgressShowcase } from '../../utils/animations';
import { ScrollToTopFab } from '../../navigation/fab/scroll-to-top-fab';
import { Hero, Features, Testimonials, CTA } from './components';

// ----------------------------------------------------------------------

export function AnimatedBackground({ 
  children 
}: { 
  children: React.ReactNode; 
}) {
  return (
    <ScrollProgressShowcase showProgressBar={true} progressHeight={3}>
      {children}
      <ScrollToTopFab 
        showAtPercentage={70}
        scrollDuration={1000}
        size="large"
      />
    </ScrollProgressShowcase>
  );
}

// Attach compound components
AnimatedBackground.Hero = Hero;
AnimatedBackground.Features = Features;
AnimatedBackground.Testimonials = Testimonials;
AnimatedBackground.CTA = CTA;
