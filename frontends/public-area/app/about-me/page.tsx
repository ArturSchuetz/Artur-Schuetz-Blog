import siteConfig from "@/app/siteConfig.json";

import Image from "next/image";
import Link from "next/link";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {faTwitter, faFacebookF, faYoutube, faLinkedinIn, faGithub} from '@fortawesome/fontawesome-free-brands';

import profile_picture from "@/public/img/00066-4008645638.png";

import { getConfig } from "@/config";

export async function generateMetadata() {
  const page_title = 'About Me';
  const site_description = 'Discover more about Artur Schütz, a passionate software developer and innovator. On this page, he shares his professional journey, expertise in 3D programming and machine learning, and visions for the future of technology. Explore Artur’s career path, projects, and what drives him in the tech world'
  const canonical_site_url = '/about-me';

  return {
    title: page_title + ' | ' + siteConfig.site.title,
    description: site_description,
    keywords: 'about, artur, schütz, software engineer, 3d rendering, graphics, web development, machine learning, ai, development, software architecture, software engineering, data processing, network, research, academia',
    alternates: { canonical: canonical_site_url },
    openGraph: {
      type: 'website',
      determiner: 'auto',
      title: page_title,
      description: site_description,
      siteName: siteConfig.site.title,
      locale: 'en_US',
      images: [{
        url: getConfig().baseUrl + "/img/00066-4008645638.png",
      }],
      url: getConfig().baseUrl + canonical_site_url,
    },
    twitter: {
      card: "summary_large_image",
      site: siteConfig.site.twitter_site,
      creator: siteConfig.site.twitter_creator,
      title: page_title,
      description: site_description,
      images: getConfig().baseUrl + "/img/00066-4008645638.png"
    },
    formatDetection: {
      telephone: false,
      date: false,
      address: false,
      email: false,
      url: false
    },
    category: 'About Me Page',
    classification: 'Software Engineering'
  }
}

export default function AboutMe() {
  return (
    <>
      <main>
        <div className="container">
          <section className="about-me">
            <div className="d-flex flex-column flex-md-row">
              <div className="about-me-author">
                <Image
                  className="roundprofilepicture"
                  src={profile_picture}
                  alt={siteConfig.author.name}
                  width="200"
                  height="200"
                />
                <ul className="author-nav text-left">
                  <li>
                    <a
                      target="_blank"
                      href={siteConfig.author.Scholarprofile}
                      title="Google Scholar Profile"
                      rel="external nofollow noopener"
                    >
                      <i className="pe-7s-bookmarks"></i> My Publications
                    </a>
                  </li>
                  <li>
                    <Link title="Contact Me" href="/contact">
                      <i className="pe-7s-paper-plane"></i> Write message
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="about-me-content">
                <div className="d-flex align-items-start align-items-md-center justify-content-between flex-column flex-md-row">
                  <h1 className="h1 fw-900">I&apos;m {siteConfig.author.name}</h1>
                  <div className="d-flex align-items-start justify-content-center">
                    <a
                      href={siteConfig.socialMedia.github}
                      className="social-icon"
                      title="Github"
                      rel="external nofollow noopener"
                    >
                      <FontAwesomeIcon icon={faGithub as IconProp} />
                    </a>
                    <a
                      href={siteConfig.socialMedia.twitter}
                      className="social-icon"
                      title="Twitter"
                      rel="external nofollow noopener"
                    >
                      <FontAwesomeIcon icon={faTwitter as IconProp} />
                    </a>
                    <a
                      href={siteConfig.socialMedia.facebook}
                      className="social-icon"
                      title="Facebook"
                      rel="external nofollow noopener"
                    >
                      <FontAwesomeIcon icon={faFacebookF as IconProp} />
                    </a>
                    <a
                      href={siteConfig.socialMedia.youtube}
                      className="social-icon"
                      title="Youtube"
                      rel="external nofollow noopener"
                    >
                      <FontAwesomeIcon icon={faYoutube as IconProp} />
                    </a>
                    <a
                      href={siteConfig.socialMedia.linkedin}
                      className="social-icon"
                      title="LinkedIn"
                      rel="external nofollow noopener"
                    >
                      <FontAwesomeIcon icon={faLinkedinIn as IconProp} />
                    </a>
                  </div>
                </div>
                <span className="about-me-information">
                  {siteConfig.author.title} at{" "}
                  <Link
                    href={siteConfig.author.companyUrl}
                    rel="external nofollow noopener"
                  >
                    {siteConfig.author.company}
                  </Link>
                </span>

                {siteConfig.aboutMeInformation.map((element, index) => (
                  <p key={index} className="font-secondary about-me-description">
                    {element}
                  </p>
                ))}
              </div>
            </div>
          </section>
          <section className="details white-box">
            <div className="row">
              <div className="philosophy col-xs-12 col-md-6">
                <div className="philosophy-content">
                  <h2 className="details-header fw-900">My Philosophy</h2>
                  {siteConfig.philosophyContent.map((element, index) => (
                    <p
                      key={index}
                      className="philosophy-content-text font-secondary"
                    >
                      {element}
                    </p>
                  ))}
                </div>
              </div>
              <div className="skills col-xs-12 col-md-6">
                <div className="skills-content">
                  <h2 className="details-header fw-900">Skills</h2>
                  <ol className="skills-list">
                    {siteConfig.skills.map((element, index) => (
                      <li key={index} className="d-flex align-items-start">
                        <span className="skills-list-numbering">
                          0{index + 1}
                        </span>
                        <div className="skills-right">
                          <h3 className="skills-list-titles fw-900">
                            {element.title}
                          </h3>
                          <p className="skills-list-content font-secondary">
                            {element.text}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
