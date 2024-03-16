import { getConfig } from "@/config";
import siteConfig from "@/app/siteConfig.json";

export async function generateMetadata() {
  const page_title = 'Cookie Policy';
  const canonical_site_url = '/cookie-privacy-policy';

  return {
    title: page_title + ' | ' + siteConfig.site.title,
    keywords: 'project, projects, portfolio, artur, schütz, cookie, privacy, policy',
    alternates: { canonical: canonical_site_url },
    openGraph: {
      type: 'website',
      determiner: 'auto',
      title: page_title,
      siteName: siteConfig.site.title,
      locale: 'en_US',
      url: getConfig().baseUrl + canonical_site_url,
      phoneNumbers: siteConfig.author.phone,
      emails: siteConfig.author.email,
    },
    twitter: {
      card: 'summary',
      site: siteConfig.site.twitter_site,
      creator: siteConfig.site.twitter_creator,
      title: page_title,
    },
    formatDetection: {
      telephone: true,
      date: true,
      address: false,
      email: true,
      url: false
    },
    category: 'Cookie Policy',
  }
}

export default function PrivacyPolicy() {
  return (
    <main>
      <div className="container">
        <div className="contact white-box">
          <div className="row">
            <h1>Cookie Policy for Artur Schütz Developer Blog</h1>
            <p>This is the Cookie Policy for Artur Schütz Developer Blog, accessible from https://artur-schuetz.com/</p>
            <p><strong>What Are Cookies</strong></p>
            <p>As is common practice with almost all professional websites this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience. This page describes what information they gather, how we use it and why we sometimes need to store these cookies. We will also share how you can prevent these cookies from being stored however this may downgrade or &apos;break&apos; certain elements of the sites functionality.</p>
            <p><strong>How We Use Cookies</strong></p>
            <p>We use cookies for a variety of reasons detailed below. Unfortunately in most cases there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site. It is recommended that you leave on all cookies if you are not sure whether you need them or not in case they are used to provide a service that you use.</p>
            <p><strong>Disabling Cookies</strong></p>
            <p>You can prevent the setting of cookies by adjusting the settings on your browser (see your browser Help for how to do this). Be aware that disabling cookies will affect the functionality of this and many other websites that you visit. Disabling cookies will usually result in also disabling certain functionality and features of the this site. Therefore it is recommended that you do not disable cookies. This Cookies Policy was created with the help of the <a href="https://www.cookiepolicygenerator.com/cookie-policy-generator/" target="_blank" rel="external nofollow noopener">Cookies Policy Generator</a>.</p>
            <p><strong>The Cookies We Set</strong></p>
            <ul>
              <li>
                <p>Account related cookies</p>
                <p>If you create an account with us then we will use cookies for the management of the signup process and general administration. These cookies will usually be deleted when you log out however in some cases they may remain afterwards to remember your site preferences when logged out.</p>
              </li>
              <li>
                <p>Login related cookies</p>
                <p>We use cookies when you are logged in so that we can remember this fact. This prevents you from having to log in every single time you visit a new page. These cookies are typically removed or cleared when you log out to ensure that you can only access restricted features and areas when logged in.</p>
              </li>
            </ul>
            <p><strong>Third Party Cookies</strong></p>
            <p>In some special cases we also use cookies provided by trusted third parties. The following section details which third party cookies you might encounter through this site.</p>
            <ul>
              <li>
                <p>Several partners advertise on our behalf and affiliate tracking cookies simply allow us to see if our customers have come to the site through one of our partner sites so that we can credit them appropriately and where applicable allow our affiliate partners to provide any bonus that they may provide you for making a purchase.</p>
              </li>
            </ul>
            <p><strong>More Information</strong></p>
            <p>Hopefully that has clarified things for you and as was previously mentioned if there is something that you aren&apos;t sure whether you need or not it&apos;s usually safer to leave cookies enabled in case it does interact with one of the features you use on our site.</p>
            <p>For more general information on cookies, please read <a href="https://www.cookiepolicygenerator.com/sample-cookies-policy/" target="_blank" rel="external nofollow noopener">the Cookies Policy article</a>.</p>
            <p>However if you are still looking for more information then you can contact us through one of our preferred contact methods:</p>
            <ul>
              <li>Email: contact@artur-schuetz.com</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
