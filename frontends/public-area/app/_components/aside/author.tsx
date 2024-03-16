import Image from "next/image";
import Link from "next/link";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {faTwitter, faFacebookF, faYoutube, faLinkedinIn, faGithub} from '@fortawesome/fontawesome-free-brands';

import profile_picture from "@/public/img/00066-4008645638.png";
import siteConfig from "@/app/siteConfig.json";

export default function Author() {
  return (
    <section className="author">
      <Image
        className="roundprofilepicture"
        src={profile_picture}
        alt={siteConfig.author.name}
        width="150"
        height="150"
      />
      <h2>
        {siteConfig.author.name}, {siteConfig.author.postfix}
      </h2>
      <span className="author-info">{siteConfig.author.title}</span>
      <span className="author-info">
        <Link href={siteConfig.author.companyUrl}>
          {siteConfig.author.company}
        </Link>
      </span>
      <div className="author-social d-flex align-items-center justify-content-center">
        <a
          href={siteConfig.socialMedia.twitter}
          title="Twitter"
          className="social-icon"
        >
          <FontAwesomeIcon icon={faTwitter as IconProp} />
        </a>
        <a
          href={siteConfig.socialMedia.facebook}
          title="Facebook"
          className="social-icon"
        >
          <FontAwesomeIcon icon={faFacebookF as IconProp} />
        </a>
        <a
          href={siteConfig.socialMedia.youtube}
          title="Youtube"
          className="social-icon"
        >
          <FontAwesomeIcon icon={faYoutube as IconProp} />
        </a>
        <a
          href={siteConfig.socialMedia.linkedin}
          title="LinkedIn"
          className="social-icon"
        >
          <FontAwesomeIcon icon={faLinkedinIn as IconProp} />
        </a>
      </div>
      <ul className="author-nav">
        <li>
          <a
            href={siteConfig.author.Scholarprofile}
            title="Google Scholar Profile"
            rel="external nofollow noopener"
          >
            <i className="pe-7s-bookmarks"></i> My Publications
          </a>
        </li>
        <li>
          <Link
            className="d-flex align-items-center"
            href={`/contact`}
            title="Contact Me"
          >
            <i className="pe-7s-paper-plane"></i> Write message
          </Link>
        </li>
      </ul>
    </section>
  );
}
