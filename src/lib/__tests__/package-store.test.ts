import { describe, it, expect, beforeEach } from 'vitest';
import { usePackageStore } from '../store/package-store';

describe('Package Store (Zustand)', () => {
  beforeEach(() => {
    // We don't have an easy way to reset persisted store in Vitest without extra setup,
    // but we can clear the specific draft we use.
    usePackageStore.getState().clearDraft('test-booking');
  });

  it('should add and remove items from a draft', () => {
    const store = usePackageStore.getState();
    const mockItem = { id: 'item-1', title: 'Test Service', price: 100 };

    store.addItem('test-booking', mockItem);
    expect(usePackageStore.getState().drafts['test-booking']).toHaveLength(1);
    expect(usePackageStore.getState().drafts['test-booking'][0].title).toBe('Test Service');

    store.removeItem('test-booking', 'item-1');
    expect(usePackageStore.getState().drafts['test-booking']).toHaveLength(0);
  });

  it('should update an existing item in a draft', () => {
    const store = usePackageStore.getState();
    store.addItem('test-booking', { id: 'item-1', title: 'Old Title' });
    
    store.updateItem('test-booking', 'item-1', { title: 'New Title' });
    expect(usePackageStore.getState().drafts['test-booking'][0].title).toBe('New Title');
  });
});
