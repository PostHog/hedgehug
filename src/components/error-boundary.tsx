"use client"

import React from "react"
import posthog from "posthog-js"
import { Button } from "@/components/ui/button"

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    posthog.captureException(error, {
      componentStack: errorInfo.componentStack,
      source: "react-error-boundary",
    })

    posthog.captureLog({
      body: `React error boundary caught: ${error.message}`,
      level: "error",
      attributes: {
        component_stack: errorInfo.componentStack || "",
        error_name: error.name,
      },
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 p-8 text-center">
          <p className="text-lg font-semibold">Algo deu errado</p>
          <p className="text-sm text-muted-foreground">
            Um erro inesperado aconteceu. Tente recarregar a página.
          </p>
          <Button onClick={() => this.setState({ hasError: false })}>
            Tentar novamente
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
