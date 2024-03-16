import { getConfig } from "@/config";
import siteConfig from "@/app/siteConfig.json";

export async function generateMetadata() {
  const page_title = 'Impressum';
  const canonical_site_url = '/imprint';

  return {
    title: page_title + ' | ' + siteConfig.site.title,
    keywords: 'project, projects, portfolio, artur, schütz, imprint, impressum',
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
      date: false,
      address: true,
      email: true,
      url: true
    },
    category: 'Impressum',
  }
}

export default function Imprint() {
  return (<main>
        <div className="container">
          <div className="contact white-box">
            <div className="row">
              <div className="impressum">
                <h1>Impressum</h1>
                <p>Angaben gemäß § 5 TMG</p>
                <p>
                  {siteConfig.author.name} <br />
                  Talstraße 58
                  <br />
                  40217 Düsseldorf <br />
                </p>
                <p>
                  {" "}
                  <strong>Vertreten durch: </strong>
                  <br />
                  {siteConfig.author.name}
                  <br />
                </p>
                <p>
                  <strong>Kontakt:</strong> <br />
                  Telefon: <a href={`tel:${siteConfig.author.phone}`}>{siteConfig.author.phone}</a>
                  <br />
                  E-Mail:{" "}
                  <a href={`mailto:${siteConfig.author.email}`}>{siteConfig.author.email}</a>
                  <br />
                </p>
                <p>
                  <strong>
                    Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:
                  </strong>
                  <br />
                  {siteConfig.author.name} <br />
                  Talstraße 58
                  <br />
                  40217 Düsseldorf <br />
                </p>
                <p>
                  <strong>Haftungsausschluss: </strong>
                  <br />
                  <br />
                  <strong>Haftung für Inhalte</strong>
                  <br />
                  <br />
                  Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt.
                  Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte
                  können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter
                  sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen
                  Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8
                  bis 10 TMG sind wir als Diensteanbieter jedoch nicht
                  verpflichtet, übermittelte oder gespeicherte fremde
                  Informationen zu überwachen oder nach Umständen zu forschen, die
                  auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur
                  Entfernung oder Sperrung der Nutzung von Informationen nach den
                  allgemeinen Gesetzen bleiben hiervon unberührt. Eine
                  diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der
                  Kenntnis einer konkreten Rechtsverletzung möglich. Bei
                  Bekanntwerden von entsprechenden Rechtsverletzungen werden wir
                  diese Inhalte umgehend entfernen.
                  <br />
                  <br />
                  <strong>Haftung für Links</strong>
                  <br />
                  <br />
                  Unser Angebot enthält Links zu externen Webseiten Dritter, auf
                  deren Inhalte wir keinen Einfluss haben. Deshalb können wir für
                  diese fremden Inhalte auch keine Gewähr übernehmen. Für die
                  Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
                  oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten
                  wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße
                  überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der
                  Verlinkung nicht erkennbar. Eine permanente inhaltliche
                  Kontrolle der verlinkten Seiten ist jedoch ohne konkrete
                  Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei
                  Bekanntwerden von Rechtsverletzungen werden wir derartige Links
                  umgehend entfernen.
                  <br />
                  <br />
                  <strong>Urheberrecht</strong>
                  <br />
                  <br />
                  Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
                  diesen Seiten unterliegen dem deutschen Urheberrecht. Die
                  Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
                  Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der
                  schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
                  Downloads und Kopien dieser Seite sind nur für den privaten,
                  nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf
                  dieser Seite nicht vom Betreiber erstellt wurden, werden die
                  Urheberrechte Dritter beachtet. Insbesondere werden Inhalte
                  Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine
                  Urheberrechtsverletzung aufmerksam werden, bitten wir um einen
                  entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen
                  werden wir derartige Inhalte umgehend entfernen.
                  <br />
                  <br />
                  <strong>Datenschutz</strong>
                  <br />
                  <br />
                  Die Nutzung unserer Webseite ist in der Regel ohne Angabe
                  personenbezogener Daten möglich. Soweit auf unseren Seiten
                  personenbezogene Daten (beispielsweise Name, Anschrift oder
                  eMail-Adressen) erhoben werden, erfolgt dies, soweit möglich,
                  stets auf freiwilliger Basis. Diese Daten werden ohne Ihre
                  ausdrückliche Zustimmung nicht an Dritte weitergegeben. <br />
                  Wir weisen darauf hin, dass die Datenübertragung im Internet
                  (z.B. bei der Kommunikation per E-Mail) Sicherheitslücken
                  aufweisen kann. Ein lückenloser Schutz der Daten vor dem Zugriff
                  durch Dritte ist nicht möglich. <br />
                  Der Nutzung von im Rahmen der Impressumspflicht veröffentlichten
                  Kontaktdaten durch Dritte zur Übersendung von nicht ausdrücklich
                  angeforderter Werbung und Informationsmaterialien wird hiermit
                  ausdrücklich widersprochen. Die Betreiber der Seiten behalten
                  sich ausdrücklich rechtliche Schritte im Falle der unverlangten
                  Zusendung von Werbeinformationen, etwa durch Spam-Mails, vor.
                  <br />
                  <br />
                  <br />
                  <strong>Google Analytics</strong>
                  <br />
                  <br />
                  Diese Website benutzt Google Analytics, einen Webanalysedienst
                  der Google Inc. (&quot;Google&quot;). Google Analytics verwendet
                  sog. &quot;Cookies&quot;, Textdateien, die auf Ihrem Computer
                  gespeichert werden und die eine Analyse der Benutzung der
                  Website durch Sie ermöglicht. Die durch den Cookie erzeugten
                  Informationen über Ihre Benutzung dieser Website (einschließlich
                  Ihrer IP-Adresse) wird an einen Server von Google in den USA
                  übertragen und dort gespeichert. Google wird diese Informationen
                  benutzen, um Ihre Nutzung der Website auszuwerten, um Reports
                  über die Websiteaktivitäten für die Websitebetreiber
                  zusammenzustellen und um weitere mit der Websitenutzung und der
                  Internetnutzung verbundene Dienstleistungen zu erbringen. Auch
                  wird Google diese Informationen gegebenenfalls an Dritte
                  übertragen, sofern dies gesetzlich vorgeschrieben oder soweit
                  Dritte diese Daten im Auftrag von Google verarbeiten. Google
                  wird in keinem Fall Ihre IP-Adresse mit anderen Daten der Google
                  in Verbindung bringen. Sie können die Installation der Cookies
                  durch eine entsprechende Einstellung Ihrer Browser Software
                  verhindern; wir weisen Sie jedoch darauf hin, dass Sie in diesem
                  Fall gegebenenfalls nicht sämtliche Funktionen dieser Website
                  voll umfänglich nutzen können. Durch die Nutzung dieser Website
                  erklären Sie sich mit der Bearbeitung der über Sie erhobenen
                  Daten durch Google in der zuvor beschriebenen Art und Weise und
                  zu dem zuvor benannten Zweck einverstanden.
                  <br />
                  <br />
                  <strong>Google AdSense</strong>
                  <br />
                  <br />
                  Diese Website benutzt Google Adsense, einen Webanzeigendienst
                  der Google Inc., USA (&quot;Google&quot;). Google Adsense
                  verwendet sog. &quot;Cookies&quot; (Textdateien), die auf Ihrem
                  Computer gespeichert werden und die eine Analyse der Benutzung
                  der Website durch Sie ermöglicht. Google Adsense verwendet auch
                  sog. &quot;Web Beacons&quot; (kleine unsichtbare Grafiken) zur
                  Sammlung von Informationen. Durch die Verwendung des Web Beacons
                  können einfache Aktionen wie der Besucherverkehr auf der
                  Webseite aufgezeichnet und gesammelt werden. Die durch den
                  Cookie und/oder Web Beacon erzeugten Informationen über Ihre
                  Benutzung dieser Website (einschließlich Ihrer IP-Adresse)
                  werden an einen Server von Google in den USA übertragen und dort
                  gespeichert. Google wird diese Informationen benutzen, um Ihre
                  Nutzung der Website im Hinblick auf die Anzeigen auszuwerten, um
                  Reports über die Websiteaktivitäten und Anzeigen für die
                  Websitebetreiber zusammenzustellen und um weitere mit der
                  Websitenutzung und der Internetnutzung verbundene
                  Dienstleistungen zu erbringen. Auch wird Google diese
                  Informationen gegebenenfalls an Dritte übertragen, sofern dies
                  gesetzlich vorgeschrieben oder soweit Dritte diese Daten im
                  Auftrag von Google verarbeiten. Google wird in keinem Fall Ihre
                  IP-Adresse mit anderen Daten der Google in Verbindung bringen.
                  Das Speichern von Cookies auf Ihrer Festplatte und die Anzeige
                  von Web Beacons können Sie verhindern, indem Sie in Ihren
                  Browser-Einstellungen &quot;keine Cookies akzeptieren&quot;
                  wählen (Im MS Internet-Explorer unter &quot;Extras -
                  Internetoptionen - Datenschutz - Einstellung&apos;&apos;; im
                  Firefox unter &quot;Extras - Einstellungen - Datenschutz -
                  Cookies&quot;); wir weisen Sie jedoch darauf hin, dass Sie in
                  diesem Fall gegebenenfalls nicht sämtliche Funktionen dieser
                  Website voll umfänglich nutzen können. Durch die Nutzung dieser
                  Website erklären Sie sich mit der Bearbeitung der über Sie
                  erhobenen Daten durch Google in der zuvor beschriebenen Art und
                  Weise und zu dem zuvor benannten Zweck einverstanden.
                </p>
                <br />
                Website Impressum erstellt durch{" "}
                <a
                  href="https://www.impressum-generator.de"
                  rel="external nofollow noopener"
                >
                  impressum-generator.de
                </a>{" "}
                von der{" "}
                <a
                  href="https://www.kanzlei-hasselbach.de/"
                  rel="external nofollow noopener"
                >
                  Kanzlei Hasselbach
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
  );
}
