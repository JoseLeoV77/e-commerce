import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { useTranslation } from 'react-i18next';
import "./footer.css"

interface NavLink {
  label: string;
  href: string;
}

interface FooterProps {
  companyName: string;
  year: number;
}

const Footer: React.FC<FooterProps> = ({ companyName, year }) => {

  const { t } = useTranslation()

  const customerServiceLinks: NavLink[] = [
    { label: 'Contact Us', href: '/contact' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Shipping & Delivery', href: '/shipping' },
    { label: 'Returns & Exchanges', href: '/returns' },
    { label: 'Order Tracking', href: '/orders/track' },
  ];

  const shopLinks: NavLink[] = [
    { label: "Gaming", href: '/search?q=gaming' },
    { label: "Furniture", href: '/search?q=furniture' },
  ];

  const companyLinks: NavLink[] = [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press / Blog', href: '/blog' },
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
          <h3>{t("customer_service_word")}</h3>
          <ul>
            {customerServiceLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-section">
          <h3>{t("shop_word")}</h3>
          <ul>
            {shopLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-section">
          <h3>{t("company_word")}</h3>
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
          <h3>{t("stay_connected")}</h3>
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
        <p>&copy; {year} {companyName}. {t("rights_reserved")}</p>
      </div>
    </footer>
  );
};

export default Footer;