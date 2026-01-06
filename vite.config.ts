
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,      // Теперь ссылка всегда будет http://localhost:3000
    host: true,      // Позволяет зайти на сайт с телефона через твой IP (например, 192.168.1.10:3000)
    open: true,      // Автоматически открывать браузер при запуске
  },
});
