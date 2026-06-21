import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const routeTitleMap: Record<string, string> = {
  '/': 'Home',
  '/features': 'Features',
  '/pricing': 'Pricing',
  '/blog': 'Blog',
  '/about': 'About',
  '/contact': 'Contact',
  '/tool/email-automation': 'Email Automation',
  '/tool/email-verification': 'Email Verifier',
  '/tool/campaigns': 'Campaigns',
  '/tool/analytics': 'Analytics',
  '/tool/ai-chat': 'Genzio AI',
  '/login': 'Login',
  '/signup': 'Sign Up',
  '/privacy': 'Privacy Policy',
  '/terms': 'Terms of Use',
  '/faq': 'FAQ',
  '/nexzivo': 'Nexzivo',
  '/security': 'Security',
};

export default function DynamicTitle() {
  const location = useLocation();

  useEffect(() => {
    const defaultTitle = 'Genzio AI';
    const pageName = routeTitleMap[location.pathname];
    
    if (pageName) {
      document.title = `${defaultTitle} | ${pageName}`;
    } else {
      // Try to construct basic title for unmapped routes
      const pathParts = location.pathname.split('/').filter(Boolean);
      if (pathParts.length > 0) {
        const lastPart = pathParts[pathParts.length - 1];
        const formatted = lastPart.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        document.title = `${defaultTitle} | ${formatted}`;
      } else {
        document.title = defaultTitle;
      }
    }
  }, [location.pathname]);

  return null;
}
