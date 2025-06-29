import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface RealtimeSubscription {
  id: string;
  table: string;
  filter?: string;
  onInsert?: (payload: any) => void;
  onUpdate?: (payload: any) => void;
  onDelete?: (payload: any) => void;
}

export interface RealtimeOptions {
  enabled?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export const useRealtime = (
  subscriptions: RealtimeSubscription[] = [],
  options: RealtimeOptions = {}
) => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [error, setError] = useState<string | null>(null);
  
  const subscriptionsRef = useRef<Map<string, any>>(new Map());
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttemptsRef = useRef(0);
  
  const {
    enabled = true,
    reconnectInterval = 5000,
    maxReconnectAttempts = 5
  } = options;

  // Mock WebSocket connection for demonstration
  // In a real implementation, this would use Supabase realtime
  const connect = useCallback(() => {
    if (!enabled || !user) return;

    setConnectionStatus('connecting');
    setError(null);

    // Simulate connection
    setTimeout(() => {
      setIsConnected(true);
      setConnectionStatus('connected');
      reconnectAttemptsRef.current = 0;
    }, 1000);

  }, [enabled, user]);

  const disconnect = useCallback(() => {
    setIsConnected(false);
    setConnectionStatus('disconnected');
    
    // Clear all subscriptions
    subscriptionsRef.current.clear();
    
    // Clear reconnect timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
  }, []);

  const reconnect = useCallback(() => {
    if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
      setConnectionStatus('error');
      setError('Max reconnection attempts reached');
      return;
    }

    reconnectAttemptsRef.current++;
    
    reconnectTimeoutRef.current = setTimeout(() => {
      connect();
    }, reconnectInterval);
  }, [connect, reconnectInterval, maxReconnectAttempts]);

  // Subscribe to table changes
  const subscribe = useCallback((subscription: RealtimeSubscription) => {
    if (!isConnected) return null;

    // Mock subscription - in real implementation would use Supabase
    const mockSubscription = {
      id: subscription.id,
      unsubscribe: () => {
        subscriptionsRef.current.delete(subscription.id);
      }
    };

    subscriptionsRef.current.set(subscription.id, mockSubscription);

    // Simulate receiving real-time updates
    const simulateUpdates = () => {
      if (Math.random() > 0.7) { // 30% chance of update
        const mockPayload = {
          eventType: 'UPDATE',
          new: { id: Math.random(), updated_at: new Date().toISOString() },
          old: {},
          table: subscription.table
        };

        subscription.onUpdate?.(mockPayload);
      }
    };

    const interval = setInterval(simulateUpdates, 10000); // Every 10 seconds

    return {
      ...mockSubscription,
      unsubscribe: () => {
        clearInterval(interval);
        subscriptionsRef.current.delete(subscription.id);
      }
    };
  }, [isConnected]);

  // Unsubscribe from specific subscription
  const unsubscribe = useCallback((subscriptionId: string) => {
    const subscription = subscriptionsRef.current.get(subscriptionId);
    if (subscription) {
      subscription.unsubscribe();
    }
  }, []);

  // Subscribe to multiple tables
  const subscribeToTables = useCallback((newSubscriptions: RealtimeSubscription[]) => {
    return newSubscriptions.map(sub => subscribe(sub)).filter(Boolean);
  }, [subscribe]);

  // Broadcast a message to other clients
  const broadcast = useCallback((channel: string, event: string, payload: any) => {
    if (!isConnected) {
      console.warn('Cannot broadcast: not connected to realtime');
      return false;
    }

    // Mock broadcast - in real implementation would use Supabase
    console.log('Broadcasting:', { channel, event, payload });
    return true;
  }, [isConnected]);

  // Listen for presence changes (who's online)
  const trackPresence = useCallback((channel: string, userInfo: any) => {
    if (!isConnected) return null;

    // Mock presence tracking
    const presenceRef = {
      untrack: () => {
        console.log('Stopped tracking presence');
      }
    };

    console.log('Tracking presence:', { channel, userInfo });
    return presenceRef;
  }, [isConnected]);

  // Effect to handle connection
  useEffect(() => {
    if (enabled && user) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [enabled, user, connect, disconnect]);

  // Effect to handle subscriptions
  useEffect(() => {
    if (isConnected && subscriptions.length > 0) {
      const activeSubscriptions = subscribeToTables(subscriptions);
      
      return () => {
        activeSubscriptions.forEach(sub => sub?.unsubscribe());
      };
    }
  }, [isConnected, subscriptions, subscribeToTables]);

  // Effect to handle connection errors and reconnection
  useEffect(() => {
    if (connectionStatus === 'error' && enabled) {
      reconnect();
    }
  }, [connectionStatus, enabled, reconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    connectionStatus,
    error,
    subscribe,
    unsubscribe,
    subscribeToTables,
    broadcast,
    trackPresence,
    connect,
    disconnect,
    reconnect
  };
};

// Hook for subscribing to a specific table
export const useRealtimeTable = (
  tableName: string,
  callbacks: {
    onInsert?: (payload: any) => void;
    onUpdate?: (payload: any) => void;
    onDelete?: (payload: any) => void;
  },
  filter?: string,
  enabled: boolean = true
) => {
  const subscription: RealtimeSubscription = {
    id: `${tableName}-${Date.now()}`,
    table: tableName,
    filter,
    ...callbacks
  };

  return useRealtime([subscription], { enabled });
};

// Hook for presence tracking in a specific channel
export const usePresence = (channel: string, userInfo: any, enabled: boolean = true) => {
  const [presenceState, setPresenceState] = useState<any[]>([]);
  const { trackPresence, isConnected } = useRealtime([], { enabled });

  useEffect(() => {
    if (isConnected && enabled) {
      const presenceRef = trackPresence(channel, userInfo);
      
      // Mock presence updates
      const interval = setInterval(() => {
        setPresenceState(prev => [
          ...prev.slice(-4), // Keep last 4 entries
          {
            user: userInfo,
            online_at: new Date().toISOString()
          }
        ]);
      }, 30000); // Update every 30 seconds

      return () => {
        clearInterval(interval);
        presenceRef?.untrack();
      };
    }
  }, [isConnected, enabled, channel, userInfo, trackPresence]);

  return {
    presenceState,
    isConnected
  };
};

// Hook for broadcasting messages
export const useBroadcast = (channel: string) => {
  const { broadcast, isConnected } = useRealtime();
  const [messages, setMessages] = useState<any[]>([]);

  const sendMessage = useCallback((event: string, payload: any) => {
    const success = broadcast(channel, event, payload);
    if (success) {
      // Add to local messages for demo
      setMessages(prev => [...prev, { event, payload, timestamp: Date.now() }]);
    }
    return success;
  }, [broadcast, channel]);

  return {
    sendMessage,
    messages,
    isConnected
  };
};