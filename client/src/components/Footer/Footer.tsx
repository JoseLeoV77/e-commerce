import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';

interface NavLink {
  label: string;
  href: string;
}

interface FooterProps {
  companyName: string;
  year: number;
}

const Footer: React.FC<FooterProps> = ({ companyName, year }) => {
  const [newsletterEmail, setNewsletterEmail] = useState<string>('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    setNewsletterStatus('submitting');
    // try {
    //   await newsletterSignup(newsletterEmail);
    //   setNewsletterStatus('success');
    //   setNewsletterEmail('');
    // } catch (error) {
    //   console.error('Newsletter signup failed:', error);
    //   setNewsletterStatus('error');
    // }
  };

  const customerServiceLinks: NavLink[] = [
    { label: 'Contact Us', href: '/contact' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Shipping & Delivery', href: '/shipping' },
    { label: 'Returns & Exchanges', href: '/returns' },
    { label: 'Order Tracking', href: '/orders/track' },
  ];

  const shopLinks: NavLink[] = [
    { label: "Men's", href: '/shop/men' },
    { label: "Women's", href: '/shop/women' },
    { label: 'Accessories', href: '/shop/accessories' },
    { label: 'New Arrivals', href: '/shop/new-arrivals' },
    { label: 'Sale', href: '/shop/sale' },
  ];

  const companyLinks: NavLink[] = [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press / Blog', href: '/blog' },
    // { label: 'Store Locator', href: '/stores' }, // Uncomment if applicable
  ];

  const legalLinks: NavLink[] = [
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Cookie Policy', href: '/cookies' },
  ];

  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Customer Service</h3>
          <ul>
            {customerServiceLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-section">
          <h3>Shop</h3>
          <ul>
            {shopLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-section">
          <h3>Company</h3>
          <ul>
            {companyLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-section">
          <h3>Legal</h3>
          <ul>
            {legalLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-section newsletter-social">
          <h3>Stay Connected</h3>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FontAwesomeIcon icon={faFacebookF} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FontAwesomeIcon icon={faTwitter} />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {year} {companyName}. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;