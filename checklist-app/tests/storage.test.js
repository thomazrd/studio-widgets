import { storage } from '../src/storage.js';
import { jest } from '@jest/globals';

describe('Storage Module', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('should prefix keys and store item', () => {
    storage.setItem('testKey', { data: 'value' });
    const keys = Object.keys(localStorage);
    expect(keys.length).toBe(1);
    expect(keys[0]).toMatch(/^6fef6f3b-32be-4994-8f7c-091874a67f75_testKey$/);
  });

  test('should retrieve stored item', () => {
    const data = { id: 1, name: 'Task 1' };
    storage.setItem('task', data);
    const retrieved = storage.getItem('task');
    expect(retrieved).toEqual(data);
  });

  test('should return null for non-existent item', () => {
    const retrieved = storage.getItem('nonexistent');
    expect(retrieved).toBeNull();
  });

  test('should remove item', () => {
    storage.setItem('test1', 'value1');
    storage.setItem('test2', 'value2');
    storage.removeItem('test1');
    expect(storage.getItem('test1')).toBeNull();
    expect(storage.getItem('test2')).toBe('value2');
  });

  test('should clear only items with the widget prefix', () => {
    // Set widget item
    storage.setItem('widgetItem', 'widgetData');
    // Set other item bypassing the storage module
    localStorage.setItem('otherItem', 'otherData');

    storage.clear();

    expect(storage.getItem('widgetItem')).toBeNull();
    expect(localStorage.getItem('otherItem')).toBe('otherData');
  });
});
