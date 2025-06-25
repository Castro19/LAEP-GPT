# Layout Components

## Overview

Layout components for organizing class search results and pagination. Manages different display states and provides navigation controls.

## Components

### SectionContainer

- Main layout container for search results
- State-based component rendering (loading, initial, no results, results)
- Responsive height calculation for mobile/desktop
- Scrollable content area with ScrollArea
- Pagination integration
- Section data transformation

### PaginationFooter

- Pagination controls with previous/next buttons
- Current page display (Page X of Y)
- Loading state handling and disabled states
- AI query pagination support
- Sticky bottom positioning
- Responsive button layout

## Features

- Dynamic state management
- Responsive design adaptation
- Scrollable content areas
- Pagination navigation
- Loading state integration
- AI query support
- Mobile/desktop optimization

## State Management

- **Redux**: classSearch state (sections, page, totalPages, loading, isQueryAI)
- **Redux Actions**: setPage, fetchSectionsAsync, queryAIPagination
- **Local State**: Component-specific state management

## Data Flow

1. Search results → SectionContainer → State check → Appropriate component
2. Pagination → Page change → Redux update → API call → Results update
3. AI query → Pagination → queryAIPagination → Results update

## Dependencies

- Redux state management
- ScrollArea UI component
- Button UI components
- Section transformation helpers
- Responsive hooks
