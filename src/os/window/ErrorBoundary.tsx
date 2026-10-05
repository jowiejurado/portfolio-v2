import { Component, type ReactNode } from 'react'
import { FaceFrownIcon } from '@heroicons/react/24/outline'

export class AppErrorBoundary extends Component<{ children: ReactNode; onClose: () => void }, { error: Error | null }> {
  state = { error: null as Error | null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="grid h-full place-items-center p-8 text-center">
        <div className="max-w-sm">
          <FaceFrownIcon className="mx-auto mb-4 size-12 text-fg-dim" />
          <p className="text-lg font-semibold">This app stopped responding</p>
          <p className="mt-1 text-sm text-fg-dim">{this.state.error.message}</p>
          <div className="mt-6 flex justify-center gap-2">
            <button
              className="h-9 rounded-lg bg-secondary px-4 text-sm font-semibold hover:bg-press"
              onClick={() => this.setState({ error: null })}
            >
              Try Again
            </button>
            <button
              className="h-9 rounded-lg bg-brand px-4 text-sm font-semibold text-brand-fg hover:brightness-110"
              onClick={this.props.onClose}
            >
              Force Quit
            </button>
          </div>
        </div>
      </div>
    )
  }
}
