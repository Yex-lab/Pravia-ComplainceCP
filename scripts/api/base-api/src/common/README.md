# Common Module

Shared code used across multiple modules in the application.

## Structure

```
common/
├── entities/           # Shared entity interfaces (used by 2+ modules)
├── dto/               # Shared DTOs
├── interfaces/        # Shared TypeScript interfaces
├── decorators/        # Custom decorators
├── guards/            # Shared guards (e.g., ConditionalAuthGuard)
├── interceptors/      # Shared interceptors
├── pipes/             # Shared pipes
├── filters/           # Exception filters
├── constants/         # Shared constants
├── enums/             # Shared enums
├── utils/             # Utility functions
└── types/             # Shared types (e.g., Dataverse types)
```

## Guidelines

### What belongs in common:
- Code used by 2+ modules
- Framework-level concerns (guards, interceptors, pipes)
- Business logic shared across domains
- Type definitions used across modules

### What stays in modules:
- Module-specific entities
- Module-specific DTOs
- Module-specific business logic

## Current Contents

- **guards/**: `ConditionalAuthGuard` - Authentication guard used across modules
- **types/**: `dataverse.types.ts` - Dataverse API type definitions

## Usage

Import from common using relative paths:
```typescript
import { ConditionalAuthGuard } from '../common/guards';
import { DataverseResponse } from '../common/types';
```
