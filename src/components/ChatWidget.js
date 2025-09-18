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
          autoOpen: false, // Prevent auto-opening
          showFloatingButton: true, // Keep the floating button
        });
      }
      
      // Expose a global function to open the chat
      window.openAgentiveChat = function () {
        if (window.myChatWidget && typeof window.myChatWidget.open === 'function') {
          window.myChatWidget.open();
        }
      };

      // Add tooltip to chat widget floating button
      const addTooltipToChatButton = () => {
        // Wait for the chat widget to be rendered
        setTimeout(() => {
          const chatButton = document.querySelector('[data-chat-widget-button]') || 
                           document.querySelector('.chat-widget-button') ||
                           document.querySelector('[class*="chat"]') ||
                           document.querySelector('[class*="Chat"]') ||
                           document.querySelector('button[aria-label*="chat" i]') ||
                           document.querySelector('button[aria-label*="Chat" i]');
          
          if (chatButton && !chatButton.querySelector('.chat-tooltip')) {
            // Create tooltip element
            const tooltip = document.createElement('div');
            tooltip.className = 'chat-tooltip';
            tooltip.innerHTML = `
              <div class="tooltip-content">
                Need help to start chat with me
                <div class="tooltip-arrow"></div>
              </div>
            `;
            
            // Add CSS styles for the tooltip
            const style = document.createElement('style');
            style.textContent = `
              .chat-tooltip {
                position: absolute;
                bottom: 100%;
                right: 0;
                margin-bottom: 10px;
                opacity: 0;
                transform: translateY(10px);
                transition: all 0.3s ease-in-out;
                pointer-events: none;
                z-index: 10000;
                animation: tooltipAutoShow 4s ease-in-out infinite;
              }
              
              .tooltip-content {
                background: #1f2937;
                color: white;
                padding: 8px 12px;
                border-radius: 8px;
                font-size: 12px;
                font-weight: 500;
                white-space: nowrap;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                position: relative;
              }
              
              .tooltip-arrow {
                position: absolute;
                top: 100%;
                right: 20px;
                width: 0;
                height: 0;
                border-left: 6px solid transparent;
                border-right: 6px solid transparent;
                border-top: 6px solid #1f2937;
              }
              
              @keyframes tooltipAutoShow {
                0%, 20% {
                  opacity: 0;
                  transform: translateY(10px);
                }
                25%, 75% {
                  opacity: 1;
                  transform: translateY(0);
                }
                80%, 100% {
                  opacity: 0;
                  transform: translateY(10px);
                }
              }
              
              /* Show tooltip on hover */
              .chat-widget-container:hover .chat-tooltip,
              .chat-widget-container:focus .chat-tooltip {
                opacity: 1 !important;
                transform: translateY(0) !important;
                animation: none;
              }
            `;
            
            // Add styles to head
            document.head.appendChild(style);
            
            // Make the chat button container relative positioned
            chatButton.style.position = 'relative';
            chatButton.classList.add('chat-widget-container');
            
            // Add tooltip to chat button
            chatButton.appendChild(tooltip);
            
            console.log('Chat widget tooltip added successfully');
          } else if (!chatButton) {
            // Retry after a short delay if button not found
            setTimeout(addTooltipToChatButton, 1000);
          }
        }, 2000); // Wait 2 seconds for chat widget to load
      };

      // Start trying to add tooltip
      addTooltipToChatButton();
    };

    // Insert before the first script tag
    const s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(v, s);
  }, []);

  return null; // This component does not render anything visible
}
    