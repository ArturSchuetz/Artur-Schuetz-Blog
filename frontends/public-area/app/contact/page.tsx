import { getConfig } from "@/config";
import siteConfig from "@/app/siteConfig.json";
import ContactForm from "@/app/_components/partial/contactForm";

export async function generateMetadata() {
  const page_title = 'Contact';
  const site_description = 'Get in touch with Artur Schütz for professional software solutions and expert consulting. This page provides all the necessary information to reach Artur, including email address, phone number, and location details. Feel free to use the contact form for inquiries and project proposals'
  const canonical_site_url = '/contact';

  return {
    title: page_title + ' | ' + siteConfig.site.title,
    description: site_description,
    keywords: 'contact, artur, schütz, contact form, email, message, telephone, phone, location, software engineer, game developer',
    alternates: { canonical: canonical_site_url },
    openGraph: {
      type: 'website',
      determiner: 'auto',
      title: page_title,
      description: site_description,
      siteName: siteConfig.site.title,
      locale: 'en_US',
      url: getConfig().baseUrl + canonical_site_url,
      phoneNumbers: siteConfig.author.phone,
      emails: siteConfig.author.email,
    },
    twitter: {
      card: 'summary_large_image',
      site: siteConfig.site.twitter_site,
      creator: siteConfig.site.twitter_creator,
      title: page_title,
      description: site_description,
      images: getConfig().baseUrl + "/img/00066-4008645638.png"
    },
    formatDetection: {
      telephone: true,
      date: false,
      address: false,
      email: true,
      url: false
    },
    category: 'Contact Page',
    classification: 'Software Engineering'
  }
}

export default function Contact() {
  return (
    <>
      <main>
        <div className="container">
          <div className="contact white-box">
            <div className="row">
              <div className="col-xs-12 col-md-6 col-lg-4">
                <h2 className="h4">Contact me</h2>
                <ul>
                  <li className="d-flex">
                    <div className="contact-info-icon">
                      <i className="pe-7s-mail text-4xl"></i>
                    </div>
                    <div className="contact-info">
                      <a
                        className="contact-info-text font-secondary common-letter-spacing"
                        href={`mailto:${siteConfig.author.email}`}
                      >
                        {siteConfig.author.email}
                      </a>
                      <span className="d-block small-text">email</span>
                    </div>
                  </li>
                  <li className="d-flex">
                    <div className="contact-info-icon">
                      <i className="pe-7s-call text-4xl"></i>
                    </div>
                    <div className="contact-info">
                      <a
                        className="contact-info-text font-secondary common-letter-spacing"
                        href={`tel:${siteConfig.author.phone}`}
                      >
                        {siteConfig.author.phone}
                      </a>
                      <span className="d-block small-text">phone</span>
                    </div>
                  </li>
                  <li className="d-flex">
                    <div className="contact-info-icon">
                      <i className="pe-7s-map-marker text-4xl"></i>
                    </div>
                    <div className="contact-info">
                      <span className="contact-info-text font-secondary common-letter-spacing">
                        {siteConfig.author.location
                          .split(",")
                          .map((part, index, array) =>
                            index === array.length - 1 ? (
                              part
                            ) : (
                              <div key={index}>
                                {part}
                                <br />
                              </div>
                            )
                          )}
                      </span>
                      <span className="d-block small-text">location</span>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="col-md-6 col-lg-8">
                <h2 className="h4">Get in touch</h2>
                <p className="font-primary">
                  Don&apos;t be shy, just slide into my DMs.
                </p>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
