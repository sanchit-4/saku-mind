import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <span className={styles.footerLink}>Terms and Privacy policy</span>
      <span className={styles.footerCopyright}>© 2026 Saku Mind Ltd.</span>
    </footer>
  );
};

export default Footer;
