import { createContext, useContext, useState } from 'react';

const AuthModalContext = createContext();

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
}

export function AuthModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialMode, setInitialMode] = useState('login');
  const [onSuccess, setOnSuccess] = useState(null);

  const openAuthModal = (mode = 'login', successCallback = null) => {
    setInitialMode(mode);
    setOnSuccess(() => successCallback);
    setIsOpen(true);
  };

  const closeAuthModal = () => {
    setIsOpen(false);
    setInitialMode('login');
    setOnSuccess(null);
  };

  const value = {
    isOpen,
    initialMode,
    onSuccess,
    openAuthModal,
    closeAuthModal,
  };

  return (
    <AuthModalContext.Provider value={value}>
      {children}
    </AuthModalContext.Provider>
  );
}
