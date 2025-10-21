import { createRoot, type Root } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

class ReactLocationsApp extends HTMLElement {
  private root: Root | null = null

  connectedCallback() {
    const mountPoint = document.createElement('div')
    this.appendChild(mountPoint)

    this.root = createRoot(mountPoint)
    this.root.render(<App />)
  }

  disconnectedCallback() {
    if (this.root) {
      this.root.unmount()
    }
  }
}

customElements.define('react-locations-app', ReactLocationsApp)
