import { useState } from 'react';
import { RouterProvider } from 'react-router';
import { AnimatePresence } from 'motion/react';
import { AppProvider } from './context/AppContext';
import { router } from './routes';
import { SplashScreen } from './components/splashscreen';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <AppProvider>
      {/* Splash screen overlays the app, fades out smoothly */}
      <AnimatePresence>
        {showSplash && (
          <SplashScreen onFinish={() => setShowSplash(false)} />
        )}
      </AnimatePresence>

      {/* Main app always mounted underneath */}
      <RouterProvider router={router} />
    </AppProvider>
  );
}
