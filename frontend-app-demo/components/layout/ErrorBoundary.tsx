'use client';

import { Button } from '@/components/ui/button';
import { PageCard, PageCardContent, PageCardDescription, PageCardHeader, PageCardTitle } from '@/components/ui/page-card';
import { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center min-h-[400px] p-4">
          <PageCard variant="warning" size="lg" className="max-w-md">
            <PageCardHeader>
              <PageCardTitle className="text-lg">出现了一个错误</PageCardTitle>
              <PageCardDescription>
                页面遇到了意外错误，请稍后重试。如果问题持续存在，请联系技术支持。
              </PageCardDescription>
            </PageCardHeader>
            <PageCardContent>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600 font-mono">
                    {this.state.error.message}
                  </p>
                </div>
              )}
              <div className="flex gap-2">
                <Button onClick={this.handleRetry} variant="default" size="sm">
                  重试
                </Button>
                <Button 
                  onClick={() => window.location.href = '/dashboard'} 
                  variant="secondary" 
                  size="sm"
                >
                  返回首页
                </Button>
              </div>
            </PageCardContent>
          </PageCard>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;