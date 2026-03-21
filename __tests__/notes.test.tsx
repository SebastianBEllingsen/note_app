/**
 * Integration Test: NotesScreen - Loading indicator with mocked Supabase
 *
 * Simulates fetching notes from the database. Verifies that a loading indicator
 * is visible while the call is in progress, and disappears once data is loaded.
 */
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import NotesScreen from '@/app/(tabs)/notes';
import { Note } from '@/storage/storagecontext';

// Control the mock state so we can simulate loading → loaded transitions
const mockUseNotes = jest.fn();

jest.mock('@/storage/storagecontext', () => ({
  useNotes: () => mockUseNotes(),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
  Link: ({ children }: any) => children,
}));

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaView: ({ children, ...props }: any) => <View {...props}>{children}</View>,
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  };
});

const fakeNote: Note = {
  id: 1,
  title: 'Test Note',
  content: 'Test content',
  created_at: '2026-01-01T00:00:00Z',
  updated_at: null,
  username: 'testuser',
  imageUrl: null,
};

describe('NotesScreen - Integration Test', () => {
  it('shows loading indicator while fetching and hides it after data loads', async () => {
    // Start in loading state with no notes (simulates Supabase call in progress)
    mockUseNotes.mockReturnValue({
      notes: [],
      loading: true,
      refresh: jest.fn(),
      loadMore: jest.fn(),
      hasMore: false,
      setNotes: jest.fn(),
      deleteNote: jest.fn(),
      editNote: jest.fn(),
      addNote: jest.fn(),
    });

    const { getByTestId, queryByTestId, rerender } = render(<NotesScreen />);

    // Loading indicator must be visible while Supabase call is in progress
    expect(getByTestId('loading-indicator')).toBeTruthy();

    // Simulate Supabase call completing: notes arrive, loading becomes false
    mockUseNotes.mockReturnValue({
      notes: [fakeNote],
      loading: false,
      refresh: jest.fn(),
      loadMore: jest.fn(),
      hasMore: false,
      setNotes: jest.fn(),
      deleteNote: jest.fn(),
      editNote: jest.fn(),
      addNote: jest.fn(),
    });

    rerender(<NotesScreen />);

    await waitFor(() => {
      expect(queryByTestId('loading-indicator')).toBeNull();
    });
  });
});
