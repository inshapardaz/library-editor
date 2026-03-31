# TASK-013: Add React Error Boundary

## Summary
The application has no React Error Boundary. An unhandled render error in any component will unmount the entire app and show a blank white screen. An Error Boundary catches these errors and shows a meaningful fallback UI with a retry option.

## Steps
1. Create `src/components/errorBoundary.jsx`:
   ```jsx
   import { Component } from 'react';

   class ErrorBoundary extends Component {
       state = { hasError: false, error: null };

       static getDerivedStateFromError(error) {
           return { hasError: true, error };
       }

       componentDidCatch(error, info) {
           console.error('ErrorBoundary caught:', error, info);
       }

       render() {
           if (this.state.hasError) {
               return <this.props.fallback error={this.state.error}
                          onReset={() => this.setState({ hasError: false })} />;
           }
           return this.props.children;
       }
   }
   export default ErrorBoundary;
   ```
2. Create a `<CrashPage />` fallback component (reuse the existing `<Error />` component from `src/components/error.jsx`).
3. Wrap the `<Router />` in `App.jsx` with `<ErrorBoundary fallback={CrashPage}>`.
4. Consider adding more granular boundaries around the rich-text editor and the PDF processor, which are the most likely sources of runtime errors.

## Acceptance Criteria
- [ ] Throwing an error inside a child component shows the fallback UI instead of a blank screen.
- [ ] The fallback has a "Retry" / "Reload" button that clears the error state.
- [ ] Error details are logged to the console (and can be wired to a monitoring service later).

## Files to Change
- `src/components/errorBoundary.jsx` (new)
- `src/App.jsx`

## Priority
**High** — resilience / production stability.
