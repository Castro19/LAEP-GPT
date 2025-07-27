# Splash Page Components

This folder contains the splash page components for PolyLink, providing the main landing page experience with hero sections, feature demonstrations, team information, and about content. These components create an engaging and informative introduction to the application.

## Overview

The splash page system consists of several key areas:

- **Hero Components**: Main landing page elements and call-to-action buttons
- **Feature Components**: Interactive feature demonstrations and showcases
- **Team Components**: Team member displays and contributor sections
- **About Components**: Detailed information about PolyLink's features
- **Navigation Components**: Header buttons and navigation elements

## Component Structure

### Hero Components

#### `Hero.tsx`

Main hero section component with animated typewriter text and team call-to-action.

**Features:**

- Animated typewriter text effect
- Interactive button with hover animations
- Smooth navigation to team page
- Responsive design with dark mode support
- Spring-based button animations
- Gradient styling with hover effects

**Content:**

- Typewriter text: "Want to help build PolyLink?"
- Call-to-action: "Meet the Team" button
- Animated emoji: 👥

**Usage:**

```tsx
<Hero />
```

#### `JoinButton.tsx`

Call-to-action button for user registration with animated effects.

**Features:**

- Animated hover and tap effects
- Gradient background with hover states
- Animated arrow indicator
- Spring-based animations
- Shadow effects with hover enhancement
- Navigation to registration page

**Content:**

- Primary text: "Get Started Now"
- Animated arrow: →
- Hover gradient overlay

**Usage:**

```tsx
<JoinButton />
```

#### `SplashHeaderButton.tsx`

Brand logo and navigation button for the splash page.

**Features:**

- Brand logo display with gradient text
- Animated hover and tap effects
- Navigation to home page
- Animated dot indicator
- Subtle underline animation
- Spring-based animations

**Content:**

- Brand text: "PolyLink"
- Animated dot indicator
- Subtle animated underline

**Usage:**

```tsx
<SplashHeaderButton />
```

### Feature Components

#### `FeatureSection.tsx`

Individual feature display component with icons and descriptions.

**Features:**

- Staggered entrance animations
- Hover effects with background changes
- Gradient text styling
- Animated borders
- Responsive design
- Dark mode support

**Default Features:**

- Find Classes Instantly (🚀)
- Effortless Schedule Building (📅)
- Smart AI Insights (🤖)

**Usage:**

```tsx
<FeatureSection
  title="Find Classes Instantly"
  description="AI-powered search helps you discover the best courses."
  icon="🚀"
  index={0}
/>
```

#### `MatchingFeatures.tsx`

Sticky scroll reveal component for feature demonstrations.

**Features:**

- Sticky scroll reveal animations
- Interactive feature demonstrations
- Animated GIF showcases
- Descriptive text for each feature
- Responsive design
- Smooth scroll behavior

**Demonstrations:**

- course-ai-query.gif: AI-powered course search
- build-schedules.gif: Schedule building process
- schedule-builder-ai.gif: AI insights and analysis

**Usage:**

```tsx
<MatchingFeatures />
```

### Team Components

#### `team/Team.tsx`

Main team page component for displaying team members.

**Features:**

- Categorizes team members by type
- Displays founder prominently
- Shows current team members
- Lists contributors separately
- Includes previous contributors
- SEO optimization with meta tags

**Team Categories:**

- Founder: Single prominent display
- Team: Current team members (excluding contributors)
- Contributors: Active contributors
- Previous Contributors: Past contributors

**Usage:**

```tsx
<Team teamMembers={teamData} />
```

#### `team/PersonCard.tsx`

Individual team member card component.

#### `team/Contributors.tsx`

Component for displaying contributor sections.

#### `team/JoinTeam.tsx`

Component for team recruitment call-to-action.

#### `team/helpers/getTeamMembers.ts`

Helper function for team member data management.

### About Components

#### `about/AboutSection.tsx`

Comprehensive about page component with markdown content and videos.

**Features:**

- Markdown content rendering
- Embedded YouTube videos
- Animated background elements
- Staggered content animations
- Responsive design
- Dark theme with gradients

**Content Sections:**

- Introduction with demo video
- About section with overview
- Flowchart feature explanation
- Course search demonstration
- Schedule builder showcase
- Schedule insights analysis
- Conclusion section

**Videos:**

- Introduction: HlPKFzQB5l4
- About: zMBJrFnoJRw
- Flowchart: pUXRDrsNco8
- Course Search: MYXE1Yx4MJU
- Schedule Builder: fjd6oeoiT4A
- Schedule Insights: yo-UKQzNCec

**Usage:**

```tsx
<AboutSection />
```

#### `about/aboutText.ts`

Markdown content data for the about section.

## Key Features

### Landing Page Experience

- **Hero Section**: Engaging introduction with animated text
- **Feature Showcase**: Interactive demonstrations of key features
- **Call-to-Action**: Clear paths for user engagement
- **Brand Identity**: Consistent PolyLink branding throughout

### Interactive Elements

- **Animated Buttons**: Spring-based hover and tap animations
- **Typewriter Effects**: Engaging text animations
- **Sticky Scroll**: Interactive feature demonstrations
- **Gradient Styling**: Modern visual design elements

### Content Management

- **Markdown Support**: Rich content with markdown rendering
- **Video Integration**: Embedded YouTube demonstrations
- **Team Organization**: Structured team member display
- **SEO Optimization**: Meta tags and social sharing

### User Experience

- **Responsive Design**: Adapts to different screen sizes
- **Dark Mode Support**: Consistent theming
- **Smooth Animations**: Framer Motion animations
- **Accessibility**: Screen reader and keyboard support

## State Management

The components use minimal state management, primarily relying on:

- **React Router**: Navigation between pages
- **Framer Motion**: Animation state management
- **Static Data**: Team member and content data

## Dependencies

### Core Dependencies

- **React Router**: Navigation functionality
- **Framer Motion**: Animations and transitions
- **MarkdownIt**: Markdown parsing
- **DOMPurify**: HTML sanitization

### UI Dependencies

- **TypewriterEffectSmooth**: Text animation component
- **StickyScroll**: Scroll reveal component
- **React Helmet**: SEO management
- **Tailwind CSS**: Styling

### Content Dependencies

- **aboutText**: Markdown content data
- **TeamDocument**: TypeScript types for team data
- **Static Assets**: GIFs and images for demonstrations

## Usage Examples

### Basic Hero Section

```tsx
import { Hero } from "./splashPage";

function LandingPage() {
  return (
    <div>
      <Hero />
      <JoinButton />
    </div>
  );
}
```

### Feature Showcase

```tsx
import { FeatureSection, MatchingFeatures } from "./splashPage";

function FeaturesPage() {
  return (
    <div>
      <FeatureSection />
      <MatchingFeatures />
    </div>
  );
}
```

### Team Page

```tsx
import { Team } from "./splashPage/team";

function TeamPage() {
  return <Team teamMembers={teamData} />;
}
```

### About Page

```tsx
import { AboutSection } from "./splashPage/about";

function AboutPage() {
  return <AboutSection />;
}
```

## Best Practices

### Performance

- Use React.memo for expensive components
- Optimize GIF and video loading
- Implement lazy loading for content
- Minimize bundle size with code splitting

### Accessibility

- Provide proper ARIA labels and roles
- Ensure keyboard navigation support
- Use semantic HTML elements
- Test with screen readers

### Content Management

- Keep content data separate from components
- Use TypeScript for type safety
- Implement proper error handling
- Maintain consistent content structure

### Animation

- Use Framer Motion for smooth animations
- Implement proper loading states
- Ensure animations don't interfere with usability
- Provide reduced motion alternatives

## SEO Considerations

### Meta Tags

- Page titles for each section
- Meta descriptions for search engines
- OpenGraph tags for social sharing
- Twitter Card tags for Twitter

### Content Structure

- Proper heading hierarchy
- Semantic HTML elements
- Alt text for images
- Structured data where appropriate

### Performance

- Optimized image loading
- Fast page load times
- Mobile-friendly design
- Core Web Vitals optimization

## Future Enhancements

### Planned Features

- **A/B Testing**: Different hero section variations
- **Analytics Integration**: User engagement tracking
- **Content Management**: Dynamic content updates
- **Internationalization**: Multi-language support

### Technical Improvements

- **Performance Optimization**: Image optimization and lazy loading
- **Animation Refinements**: More sophisticated animations
- **Accessibility Enhancements**: Improved screen reader support
- **Mobile Optimization**: Enhanced mobile experience

### Content Enhancements

- **Video Content**: More demonstration videos
- **Interactive Demos**: Live feature demonstrations
- **User Testimonials**: Customer success stories
- **Case Studies**: Detailed feature usage examples
