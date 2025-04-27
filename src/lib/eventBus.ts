'use client';

/**
 * Simple event bus for cross-component communication
 * This allows different parts of the application to communicate
 * without direct dependencies
 */

export type EventType = 
  | 'transaction_created'
  | 'transaction_updated'
  | 'transaction_deleted'
  | 'transactions_changed';

export interface EventData {
  userId?: string;
  transactionId?: string;
  [key: string]: any;
}

// Custom event name for our application
const EVENT_NAME = 'cashminder_event';

/**
 * Emit an event to notify other components about a change
 */
export function emitEvent(type: EventType, data: EventData = {}) {
  // Create a custom event with our data
  const event = new CustomEvent(EVENT_NAME, {
    detail: { type, data, timestamp: new Date().toISOString() }
  });
  
  // Dispatch the event on the window object
  window.dispatchEvent(event);
  
  console.log(`Event emitted: ${type}`, data);
}

/**
 * Listen for events of a specific type
 */
export function listenEvent(type: EventType, callback: (data: EventData) => void) {
  const handler = (event: Event) => {
    const customEvent = event as CustomEvent;
    if (customEvent.detail && customEvent.detail.type === type) {
      callback(customEvent.detail.data);
    }
  };
  
  // Add event listener
  window.addEventListener(EVENT_NAME, handler);
  
  // Return a function to remove the listener
  return () => {
    window.removeEventListener(EVENT_NAME, handler);
  };
}

/**
 * Helper function to refresh transactions for a user
 * This will emit an event that all transaction-dependent components should listen for
 */
export function refreshTransactions(userId: string) {
  emitEvent('transactions_changed', { userId });
}
