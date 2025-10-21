import { createRoot, type Root } from 'react-dom/client'
import App from './App.tsx'

class ReactLocationsApp extends HTMLElement {
  private root: Root | null = null

  connectedCallback() {
    this.root = createRoot(this)
    this.root.render(<App />)
  }

  disconnectedCallback() {
    if (this.root) {
      this.root.unmount()
    }
  }
}

customElements.define('react-locations-app', ReactLocationsApp)
