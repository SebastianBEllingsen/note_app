/**
 * Unit Test: NewNoteScreen - Note creation & navigation
 *
 * Verifies that when a valid note is submitted, the note creation logic runs
 * and the user is automatically navigated back to the home screen.
 */
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import NewNoteScreen from '@/app/(tabs)/(pages)/newnote';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
  useLocalSearchParams: () => ({}),
  Link: ({ children }: any) => children,
}));

const mockAddNote = jest.fn();
const mockRefresh = jest.fn();

jest.mock('@/storage/storagecontext', () => ({
  useNotes: () => ({
    addNote: mockAddNote,
    refresh: mockRefresh,
    notes: [],
    loading: false,
    loadMore: jest.fn(),
    hasMore: false,
    setNotes: jest.fn(),
    deleteNote: jest.fn(),
    editNote: jest.fn(),
  }),
}));

jest.mock('@/utils/notifications', () => ({
  sendLocalNotification: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('@/utils/upload', () => ({
  uploadImage: jest.fn().mockResolvedValue('https://example.com/photo.jpg'),
}));

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaView: ({ children, ...props }: any) => <View {...props}>{children}</View>,
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  };
});

beforeEach(() => {
  jest.clearAllMocks();
  mockAddNote.mockResolvedValue({ data: {}, error: null });
  jest.spyOn(Alert, 'alert').mockImplementation((_title, _msg, _buttons) => {
    // Auto-press the first button (the success "Suksess" alert dismiss)
  });
});

describe('NewNoteScreen - Unit Test', () => {
  it('navigates to home screen after successfully creating a note', async () => {
    const { getByPlaceholderText, getByText } = render(<NewNoteScreen />);

    fireEvent.changeText(getByPlaceholderText('Tittel'), 'My Test Note');
    fireEvent.changeText(getByPlaceholderText('Innhold'), 'Some content here');
    fireEvent.press(getByText('Legg til'));

    await waitFor(() => {
      expect(mockAddNote).toHaveBeenCalledWith('My Test Note', 'Some content here', '');
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/(tabs)');
    });
  });

  it('does not navigate if title is empty', async () => {
    const { getByText } = render(<NewNoteScreen />);

    fireEvent.press(getByText('Legg til'));

    await waitFor(() => {
      expect(mockAddNote).not.toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
