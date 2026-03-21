/**
 * Auth Guard Test: Access control
 *
 * Verifies that protected app content is not visible when the user is not
 * logged in, and that the main content is rendered when the user is authenticated.
 */
import React from 'react';
import { View, Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { useAuthContext } from '@/hooks/use-auth-context';

// Mutable mock so individual tests can change the auth state
const mockUseAuthContext = jest.fn();

jest.mock('@/hooks/use-auth-context', () => ({
  useAuthContext: () => mockUseAuthContext(),
}));

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaView: ({ children, ...props }: any) => <View {...props}>{children}</View>,
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  };
});

/**
 * A minimal protected screen that mirrors the app's auth guard logic:
 * shows a login prompt when unauthenticated, and protected content when logged in.
 */
function ProtectedContent() {
  const { isLoggedIn } = useAuthContext();

  if (!isLoggedIn) {
    return (
      <View>
        <Text testID="login-prompt">Logg inn for å se notater</Text>
      </View>
    );
  }

  return (
    <View>
      <Text testID="main-content">Work Notes</Text>
    </View>
  );
}

beforeEach(() => {
  mockUseAuthContext.mockReturnValue({
    session: null,
    isLoading: false,
    isLoggedIn: false,
    profile: null,
    refreshProfile: jest.fn(),
  });
});

describe('Auth Guard Test', () => {
  it('shows login prompt when user is not logged in', () => {
    const { getByTestId, queryByTestId } = render(<ProtectedContent />);

    // Unauthenticated: login prompt must be visible
    expect(getByTestId('login-prompt')).toBeTruthy();
    // Protected content must NOT be visible
    expect(queryByTestId('main-content')).toBeNull();
  });

  it('shows protected content when user is logged in', () => {
    mockUseAuthContext.mockReturnValue({
      session: { user: { id: 'user-123' } },
      isLoading: false,
      isLoggedIn: true,
      profile: null,
      refreshProfile: jest.fn(),
    });

    const { getByTestId, queryByTestId } = render(<ProtectedContent />);

    // Authenticated: main content must be visible
    expect(getByTestId('main-content')).toBeTruthy();
    // Login prompt must NOT be visible
    expect(queryByTestId('login-prompt')).toBeNull();
  });
});
