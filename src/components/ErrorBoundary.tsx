import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-red-600 mb-4">
                Algo deu errado!
              </h2>
              <div className="text-left">
                <h3 className="font-medium text-gray-900 mb-2">Erro:</h3>
                <pre className="text-sm text-red-600 bg-red-50 p-3 rounded overflow-auto">
                  {this.state.error?.message}
                </pre>
                {this.state.error?.stack && (
                  <>
                    <h3 className="font-medium text-gray-900 mb-2 mt-4">Stack Trace:</h3>
                    <pre className="text-xs text-gray-600 bg-gray-50 p-3 rounded overflow-auto max-h-40">
                      {this.state.error.stack}
                    </pre>
                  </>
                )}
              </div>
              <button
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => window.location.reload()}
              >
                Recarregar Página
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;