import { useEffect } from 'react';

export default function ChatWidget() {
  useEffect(() => {
    // Prevent loading the script multiple times
    if (document.getElementById('agentivehub-chat-script')) return;

    const v = document.createElement('script');
    v.id = 'agentivehub-chat-script';
    v.type = 'text/javascript';
    v.src = 'https://agentivehub.com/production.bundle.min.js';

    v.onload = function () {
      // Only add #root if it doesn't exist (should already exist in React apps)
      if (!document.getElementById('root')) {
        const root = document.createElement('div');
        root.id = 'root';
        document.body.appendChild(root);
      }
      if (window.myChatWidget && typeof window.myChatWidget.load === 'function') {
        window.myChatWidget.load({
          id: '94a0718b-11e6-4a56-bf6e-1a732b611836',
        });
      }
      // Expose a global function to open the chat
      window.openAgentiveChat = function () {
        if (window.myChatWidget && typeof window.myChatWidget.open === 'function') {
          window.myChatWidget.open();
        }
      };
    };

    // Insert before the first script tag
    const s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(v, s);
  }, []);

  return null; // This component does not render anything visible
}
    