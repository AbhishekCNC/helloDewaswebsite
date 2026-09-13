import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./TermsAndConditions.css";

const SECTIONS = [
  { id: "intro", title: "1. Introduction & Overview" },
  { id: "acceptance", title: "2. Acceptance of Terms" },
  { id: "operator", title: "3. About Hello Dewas & Operator Information" },
  { id: "eligibility", title: "4. Eligibility & Legal Capacity" },
  { id: "services-desc", title: "5. Description of Website & Services" },
  { id: "editorial-disclaimer", title: "6. News & Editorial Content Disclaimer" },
  { id: "accuracy-updates", title: "7. Accuracy, Updates & Content Removals" },
  { id: "user-accounts", title: "8. User Accounts & Administrative Access" },
  { id: "enquiries-submissions", title: "9. Inquiries, Communications & News Tips" },
  { id: "acceptable-use", title: "10. Acceptable Use Policy" },
  { id: "prohibited-activities", title: "11. Prohibited Activities" },
  { id: "intellectual-property", title: "12. Intellectual Property Rights (Copyright Act 1957)" },
  { id: "permitted-use", title: "13. Permitted Personal & Non-Commercial Use" },
  { id: "user-licence", title: "14. User Submissions & Limited Licence" },
  { id: "advertisements", title: "15. Advertisements & Sponsored Content" },
  { id: "third-party-links", title: "16. Third-Party Links & External Media" },
  { id: "payment-terms", title: "17. Terms for Future Commercial & Paid Services" },
  { id: "pricing-taxes", title: "18. Pricing, Currency & Applicable Taxes" },
  { id: "payment-architecture", title: "19. Payment Gateway & Third-Party Terms" },
  { id: "payment-failures", title: "20. Payment Failures & Duplicate Transactions" },
  { id: "cancellation-refunds", title: "21. Cancellation & Refund Policy Summary" },
  { id: "service-modifications", title: "22. Service Availability & Modifications" },
  { id: "suspension-termination", title: "23. Suspension & Termination of Access" },
  { id: "disclaimers", title: "24. Disclaimers & 'As-Is' Provision" },
  { id: "limitation-liability", title: "25. Limitation of Liability" },
  { id: "indemnity", title: "26. Balanced Indemnification" },
  { id: "force-majeure", title: "27. Force Majeure" },
  { id: "privacy-policy-link", title: "28. Privacy & Personal Data Protection" },
  { id: "governing-law", title: "29. Governing Law & Jurisdiction" },
  { id: "terms-modifications", title: "30. Modifications to These Terms" },
  { id: "contact-grievance", title: "31. Grievance Redressal & Contact Info" },
];

export default function TermsAndConditions() {
  const [activeSection, setActiveSection] = useState("intro");

  useEffect(() => {
    // Scroll to top on route entry
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    // SEO Meta updates
    const prevTitle = document.title;
    document.title = "Terms and Conditions | Hello Dewas";

    let metaDesc = document.querySelector('meta[name="description"]');
    let createdMeta = false;
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
      createdMeta = true;
    }
    const prevDesc = metaDesc.getAttribute("content") || "";
    metaDesc.setAttribute(
      "content",
      "Official Terms and Conditions for Hello Dewas digital portal, governing website access, news content disclaimers, intellectual property, payment gateway architecture, and user guidelines."
    );

    return () => {
      document.title = prevTitle;
      if (createdMeta && metaDesc) {
        metaDesc.remove();
      } else if (metaDesc) {
        metaDesc.setAttribute("content", prevDesc);
      }
    };
  }, []);

  // Intersection observer to highlight active TOC item
  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = SECTIONS.map((s) =>
        document.getElementById(s.id)
      ).filter(Boolean);

      const scrollPosition = window.scrollY + 100;

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const el = sectionElements[i];
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(el.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      const headerHeight = 70;
      const extraOffset = window.innerWidth <= 575 ? 16 : 24;
      const navOffset = headerHeight + extraOffset;
      const targetPosition =
        target.getBoundingClientRect().top + window.scrollY - navOffset;
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
      setActiveSection(id);
    }
  };

  return (
    <div className="terms-page-wrapper">
      <Navbar />

      <main className="terms-main" id="main-content">
        {/* HERO SECTION */}
        <header className="terms-hero">
          <div className="terms-hero-container">
            <span className="terms-hero-badge">Terms of Use & Legal Governance</span>
            <h1 className="terms-hero-title">Terms and Conditions</h1>
            <p className="terms-hero-subtitle">
              Welcome to Hello Dewas. Please read these Terms and Conditions carefully before using our website, reading news articles, accessing digital e-newspapers, or engaging with our services.
            </p>

            <div className="terms-metadata-pills">
              <div className="terms-meta-pill">
                <i className="bi bi-calendar-check" aria-hidden="true"></i>
                <span><strong>Effective Date:</strong> March 1, 2025</span>
              </div>
              <div className="terms-meta-pill">
                <i className="bi bi-clock-history" aria-hidden="true"></i>
                <span><strong>Last Updated:</strong> March 2025</span>
              </div>
              <div className="terms-meta-pill">
                <i className="bi bi-geo-alt" aria-hidden="true"></i>
                <span><strong>Jurisdiction:</strong> Dewas, Madhya Pradesh, India</span>
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT CONTAINER WITH TOC & ARTICLES */}
        <div className="terms-content-container">
          <div className="terms-layout-grid">
            {/* TABLE OF CONTENTS */}
            <aside
              className="terms-toc-sidebar"
              id="terms-toc-nav"
              aria-label="Table of Contents"
            >
              <div className="terms-toc-card">
                <div className="terms-toc-header">
                  <i className="bi bi-compass" aria-hidden="true"></i>
                  <span>Document Navigation</span>
                </div>
                <nav className="terms-toc-list">
                  <ul>
                    {SECTIONS.map((sec) => (
                      <li key={sec.id}>
                        <a
                          href={`#${sec.id}`}
                          className={`terms-toc-link ${
                            activeSection === sec.id ? "active" : ""
                          }`}
                          onClick={(e) => scrollToSection(e, sec.id)}
                        >
                          {sec.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </aside>

            {/* MAIN ARTICLE BODY */}
            <article className="terms-article-body">
              {/* SECTION 1 */}
              <section id="intro" className="terms-section">
                <div className="terms-section-header">
                  <span className="terms-section-num">01</span>
                  <h2>Introduction & Overview</h2>
                </div>
                <p>
                  These <strong>Terms and Conditions</strong> ("Terms") constitute a legally binding agreement between you ("User", "Visitor", or "Reader") and <strong>Hello Dewas</strong> ("Platform", "We", "Us", or "Our").
                </p>
                <p>
                  Hello Dewas operates a digital news portal, hyperlocal media publication, cultural guide, civic events repository, and digital newspaper platform serving the city of Dewas, Madhya Pradesh, India.
                </p>
                <p>
                  By accessing, browsing, reading, downloading materials from, or otherwise using our platform, you acknowledge that you have read, understood, and agreed to be bound by these Terms. If you do not agree with any part of these Terms, you must discontinue your use of the website.
                </p>
              </section>

              {/* SECTION 2 */}
              <section id="acceptance" className="terms-section">
                <div className="terms-section-header">
                  <span className="terms-section-num">02</span>
                  <h2>Acceptance of Terms</h2>
                </div>
                <p>
                  Your access to and use of Hello Dewas is strictly conditioned upon your acceptance of and compliance with these Terms, as well as our <Link to="/privacy-policy">Privacy Policy & Security</Link>.
                </p>
                <p>
                  These Terms apply to all visitors, casual readers, business directory partners, advertisers, and any persons who interact with Hello Dewas online. By continuing to use the portal, you represent that you possess the legal authority to enter into this agreement.
                </p>
              </section>

              {/* SECTION 3 */}
              <section id="operator" className="terms-section">
                <div className="terms-section-header">
                  <span className="terms-section-num">03</span>
                  <h2>About Hello Dewas & Operator Information</h2>
                </div>
                <p>
                  Hello Dewas is a local digital journalism, news reporting, and community media platform based in Dewas, Madhya Pradesh, India.
                </p>
                <div className="terms-callout-box">
                  <h4>Platform & Contact Overview</h4>
                  <ul className="terms-data-list">
                    <li>
                      <strong>Platform Name:</strong> Hello Dewas
                    </li>
                    <li>
                      <strong>Operating Nexus:</strong> Dewas, Madhya Pradesh, India
                    </li>
                    <li>
                      <strong>Primary Operational Email:</strong>{" "}
                      <a href="mailto:info@hellodewas.com">info@hellodewas.com</a>
                    </li>
                    <li>
                      <strong>Contact Telephones:</strong> +91 7000152525, +91 89627 48593
                    </li>
                    <li>
                      <strong>Operating Hours:</strong> Monday – Friday: 10:00 am – 6:00 pm IST
                    </li>
                  </ul>
                </div>
                <p className="terms-note-text">
                  <em>
                    Notice: Formal corporate registration details (such as Sole Proprietorship / Partnership / LLP / Private Limited status) will be finalized prior to commercial payment launch. For administrative inquiries, please contact our team via the email above.
                  </em>
                </p>
              </section>

              {/* SECTION 4 */}
              <section id="eligibility" className="terms-section">
                <div className="terms-section-header">
                  <span className="terms-section-num">04</span>
                  <h2>Eligibility & Legal Capacity</h2>
                </div>
                <p>
                  By accessing Hello Dewas, you declare that you are at least 18 years of age or possess legal capacity under the <strong>Indian Contract Act, 1872</strong> to enter into a binding legal contract.
                </p>
                <p>
                  If you are accessing this portal on behalf of a company, business, or organizational entity, you represent and warrant that you have full legal authority to bind that entity to these Terms.
                </p>
              </section>

              {/* SECTION 5 */}
              <section id="services-desc" className="terms-section">
                <div className="terms-section-header">
                  <span className="terms-section-num">05</span>
                  <h2>Description of Website & Services</h2>
                </div>
                <p>
                  Hello Dewas provides a variety of digital news, media, and community features, including:
                </p>
                <div className="terms-grid-cards">
                  <div className="terms-grid-card">
                    <i className="bi bi-newspaper" aria-hidden="true"></i>
                    <h4>Hyperlocal News Articles</h4>
                    <p>
                      Real-time reporting on local news, civic issues, city updates, and sports in Dewas.
                    </p>
                  </div>
                  <div className="terms-grid-card">
                    <i className="bi bi-journal-album" aria-hidden="true"></i>
                    <h4>E-Newspaper Archive</h4>
                    <p>
                      Digital PDF editions and thumbnails of print newspapers for online reading and download.
                    </p>
                  </div>
                  <div className="terms-grid-card">
                    <i className="bi bi-calendar-event" aria-hidden="true"></i>
                    <h4>City Events & Listings</h4>
                    <p>
                      Schedules, venues, countdowns, and descriptions of cultural and community events.
                    </p>
                  </div>
                  <div className="terms-grid-card">
                    <i className="bi bi-megaphone" aria-hidden="true"></i>
                    <h4>Banners & Promotion</h4>
                    <p>
                      Direct sponsor banners, business directory guides, and promotional advertisements.
                    </p>
                  </div>
                </div>
              </section>

              {/* SECTION 6 */}
              <section id="editorial-disclaimer" className="terms-section">
                <div className="terms-section-header">
                  <span className="terms-section-num">06</span>
                  <h2>News & Editorial Content Disclaimer</h2>
                </div>
                <p>
                  <strong>Information Purpose Only:</strong> The articles, reports, civic notifications, and city updates published on Hello Dewas are provided for general informational, educational, and news reporting purposes.
                </p>
                <p>
                  <strong>Independent Verification Advised:</strong> While we strive for accuracy in news reporting, civic details, event schedules, and local developments may change rapidly. Users are strongly advised to independently verify critical information (such as government notices, exam dates, or event timings) before making financial, legal, or personal decisions based on portal content.
                </p>
                <p>
                  <strong>No Professional Advice:</strong> News content on Hello Dewas does not constitute formal legal, financial, medical, or official government advice.
                </p>
              </section>

              {/* SECTION 7 */}
              <section id="accuracy-updates" className="terms-section">
                <div className="terms-section-header">
                  <span className="terms-section-num">07</span>
                  <h2>Accuracy, Updates & Content Removals</h2>
                </div>
                <p>
                  Hello Dewas reserves the right, at its sole discretion, to modify, update, correct, revise, archive, or remove published articles, images, event schedules, or digital e-papers at any time without prior notice.
                </p>
                <p>
                  We aim to address factual errors or typos promptly. If you believe a published report contains a factual error or requires editorial correction, you may submit a formal complaint via email to <a href="mailto:info@hellodewas.com">info@hellodewas.com</a>.
                </p>
              </section>

              {/* SECTION 8 */}
              <section id="user-accounts" className="terms-section">
                <div className="terms-section-header">
                  <span className="terms-section-num">08</span>
                  <h2>User Accounts & Administrative Access</h2>
                </div>
                <p>
                  <strong>Public Reading Access:</strong> Hello Dewas does <em>not</em> require public readers to register, create accounts, or manage passwords to read articles, view city guides, or download e-papers.
                </p>
                <p>
                  <strong>Administrative Accounts:</strong> Access to backend content management systems, article creation, and banner administration is strictly restricted to authorized internal editorial staff using encrypted credentials and tokenized session management. Unauthorized attempts to bypass administrative portals are strictly prohibited.
                </p>
              </section>

              {/* SECTION 9 */}
              <section id="enquiries-submissions" className="terms-section">
                <div className="terms-section-header">
                  <span className="terms-section-num">09</span>
                  <h2>Inquiries, Communications & News Tips</h2>
                </div>
                <p>
                  When you submit news tips, press releases, event announcements, or advertising inquiries via email, telephone, or website forms, you agree to provide truthful and accurate information.
                </p>
                <p>
                  You represent that you hold the necessary rights and permissions for any information, text, or images submitted to our editorial desk, and that your communication does not violate third-party privacy or intellectual property rights.
                </p>
              </section>

              {/* SECTION 10 */}
              <section id="acceptable-use" className="terms-section">
                <div className="terms-section-header">
                  <span className="terms-section-num">10</span>
                  <h2>Acceptable Use Policy</h2>
                </div>
                <p>
                  You agree to use Hello Dewas only for lawful purposes and in a manner that respects the rights of others and does not restrict or inhibit anyone else's use and enjoyment of the portal.
                </p>
                <p>
                  You agree to comply with all applicable local, state, national, and international laws, including the <strong>Information Technology Act, 2000</strong> and rules made thereunder.
                </p>
              </section>

              {/* SECTION 11 */}
              <section id="prohibited-activities" className="terms-section">
                <div className="terms-section-header">
                  <span className="terms-section-num">11</span>
                  <h2>Prohibited Activities</h2>
                </div>
                <p>When interacting with Hello Dewas, you must not engage in any of the following:</p>
                <ul className="terms-rights-list">
                  <li>
                    <strong>Scraping & Data Mining:</strong> Using automated scripts, bots, spiders, or scrapers to extract articles, text, e-paper PDFs, or database records without prior written consent.
                  </li>
                  <li>
                    <strong>Security Interference:</strong> Attempting to probe, scan, test vulnerabilities, disable, or bypass server firewalls, authentication systems, or API endpoints.
                  </li>
                  <li>
                    <strong>Malicious Traffic:</strong> Transmitting malware, viruses, Trojan horses, spyware, or launching Denial-of-Service (DDoS) attacks against our servers.
                  </li>
                  <li>
                    <strong>Misrepresentation & Impersonation:</strong> Impersonating Hello Dewas journalists, editors, or administrative officers in public forums or direct communications.
                  </li>
                  <li>
                    <strong>Unlawful Transmission:</strong> Submitting defamatory, obscene, hate-inciting, offensive, or privacy-violating materials to our editorial desk.
                  </li>
                </ul>
              </section>

              {/* SECTION 12 */}
              <section id="intellectual-property" className="terms-section">
                <div className="terms-section-header">
                  <span className="policy-section-num">12</span>
                  <h2>Intellectual Property Rights (Copyright Act, 1957)</h2>
                </div>
                <p>
                  <strong>Hello Dewas Ownership:</strong> All original content on this portal—including written news articles, editorial commentary, photographs, graphic design, logos, brand elements, audio/video clips, and custom software code—is protected under the <strong>Copyright Act, 1957</strong>, trademark laws, and intellectual property rights of India.
                </p>
                <p>
                  <strong>Third-Party Material:</strong> Brand names, corporate logos, official press images, or third-party media appearing in news reports or advertisements remain the intellectual property of their respective owners. Hello Dewas does not claim ownership over third-party material utilized under applicable Indian copyright provisions for news reporting and public interest commentary.
                </p>
              </section>

              {/* SECTION 13 */}
              <section id="permitted-use" className="terms-section">
                <div className="terms-section-header">
                  <span className="terms-section-num">13</span>
                  <h2>Permitted Personal & Non-Commercial Use</h2>
                </div>
                <p>
                  You are granted a limited, revocable, non-exclusive, non-transferable licence to view, read, and share links to our articles and e-newspaper editions solely for personal, educational, and non-commercial purposes.
                </p>
                <p>
                  You may share news article links on social media platforms or quote short excerpts, provided that proper credit and a visible hyperlink to the original Hello Dewas source article are included. You may not republish full articles or commercialize our content without written permission.
                </p>
              </section>

              {/* SECTION 14 */}
              <section id="user-licence" className="terms-section">
                <div className="terms-section-header">
                  <span className="terms-section-num">14</span>
                  <h2>User Submissions & Limited Licence</h2>
                </div>
                <p>
                  When you voluntarily send news tips, press releases, community event photos, or editorial feedback to Hello Dewas, you grant us a worldwide, non-exclusive, royalty-free, perpetual licence to use, edit, publish, translate, and distribute such submissions across our digital news channels.
                </p>
                <p>
                  This licence is granted strictly for publishing and news operational purposes. Hello Dewas does not claim full ownership over your original material; you remain responsible for ensuring you hold appropriate rights to submit the content.
                </p>
              </section>

              {/* SECTION 15 */}
              <section id="advertisements" className="terms-section">
                <div className="terms-section-header">
                  <span className="terms-section-num">15</span>
                  <h2>Advertisements & Sponsored Content</h2>
                </div>
                <p>
                  Hello Dewas displays sponsor banners, business directory promotions, and commercial advertisements. Sponsored content and paid listings are presented for informational and promotional purposes.
                </p>
                <p>
                  Commercial transactions, purchases, or agreements between you and an advertiser appearing on Hello Dewas are solely between you and that third-party business. Hello Dewas is not responsible for the quality, delivery, pricing, or truthfulness of products or services offered by third-party advertisers.
                </p>
              </section>

              {/* SECTION 16 */}
              <section id="third-party-links" className="terms-section">
                <div className="terms-section-header">
                  <span className="terms-section-num">16</span>
                  <h2>Third-Party Links & External Media</h2>
                </div>
                <p>
                  Our platform contains external links to third-party websites and community channels (such as WhatsApp Community, Instagram, Facebook, YouTube, X/Twitter, and Pinterest).
                </p>
                <p>
                  These external links are provided for reader convenience only. Hello Dewas does not endorse, control, or assume liability for the content, privacy policies, or practices of third-party platforms. Accessing external links is at your own risk.
                </p>
              </section>

              {/* SECTION 17 */}
              <section id="payment-terms" className="terms-section">
                <div className="terms-section-header">
                  <span className="terms-section-num">17</span>
                  <h2>Terms for Future Commercial & Paid Services</h2>
                </div>
                <p>
                  To support upcoming commercial initiatives (such as paid business directory listings, featured event promotions, premium digital ads, or sponsored stories), Hello Dewas is architected to support online payment transactions.
                </p>
                <p>
                  When commercial paid services are activated, specific order details, pricing schedules, and service scopes will be provided to the client before payment completion.
                </p>
              </section>

              {/* SECTION 18 */}
              <section id="pricing-taxes" className="terms-section">
                <div className="terms-section-header">
                  <span className="terms-section-num">18</span>
                  <h2>Pricing, Currency & Applicable Taxes</h2>
                </div>
                <p>
                  All commercial service fees and advertising charges on Hello Dewas will be listed in <strong>Indian Rupees (INR)</strong>.
                </p>
                <p>
                  Applicable statutory taxes, including Goods and Services Tax (GST), will be itemized and applied in accordance with Indian tax regulations at the time of transaction billing.
                </p>
              </section>

              {/* SECTION 19 */}
              <section id="payment-architecture" className="terms-section">
                <div className="terms-section-header">
                  <span className="terms-section-num">19</span>
                  <h2>Payment Gateway & Third-Party Terms</h2>
                </div>
                <p>
                  <strong>RBI-Authorized Gateway Integration:</strong> Commercial payments will be processed through Reserve Bank of India (RBI) authorized Payment Aggregators / Gateways (such as Razorpay, Cashfree, PhonePe, or Paytm).
                </p>
                <p>
                  <strong>Zero Credential Storage:</strong> Hello Dewas does <em>not</em> collect, view, or store sensitive credit card numbers, CVVs, net banking passwords, or UPI PINs on its servers. All payments take place directly on the payment gateway's encrypted PCI-DSS compliant interface.
                </p>
                <p>
                  <strong>Gateway Policies Apply:</strong> Transactions are additionally governed by the privacy statements and terms of service of the chosen payment aggregator.
                </p>
              </section>

              {/* SECTION 20 */}
              <section id="payment-failures" className="terms-section">
                <div className="terms-section-header">
                  <span className="terms-section-num">20</span>
                  <h2>Payment Failures & Duplicate Transactions</h2>
                </div>
                <p>
                  If an online transaction fails or experiences a network disruption while your bank account is debited, the payment gateway typically initiates an automatic reconciliation process.
                </p>
                <p>
                  For pending or duplicate transactions, funds are generally refunded back to the original source bank account by the payment gateway or issuing bank within standard banking timelines (typically 5 to 7 business days).
                </p>
              </section>

              {/* SECTION 21 */}
              <section id="cancellation-refunds" className="terms-section">
                <div className="terms-section-header">
                  <span className="terms-section-num">21</span>
                  <h2>Cancellation & Refund Policy Summary</h2>
                </div>
                <p>
                  <strong>Service Cancellation:</strong> Once a digital advertisement banner, sponsored article, or business directory promotion has been published or activated on Hello Dewas, fees are non-refundable, except where required by law or specified in a written commercial contract.
                </p>
                <p>
                  <strong>Dedicated Policy Notice:</strong> Prior to launching paid commercial checkout features, Hello Dewas will publish a dedicated Refund and Cancellation Policy to detail service-specific refund workflows and dispute resolution timelines.
                </p>
              </section>

              {/* SECTION 22 */}
              <section id="service-modifications" className="terms-section">
                <div className="terms-section-header">
                  <span className="terms-section-num">22</span>
                  <h2>Service Availability & Modifications</h2>
                </div>
                <p>
                  While we strive to ensure 24/7 portal availability, Hello Dewas does not guarantee uninterrupted or error-free website access. Routine maintenance, server updates, cloud host disruptions, or unexpected network failures may occasionally disrupt access.
                </p>
                <p>
                  We reserve the right to temporarily suspend, modify, or discontinue any feature, section, or digital service of the portal at any time without liability.
                </p>
              </section>

              {/* SECTION 23 */}
              <section id="suspension-termination" className="terms-section">
                <div className="terms-section-header">
                  <span className="terms-section-num">23</span>
                  <h2>Suspension & Termination of Access</h2>
                </div>
                <p>
                  Hello Dewas reserves the right to terminate, block, or restrict website access to any user or IP address that violates these Terms, engages in cyber attacks, attempts unauthorized scraping, or conducts unlawful activities against our portal.
                </p>
              </section>

              {/* SECTION 24 */}
              <section id="disclaimers" className="terms-section">
                <div className="terms-section-header">
                  <span className="terms-section-num">24</span>
                  <h2>Disclaimers & "As-Is" Provision</h2>
                </div>
                <p>
                  To the maximum extent permitted by applicable Indian law, Hello Dewas, its digital portal, content, articles, e-papers, and services are provided on an <strong>"AS IS"</strong> and <strong>"AS AVAILABLE"</strong> basis without warranties of any kind, whether express or implied.
                </p>
                <p>
                  We disclaim all warranties, including but not limited to implied warranties of merchantability, fitness for a particular purpose, non-infringement, and accuracy of news reporting.
                </p>
              </section>

              {/* SECTION 25 */}
              <section id="limitation-liability" className="terms-section">
                <div className="terms-section-header">
                  <span className="terms-section-num">25</span>
                  <h2>Limitation of Liability</h2>
                </div>
                <p>
                  To the maximum extent permitted under applicable law, Hello Dewas, its editors, operators, journalists, and technical sub-processors shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your access to, use of, or inability to access our news portal.
                </p>
                <p>
                  Nothing in these Terms attempts to exclude or limit liability for gross negligence, fraud, willful misconduct, or liabilities that cannot be lawfully excluded under applicable Indian consumer laws.
                </p>
              </section>

              {/* SECTION 26 */}
              <section id="indemnity" className="terms-section">
                <div className="terms-section-header">
                  <span className="terms-section-num">26</span>
                  <h2>Balanced Indemnification</h2>
                </div>
                <p>
                  You agree to defend, indemnify, and hold harmless Hello Dewas, its operators, editorial team, and service providers from and against any third-party claims, liabilities, losses, or expenses (including reasonable legal fees) arising out of your violation of these Terms or illegal use of the portal.
                </p>
              </section>

              {/* SECTION 27 */}
              <section id="force-majeure" className="terms-section">
                <div className="terms-section-header">
                  <span className="terms-section-num">27</span>
                  <h2>Force Majeure</h2>
                </div>
                <p>
                  Hello Dewas shall not be held liable or responsible for any failure or delay in portal performance resulting from causes beyond our reasonable control, including natural disasters, acts of God, cyber warfare, major internet backbone disruptions, government restrictions, or nationwide power outages.
                </p>
              </section>

              {/* SECTION 28 */}
              <section id="privacy-policy-link" className="terms-section">
                <div className="terms-section-header">
                  <span className="terms-section-num">28</span>
                  <h2>Privacy & Personal Data Protection</h2>
                </div>
                <p>
                  Our collection, storage, and processing of personal data are strictly governed by our dedicated <Link to="/privacy-policy">Privacy Policy & Security</Link> document, which complies with the Digital Personal Data Protection Act, 2023.
                </p>
                <p>
                  By accepting these Terms, you also acknowledge that you have reviewed and understood our Privacy Policy & Security practices.
                </p>
              </section>

              {/* SECTION 29 */}
              <section id="governing-law" className="terms-section">
                <div className="terms-section-header">
                  <span className="terms-section-num">29</span>
                  <h2>Governing Law & Jurisdiction</h2>
                </div>
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of the <strong>Republic of India</strong>, without regard to conflict of law principles.
                </p>
                <p>
                  Subject to applicable statutory requirements, any disputes, claims, or legal proceedings arising out of or relating to these Terms or your use of Hello Dewas shall be submitted to the competent courts located in Madhya Pradesh, India.
                </p>
              </section>

              {/* SECTION 30 */}
              <section id="terms-modifications" className="terms-section">
                <div className="terms-section-header">
                  <span className="terms-section-num">30</span>
                  <h2>Modifications to These Terms</h2>
                </div>
                <p>
                  We reserve the right to revise or update these Terms at any time to reflect legal, regulatory, or technical changes. Updated Terms will be posted on this page with a revised <strong>"Last Updated"</strong> date.
                </p>
                <p>
                  Your continued use of Hello Dewas following the posting of updated Terms constitutes your binding acceptance of the changes.
                </p>
              </section>

              {/* SECTION 31 */}
              <section id="contact-grievance" className="terms-section">
                <div className="terms-section-header">
                  <span className="terms-section-num">31</span>
                  <h2>Grievance Redressal & Contact Information</h2>
                </div>
                <p>
                  In compliance with the <strong>Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021</strong>, Hello Dewas has designated a Grievance Redressal Officer:
                </p>

                <div className="terms-callout-box">
                  <h4>Grievance Officer Contact Details</h4>
                  <ul className="terms-data-list">
                    <li>
                      <strong>Designated Role:</strong> Grievance Redressal Officer
                    </li>
                    <li>
                      <strong>Platform:</strong> Hello Dewas
                    </li>
                    <li>
                      <strong>Official Email:</strong>{" "}
                      <a href="mailto:info@hellodewas.com?subject=Attn:%20Grievance%20Officer">
                        info@hellodewas.com
                      </a>{" "}
                      <em>(Subject: Attn: Grievance Officer - Terms)</em>
                    </li>
                    <li>
                      <strong>Helpline Phone:</strong> +91 7000152525 / +91 89627 48593
                    </li>
                    <li>
                      <strong>Working Hours:</strong> Monday – Friday: 10:00 am – 6:00 pm IST
                    </li>
                    <li>
                      <strong>Location:</strong> Dewas, Madhya Pradesh, India
                    </li>
                  </ul>
                </div>

                <div className="terms-legal-disclaimer">
                  <p>
                    <strong>Notice:</strong> These Terms and Conditions have been implemented to reflect verified portal features and Indian statutory frameworks. Final administrative review by the business owner is recommended prior to commercial payment launch.
                  </p>
                </div>
              </section>
            </article>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
