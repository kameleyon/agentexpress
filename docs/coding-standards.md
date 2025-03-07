# AgentExpress Coding Standards and Best Practices

## General Principles

- **Readability**: Write code that is easy to read and understand
- **Maintainability**: Structure code to be easily maintained and extended
- **Consistency**: Follow consistent patterns throughout the codebase
- **Modularity**: Build small, reusable components and functions
- **Documentation**: Document code appropriately for future developers
- **Testing**: Write tests for critical functionality

## File Structure

### Web Application (Next.js)

```
app/                  # Next.js app directory
  (routes)/           # Route groups
  api/                # API routes
  layout.tsx          # Root layout
  page.tsx            # Home page
components/           # Reusable React components
  ui/                 # UI components (buttons, inputs, etc.)
  features/           # Feature-specific components
  layouts/            # Layout components
hooks/                # Custom React hooks
lib/                  # Utility functions and shared code
styles/               # Global styles
public/               # Static assets
```

### Mobile Application (Expo)

```
app/                  # Expo Router app directory
  (tabs)/             # Tab navigation
  _layout.tsx         # Root layout
assets/               # Static assets
components/           # Reusable React Native components
  ui/                 # UI components
  features/           # Feature-specific components
constants/            # Constants and configuration
hooks/                # Custom React hooks
```

## Naming Conventions

- **Files and Directories**: Use kebab-case for file and directory names
  - Example: `user-profile.tsx`, `auth-context.tsx`
- **Components**: Use PascalCase for component names
  - Example: `UserProfile`, `AuthContext`
- **Functions**: Use camelCase for function names
  - Example: `getUserData()`, `handleSubmit()`
- **Variables**: Use camelCase for variable names
  - Example: `userData`, `isLoading`
- **Constants**: Use UPPER_SNAKE_CASE for constants
  - Example: `API_URL`, `MAX_RETRY_COUNT`
- **Types and Interfaces**: Use PascalCase prefixed with 'T' for types and 'I' for interfaces
  - Example: `TUser`, `IAuthProps`

## Code Formatting

- Use Prettier for consistent code formatting
- 2-space indentation
- 80-character line length limit (soft limit)
- Single quotes for strings
- Semicolons at the end of statements
- Trailing commas in multi-line objects and arrays
- No unused variables or imports

## React/Next.js Best Practices

- Use functional components with hooks
- Keep components small and focused on a single responsibility
- Extract complex logic into custom hooks
- Use TypeScript for type safety
- Implement proper error handling
- Use React Query for data fetching and caching
- Implement proper loading and error states
- Use Next.js Image component for optimized images
- Implement proper SEO with metadata

## React Native/Expo Best Practices

- Use Expo SDK features when available
- Implement responsive layouts using flexbox
- Handle different screen sizes appropriately
- Optimize performance for mobile devices
- Implement proper error boundaries
- Use React Navigation for navigation
- Handle platform-specific code appropriately
- Implement proper loading and error states

## TypeScript Standards

- Use TypeScript for all new code
- Define interfaces for component props
- Use type inference when possible
- Avoid using `any` type
- Use union types for variables that can have multiple types
- Use generics for reusable components and functions
- Use enums for predefined sets of values

## CSS/Styling Standards

- Use Tailwind CSS for web styling
- Follow utility-first approach
- Extract common patterns to components
- Use CSS variables for theming
- Implement responsive design
- Follow mobile-first approach

## State Management

- Use React Context for global state when appropriate
- Use Zustand for more complex state management
- Keep state as local as possible
- Avoid prop drilling by using context or state management libraries
- Use React Query for server state management

## API Integration

- Use React Query for data fetching
- Implement proper error handling
- Use TypeScript interfaces for API responses
- Implement retry logic for failed requests
- Use environment variables for API endpoints
- Implement proper loading and error states

## Testing Standards

- Write unit tests for utility functions
- Write component tests for UI components
- Write integration tests for critical user flows
- Use Jest for testing
- Use React Testing Library for component testing
- Aim for good test coverage of critical paths

## Documentation Standards

- Document complex functions and components
- Use JSDoc comments for functions and components
- Document props for components
- Keep documentation up-to-date
- Document known issues and workarounds

## Git Workflow

- Use feature branches for new features
- Use pull requests for code review
- Write descriptive commit messages
- Keep commits focused and atomic
- Rebase feature branches on main before merging
- Delete branches after merging

## Code Review Guidelines

- Review code for readability and maintainability
- Check for potential bugs and edge cases
- Ensure code follows project standards
- Provide constructive feedback
- Focus on the code, not the person

## Performance Considerations

- Optimize bundle size
- Implement code splitting
- Use memoization for expensive calculations
- Optimize rendering performance
- Use appropriate data structures and algorithms
- Implement proper caching strategies

## Accessibility Standards

- Implement proper semantic HTML
- Use ARIA attributes when necessary
- Ensure keyboard navigation works
- Provide alternative text for images
- Ensure sufficient color contrast
- Test with screen readers

## Security Best Practices

- Validate user input
- Implement proper authentication and authorization
- Protect against common vulnerabilities (XSS, CSRF)
- Use HTTPS for all requests
- Handle sensitive data appropriately
- Keep dependencies up-to-date
