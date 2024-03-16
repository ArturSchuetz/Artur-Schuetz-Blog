"use client";
import cookieconsentstyles from "./cookieconsentstyle.module.css";

import { useEffect, useState } from "react";
import { deleteCookie, hasCookie, setCookie } from "cookies-next";
import Link from "next/link";

import siteConfig from "@/app/siteConfig.json";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faTwitter, faFacebookF, faYoutube, faLinkedinIn, faGithub } from '@fortawesome/fontawesome-free-brands';

export default function Footer() {
  const [showConsentPopup, setShowConsentPopup] = useState(false);

  useEffect(() => {
    setShowConsentPopup(!hasCookie("localConsent"));
  }, []);

  const declineConsent = () => {
    // expires in 1 year
    setCookie("localConsent", "false", { expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) });
    setShowConsentPopup(false);
  };

  const acceptCookie = () => {
    setCookie("localConsent", "true", { expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) });
    setShowConsentPopup(false);
  };

  const deleteConsentCookie = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent> 
  ) => {
    e.preventDefault();
    deleteCookie("localConsent");
    setShowConsentPopup(true);
  };

  return (
    <footer>
      <div className="container">
        <div className="row">
          <div className="col-md-4 col-xs-12">
            <div className="footer-section">
              <ul className="footer-section-content">
                <li>
                  <Link href="/privacy-policy">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/cookie-privacy-policy">Cookie Policy</Link>
                </li>
                <li>
                  <Link href="/imprint">Imprint</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-md-4 col-xs-12">
            <div className="footer-section"></div>
          </div>

          <div className="col-md-4 col-xs-12">
            <div className="footer-section">
              <ul className="footer-section-content">
                <li>
                  <a href="#" onClick={deleteConsentCookie}>Cookie Settings</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <div className="copyright d-flex align-items-center justify-content-between flex-column flex-md-row-reverse ">
              <ul className="d-flex">
                <li>
                  <a
                    href={siteConfig.socialMedia.github}
                    className="social-icon"
                    title="Github"
                  >
                    <FontAwesomeIcon icon={faGithub as IconProp} />
                  </a>
                </li>
                <li>
                  <a
                    href={siteConfig.socialMedia.twitter}
                    className="social-icon"
                    title="Twitter"
                  >
                    <FontAwesomeIcon icon={faTwitter as IconProp} />
                  </a>
                </li>
                <li>
                  <a
                    href={siteConfig.socialMedia.facebook}
                    className="social-icon"
                    title="Facebook"
                  >
                    <FontAwesomeIcon icon={faFacebookF as IconProp} />
                  </a>
                </li>
                <li>
                  <a
                    href={siteConfig.socialMedia.youtube}
                    className="social-icon"
                    title="Youtube"
                  >
                    <FontAwesomeIcon icon={faYoutube as IconProp} />
                  </a>
                </li>
                <li>
                  <a
                    href={siteConfig.socialMedia.linkedin}
                    className="social-icon"
                    title="LinkedIn"
                  >
                    <FontAwesomeIcon icon={faLinkedinIn as IconProp} />
                  </a>
                </li>
              </ul>
              <p>&copy; 2024 {siteConfig.author.name}. All Rights Reserved.</p>
            </div>
          </div>
        </div>
      </div>
      {showConsentPopup &&
        <div className={`${cookieconsentstyles['cookieconsent']}`}>
          <button className={`${cookieconsentstyles['smallhidebutton']}`} onClick={declineConsent}
            aria-label="Close cookie consent banner">&times;</button>
          <span>
            <strong>Cookie Consent</strong><br /><br />
            <strong>Current:</strong> We use essential external libraries like MathJax to enhance functionality. We don&apos;t store personal data without consent.<br /><br />
            <strong>Future Changes:</strong> We plan to implement features like comment systems that may require cookies.<br /><br />
            <strong>Your Choice:</strong> You can consent now for a seamless experience or adjust your preferences later.<br />
          </span>
          <div className={`${cookieconsentstyles['d-flex']} mt-2`}>
            <button className={`${cookieconsentstyles['allowbutton']}`} onClick={() => acceptCookie()}>Agree</button>
            <button className={`${cookieconsentstyles['declinebutton']}`} onClick={declineConsent}>Decline</button>
            <Link href="/cookie-privacy-policy" className={`${cookieconsentstyles['linkbutton']}`}>Learn More</Link>
          </div>
        </div>}
    </footer>
  );
}
