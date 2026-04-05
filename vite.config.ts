// vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  // This must match your GitHub Repository name
  // e.g., if your repo is github.com/username/ai-poc, use '/ai-poc/'
  base: '/eustress-poc/', 
  
  build: {
    // This ensures your build goes to a folder GitHub Pages can see easily
    outDir: 'dist',
  }
})
