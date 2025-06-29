import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';

export interface VoiceCommand {
  id: string;
  timestamp: Date;
  originalText: string;
  interpretedAction: string;
  status: 'success' | 'error' | 'processing';
  result?: string;
  confidence?: number;
}

export interface VoiceAssistantState {
  isListening: boolean;
  isProcessing: boolean;
  isEnabled: boolean;
  currentTranscription: string;
  commandHistory: VoiceCommand[];
  audioLevel: number;
  error: string | null;
  settings: {
    language: string;
    autoStart: boolean;
    confidenceThreshold: number;
    maxHistoryItems: number;
  };
}

type VoiceAssistantAction =
  | { type: 'START_LISTENING' }
  | { type: 'STOP_LISTENING' }
  | { type: 'SET_PROCESSING'; payload: boolean }
  | { type: 'SET_TRANSCRIPTION'; payload: string }
  | { type: 'ADD_COMMAND'; payload: VoiceCommand }
  | { type: 'UPDATE_COMMAND'; payload: { id: string; updates: Partial<VoiceCommand> } }
  | { type: 'SET_AUDIO_LEVEL'; payload: number }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ENABLED'; payload: boolean }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<VoiceAssistantState['settings']> }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'RESET' };

const initialState: VoiceAssistantState = {
  isListening: false,
  isProcessing: false,
  isEnabled: false,
  currentTranscription: '',
  commandHistory: [],
  audioLevel: 0,
  error: null,
  settings: {
    language: 'pt-BR',
    autoStart: false,
    confidenceThreshold: 0.7,
    maxHistoryItems: 50
  }
};

const voiceAssistantReducer = (
  state: VoiceAssistantState,
  action: VoiceAssistantAction
): VoiceAssistantState => {
  switch (action.type) {
    case 'START_LISTENING':
      return {
        ...state,
        isListening: true,
        error: null,
        currentTranscription: ''
      };

    case 'STOP_LISTENING':
      return {
        ...state,
        isListening: false,
        audioLevel: 0
      };

    case 'SET_PROCESSING':
      return {
        ...state,
        isProcessing: action.payload
      };

    case 'SET_TRANSCRIPTION':
      return {
        ...state,
        currentTranscription: action.payload
      };

    case 'ADD_COMMAND':
      return {
        ...state,
        commandHistory: [
          action.payload,
          ...state.commandHistory.slice(0, state.settings.maxHistoryItems - 1)
        ],
        currentTranscription: ''
      };

    case 'UPDATE_COMMAND':
      return {
        ...state,
        commandHistory: state.commandHistory.map(cmd =>
          cmd.id === action.payload.id
            ? { ...cmd, ...action.payload.updates }
            : cmd
        )
      };

    case 'SET_AUDIO_LEVEL':
      return {
        ...state,
        audioLevel: action.payload
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isListening: action.payload ? false : state.isListening,
        isProcessing: action.payload ? false : state.isProcessing
      };

    case 'SET_ENABLED':
      return {
        ...state,
        isEnabled: action.payload,
        isListening: action.payload ? state.isListening : false,
        isProcessing: action.payload ? state.isProcessing : false
      };

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };

    case 'CLEAR_HISTORY':
      return {
        ...state,
        commandHistory: []
      };

    case 'RESET':
      return {
        ...initialState,
        isEnabled: state.isEnabled,
        settings: state.settings
      };

    default:
      return state;
  }
};

interface VoiceAssistantContextType extends VoiceAssistantState {
  startListening: () => void;
  stopListening: () => void;
  processCommand: (text: string) => Promise<void>;
  updateSettings: (settings: Partial<VoiceAssistantState['settings']>) => void;
  clearHistory: () => void;
  reset: () => void;
  canUseVoiceAssistant: boolean;
}

const VoiceAssistantContext = createContext<VoiceAssistantContextType | undefined>(undefined);

export const useVoiceAssistant = () => {
  const context = useContext(VoiceAssistantContext);
  if (context === undefined) {
    throw new Error('useVoiceAssistant must be used within a VoiceAssistantProvider');
  }
  return context;
};

interface VoiceAssistantProviderProps {
  children: React.ReactNode;
}

export const VoiceAssistantProvider: React.FC<VoiceAssistantProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const { canUseFeature } = usePermissions();
  const [state, dispatch] = useReducer(voiceAssistantReducer, initialState);

  const canUseVoiceAssistant = canUseFeature('hasVoiceAssistant');

  // Initialize voice assistant based on permissions
  useEffect(() => {
    dispatch({ type: 'SET_ENABLED', payload: canUseVoiceAssistant });
  }, [canUseVoiceAssistant]);

  // Mock speech recognition for demonstration
  const startListening = useCallback(() => {
    if (!state.isEnabled || state.isListening) return;

    dispatch({ type: 'START_LISTENING' });

    // Simulate audio level changes
    const audioInterval = setInterval(() => {
      dispatch({ type: 'SET_AUDIO_LEVEL', payload: Math.random() * 100 });
    }, 100);

    // Simulate transcription
    setTimeout(() => {
      dispatch({ type: 'SET_TRANSCRIPTION', payload: 'Ouvindo...' });
    }, 500);

    setTimeout(() => {
      dispatch({ type: 'SET_TRANSCRIPTION', payload: 'adicionar teste de continuidade' });
      clearInterval(audioInterval);
    }, 3000);
  }, [state.isEnabled, state.isListening]);

  const stopListening = useCallback(() => {
    if (!state.isListening) return;

    dispatch({ type: 'STOP_LISTENING' });

    // Process the current transcription if available
    if (state.currentTranscription) {
      processCommand(state.currentTranscription);
    }
  }, [state.isListening, state.currentTranscription]);

  const processCommand = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const commandId = `cmd-${Date.now()}`;
    const command: VoiceCommand = {
      id: commandId,
      timestamp: new Date(),
      originalText: text,
      interpretedAction: 'Processando...',
      status: 'processing',
      confidence: 0.85
    };

    dispatch({ type: 'ADD_COMMAND', payload: command });
    dispatch({ type: 'SET_PROCESSING', payload: true });

    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock command interpretation
      let interpretedAction = '';
      let result = '';

      if (text.toLowerCase().includes('adicionar teste')) {
        interpretedAction = 'Adicionar teste: Teste de Continuidade';
        result = 'Teste adicionado com sucesso';
      } else if (text.toLowerCase().includes('marcar como concluído')) {
        interpretedAction = 'Marcar teste atual como concluído';
        result = 'Status atualizado';
      } else if (text.toLowerCase().includes('observação')) {
        interpretedAction = 'Adicionar observação';
        result = 'Observação registrada';
      } else if (text.toLowerCase().includes('finalizar')) {
        interpretedAction = 'Finalizar inspeção';
        result = 'Inspeção finalizada';
      } else {
        interpretedAction = 'Comando não reconhecido';
        result = 'Tente reformular o comando';
      }

      dispatch({
        type: 'UPDATE_COMMAND',
        payload: {
          id: commandId,
          updates: {
            interpretedAction,
            result,
            status: interpretedAction.includes('não reconhecido') ? 'error' : 'success'
          }
        }
      });

      // Execute the actual command here
      // This would integrate with the application's command system

    } catch (error) {
      dispatch({
        type: 'UPDATE_COMMAND',
        payload: {
          id: commandId,
          updates: {
            interpretedAction: 'Erro no processamento',
            result: 'Falha ao processar comando',
            status: 'error'
          }
        }
      });
    } finally {
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  }, []);

  const updateSettings = useCallback((newSettings: Partial<VoiceAssistantState['settings']>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: newSettings });
  }, []);

  const clearHistory = useCallback(() => {
    dispatch({ type: 'CLEAR_HISTORY' });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  // Auto-stop listening after a timeout
  useEffect(() => {
    if (state.isListening) {
      const timeout = setTimeout(() => {
        stopListening();
      }, 10000); // 10 seconds timeout

      return () => clearTimeout(timeout);
    }
  }, [state.isListening, stopListening]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (state.isListening) {
        dispatch({ type: 'STOP_LISTENING' });
      }
    };
  }, []);

  const contextValue: VoiceAssistantContextType = {
    ...state,
    startListening,
    stopListening,
    processCommand,
    updateSettings,
    clearHistory,
    reset,
    canUseVoiceAssistant
  };

  return (
    <VoiceAssistantContext.Provider value={contextValue}>
      {children}
    </VoiceAssistantContext.Provider>
  );
};

// Hook for voice command shortcuts
export const useVoiceCommands = () => {
  const { processCommand, isEnabled } = useVoiceAssistant();

  const executeCommand = useCallback((command: string) => {
    if (isEnabled) {
      processCommand(command);
    }
  }, [processCommand, isEnabled]);

  // Predefined commands
  const commands = {
    addTest: (testName: string) => executeCommand(`adicionar teste ${testName}`),
    markCompleted: () => executeCommand('marcar como concluído'),
    addObservation: (text: string) => executeCommand(`adicionar observação ${text}`),
    takePhoto: () => executeCommand('tirar foto'),
    finishInspection: () => executeCommand('finalizar inspeção'),
    pauseInspection: () => executeCommand('pausar inspeção'),
    resumeInspection: () => executeCommand('continuar inspeção')
  };

  return {
    executeCommand,
    commands,
    isEnabled
  };
};

// Hook for voice assistant settings
export const useVoiceSettings = () => {
  const { settings, updateSettings, canUseVoiceAssistant } = useVoiceAssistant();

  const updateLanguage = useCallback((language: string) => {
    updateSettings({ language });
  }, [updateSettings]);

  const updateConfidenceThreshold = useCallback((threshold: number) => {
    updateSettings({ confidenceThreshold: threshold });
  }, [updateSettings]);

  const toggleAutoStart = useCallback(() => {
    updateSettings({ autoStart: !settings.autoStart });
  }, [settings.autoStart, updateSettings]);

  return {
    settings,
    updateLanguage,
    updateConfidenceThreshold,
    toggleAutoStart,
    canUseVoiceAssistant
  };
};