import { useAuthModal } from '../contexts/AuthModalContext';
import AuthModal from './AuthModal';

export default function AuthModalWrapper() {
  const { isOpen, initialMode, onSuccess, closeAuthModal } = useAuthModal();

  return (
    <AuthModal
      isOpen={isOpen}
      onClose={closeAuthModal}
      initialMode={initialMode}
      onSuccess={onSuccess}
    />
  );
}
