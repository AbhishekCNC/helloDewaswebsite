import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./PrivacyPolicy.css";

const SECTIONS = [
  { id: "intro", title: "1. Introduction & Scope" },
  { id: "operator", title: "2. Who Operates Hello Dewas" },
  { id: "data-collection", title: "3. Personal Data We Collect" },
  { id: "data-usage", title: "4. How We Use Personal Data" },
  { id: "legal-grounds", title: "5. Consent & Grounds for Processing" },
  { id: "cookies-tech", title: "6. Cookies & Tracking Technologies" },
  { id: "editorial-links", title: "7. News Content & External Links" },
  { id: "data-sharing", title: "8. How Personal Data is Shared" },
  { id: "subprocessors", title: "9. Third-Party Service Providers" },
  { id: "payments", title: "10. Payment Processing Architecture" },
  { id: "data-retention", title: "11. Data Retention & Storage Lifecycle" },
  { id: "data-security", title: "12. Data Security Safeguards" },
  { id: "incident-handling", title: "13. Limitations & Incident Handling" },
  { id: "user-rights", title: "14. User Privacy Rights (DPDP Act)" },
  { id: "requests-process", title: "15. Correction, Erasure & Request Process" },
  { id: "grievance", title: "16. Grievance Redressal Mechanism" },
  { id: "children", title: "17. Children's Privacy" },
  { id: "cross-border", title: "18. Cross-Border Data Processing" },
  { id: "policy-changes", title: "19. Changes to This Policy" },
  { id: "contact", title: "20. Contact Information" },
];

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState("intro");

  useEffect(() => {
    // Scroll to top on route entry
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    // SEO Meta updates
    const prevTitle = document.title;
    document.title = "Privacy Policy & Security | Hello Dewas";

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
      "Official Privacy Policy & Security practices for Hello Dewas web portal, detailing personal data collection, DPDP Act 2023 compliance, payment architecture, and security safeguards."
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

      const scrollPosition = window.scrollY + 140;

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
    <div className="policy-page-wrapper">
      <Navbar />

      <main className="policy-main" id="main-content">
        {/* HERO SECTION */}
        <header className="policy-hero">
          <div className="policy-hero-container">
            <span className="policy-hero-badge">Legal & Security Governance</span>
            <h1 className="policy-hero-title">Privacy Policy & Security</h1>
            <p className="policy-hero-subtitle">
              Learn how Hello Dewas collects, safeguards, processes, and respects
              your personal data in compliance with the Digital Personal Data
              Protection Act, 2023 and Indian data security regulations.
            </p>

            <div className="policy-metadata-pills">
              <div className="policy-meta-pill">
                <i className="bi bi-calendar-check" aria-hidden="true"></i>
                <span><strong>Effective Date:</strong> March 1, 2025</span>
              </div>
              <div className="policy-meta-pill">
                <i className="bi bi-clock-history" aria-hidden="true"></i>
                <span><strong>Last Updated:</strong> March 2025</span>
              </div>
              <div className="policy-meta-pill">
                <i className="bi bi-geo-alt" aria-hidden="true"></i>
                <span><strong>Jurisdiction:</strong> Dewas, Madhya Pradesh, India</span>
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT CONTAINER WITH TOC & ARTICLES */}
        <div className="policy-content-container">
          <div className="policy-layout-grid">
            {/* TABLE OF CONTENTS */}
            <aside
              className="policy-toc-sidebar"
              id="policy-toc-nav"
              aria-label="Table of Contents"
            >
              <div className="policy-toc-card">
                <div className="policy-toc-header">
                  <i className="bi bi-compass" aria-hidden="true"></i>
                  <span>Document Navigation</span>
                </div>
                <nav className="policy-toc-list">
                  <ul>
                    {SECTIONS.map((sec) => (
                      <li key={sec.id}>
                        <a
                          href={`#${sec.id}`}
                          className={`policy-toc-link ${
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
            <article className="policy-article-body">
              {/* SECTION 1 */}
              <section id="intro" className="policy-section">
                <div className="policy-section-header">
                  <span className="policy-section-num">01</span>
                  <h2>Introduction & Scope</h2>
                </div>
                <p>
                  Welcome to <strong>Hello Dewas</strong>. Hello Dewas is a digital news,
                  hyperlocal journalism, cultural exploration, civic events, and digital
                  media publication serving the residents, visitors, businesses, and
                  communities of Dewas, Madhya Pradesh, India.
                </p>
                <p>
                  We are committed to maintaining the trust of our readers by being
                  fully transparent about our data handling practices. This combined{" "}
                  <strong>Privacy Policy & Security</strong> document sets out how we
                  collect, handle, store, protect, and process personal data when you visit
                  our website, read our articles, access digital newspaper editions, or
                  interact with our digital media services.
                </p>
                <p>
                  This policy applies to all visitors, readers, contributors, advertisers,
                  and business partners who access or interact with Hello Dewas online.
                  By accessing our platform, you acknowledge that you have read and
                  understood the data practices outlined in this policy.
                </p>
              </section>

              {/* SECTION 2 */}
              <section id="operator" className="policy-section">
                <div className="policy-section-header">
                  <span className="policy-section-num">02</span>
                  <h2>Who Operates Hello Dewas</h2>
                </div>
                <p>
                  Under India’s <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>,
                  the entity determining the purpose and means of processing personal data is
                  designated as the <strong>Data Fiduciary</strong>.
                </p>
                <div className="policy-callout-box">
                  <h4>Data Fiduciary Information</h4>
                  <ul className="policy-data-list">
                    <li>
                      <strong>Operating Name:</strong> Hello Dewas
                    </li>
                    <li>
                      <strong>Entity Classification:</strong> Digital News & City Media Platform (Individual / Proprietorship / Registered Media Entity operating in Dewas, MP)
                    </li>
                    <li>
                      <strong>Location of Operations:</strong> Dewas, Madhya Pradesh, India
                    </li>
                    <li>
                      <strong>Official Communication Email:</strong>{" "}
                      <a href="mailto:info@hellodewas.com">info@hellodewas.com</a>
                    </li>
                    <li>
                      <strong>Contact Telephones:</strong> +91 7000152525, +91 89627 48593
                    </li>
                  </ul>
                </div>
                <p className="policy-note-text">
                  <em>
                    Note: If you have questions regarding the legal operator entity or wish
                    to inspect formal company documentation, you may contact our administrative
                    team directly at the email provided above.
                  </em>
                </p>
              </section>

              {/* SECTION 3 */}
              <section id="data-collection" className="policy-section">
                <div className="policy-section-header">
                  <span className="policy-section-num">03</span>
                  <h2>Personal Data We Collect</h2>
                </div>
                <p>
                  We believe in minimal data collection. We only collect personal data
                  that is strictly necessary to deliver informative news, provide customer
                  support, and maintain portal stability.
                </p>

                <h3>A. Information Supplied Directly by Users</h3>
                <ul>
                  <li>
                    <strong>Inquiries & Contact Communications:</strong> When you contact us via
                    email, telephone, or direct messaging regarding advertising, news submissions,
                    or general inquiries, we collect your name, email address, phone number, and
                    the content of your correspondence.
                  </li>
                  <li>
                    <strong>Editorial Submissions & Feedback:</strong> Information provided when
                    sharing community news tips, event details, or editorial corrections.
                  </li>
                </ul>

                <h3>B. Account & Reader Registration</h3>
                <ul>
                  <li>
                    <strong>Public Readers:</strong> Hello Dewas does <em>not</em> require public
                    readers to register, create accounts, or provide personal credentials to read
                    news, view city highlights, or download digital newspaper PDFs.
                  </li>
                  <li>
                    <strong>Administrative Staff:</strong> Internal editorial and administrative
                    users log in using administrative accounts managed with hashed passwords and
                    cryptographic authentication tokens.
                  </li>
                </ul>

                <h3>C. Newsletter & Email Subscriptions</h3>
                <ul>
                  <li>
                    When you enter your email in our newsletter subscription form, your email
                    address is received strictly for the purpose of sending city news bulletins,
                    monthly digests, and editorial updates.
                  </li>
                </ul>

                <h3>D. Automatically Collected Technical Information</h3>
                <ul>
                  <li>
                    <strong>Server Logs & Technical Telemetry:</strong> When you navigate our
                    website, our hosting infrastructure and Content Delivery Network (CDN) may
                    automatically log non-identifying technical metadata, such as IP addresses,
                    browser type, operating system version, referring URLs, date/time stamps,
                    and device screen resolutions. This data is utilized solely for DDoS
                    mitigation, error diagnostics, and server load balancing.
                  </li>
                  <li>
                    <strong>Aggregated View Counters:</strong> When you read an article, a numerical
                    view counter (<code>view_count</code>) is incremented on our database. This
                    metric is aggregated in numerical format and is not linked to individual user
                    profiles, browser fingerprints, or identifiable identities.
                  </li>
                </ul>

                <h3>E. Cookies & Browser Storage</h3>
                <ul>
                  <li>
                    Our public website does not use third-party tracking cookies or behavioral
                    profiling mechanisms. Internal session storage is used strictly for technical
                    caching and rendering performance.
                  </li>
                </ul>

                <h3>F. Payment & Transaction Information</h3>
                <ul>
                  <li>
                    Hello Dewas does not currently store or process credit cards, debit cards, or
                    UPI PINs. Detailed payment gateway architecture for upcoming features is
                    outlined in Section 10.
                  </li>
                </ul>
              </section>

              {/* SECTION 4 */}
              <section id="data-usage" className="policy-section">
                <div className="policy-section-header">
                  <span className="policy-section-num">04</span>
                  <h2>How We Use Personal Data</h2>
                </div>
                <p>
                  We utilize collected personal and technical information strictly for legitimate
                  and stated purposes:
                </p>
                <div className="policy-grid-cards">
                  <div className="policy-grid-card">
                    <i className="bi bi-newspaper" aria-hidden="true"></i>
                    <h4>Content Delivery</h4>
                    <p>
                      Serving real-time local news, cultural stories, community events, and digital
                      newspaper editions seamlessly across devices.
                    </p>
                  </div>
                  <div className="policy-grid-card">
                    <i className="bi bi-chat-left-text" aria-hidden="true"></i>
                    <h4>Communication</h4>
                    <p>
                      Responding to reader inquiries, business advertising inquiries, editorial
                      submissions, and grievance redressal tickets.
                    </p>
                  </div>
                  <div className="policy-grid-card">
                    <i className="bi bi-shield-check" aria-hidden="true"></i>
                    <h4>Security & Defense</h4>
                    <p>
                      Monitoring system health, preventing cyber attacks, mitigating malicious
                      traffic, and maintaining server availability.
                    </p>
                  </div>
                  <div className="policy-grid-card">
                    <i className="bi bi-file-earmark-check" aria-hidden="true"></i>
                    <h4>Compliance</h4>
                    <p>
                      Fulfilling statutory record-keeping, tax accounting obligations, and legal
                      requirements under Indian law.
                    </p>
                  </div>
                </div>
              </section>

              {/* SECTION 5 */}
              <section id="legal-grounds" className="policy-section">
                <div className="policy-section-header">
                  <span className="policy-section-num">05</span>
                  <h2>Consent & Grounds for Processing (DPDP Act, 2023)</h2>
                </div>
                <p>
                  Under the <strong>Digital Personal Data Protection Act, 2023</strong>, processing
                  of personal data by Hello Dewas is grounded on the following lawful bases:
                </p>
                <ul>
                  <li>
                    <strong>Explicit Consent:</strong> Where you have affirmatively provided your
                    contact details, subscribed to our communications, or requested services from
                    us. You retain the right to withdraw your consent at any time without affecting
                    the lawfulness of processing based on consent prior to withdrawal.
                  </li>
                  <li>
                    <strong>Certain Legitimate Uses:</strong> Processing necessary for voluntary
                    provision of services requested by you, ensuring network and information
                    security, preventing cyber fraud, and responding to statutory legal inquiries.
                  </li>
                  <li>
                    <strong>Legal Compliance:</strong> Where processing or record retention is
                    obligatory under Indian law, court mandates, or regulatory directives.
                  </li>
                </ul>
              </section>

              {/* SECTION 6 */}
              <section id="cookies-tech" className="policy-section">
                <div className="policy-section-header">
                  <span className="policy-section-num">06</span>
                  <h2>Cookies, Analytics & Advertising Technologies</h2>
                </div>
                <p>
                  We prioritize user privacy and a clean reading environment:
                </p>
                <ul>
                  <li>
                    <strong>No Third-Party Tracking Pixels:</strong> We do not deploy invasive
                    third-party cross-site trackers, Facebook Pixels, or behavioural data broker
                    scripts across our public news portal.
                  </li>
                  <li>
                    <strong>First-Party Direct Banners:</strong> Sponsor banners and community
                    promotions displayed on our platform are hosted directly from our media
                    servers. They do not track your browsing across other external websites.
                  </li>
                  <li>
                    <strong>Local Browser Cache:</strong> Standard browser caching is utilized to
                    store static assets (such as CSS stylesheets, font icons, and image thumbnails)
                    locally on your device to accelerate page load speeds.
                  </li>
                </ul>
              </section>

              {/* SECTION 7 */}
              <section id="editorial-links" className="policy-section">
                <div className="policy-section-header">
                  <span className="policy-section-num">07</span>
                  <h2>News Content, External Links & Embedded Media</h2>
                </div>
                <p>
                  <strong>Journalistic Freedom & Public Interest:</strong> Hello Dewas reports on
                  public civic matters, governmental announcements, cultural happenings, and local
                  events in Dewas. Journalistic publication of public interest information is
                  undertaken in accordance with journalistic standards and applicable Indian media
                  ethics regulations.
                </p>
                <p>
                  <strong>Third-Party Links:</strong> Our website contains links to external
                  platforms, including our official WhatsApp community channel, Instagram,
                  Facebook, YouTube, X (Twitter), and Pinterest. When you click an external link,
                  you navigate away from Hello Dewas. We encourage you to review the privacy
                  statements of each external platform you visit, as we exercise no control over
                  external data policies.
                </p>
              </section>

              {/* SECTION 8 */}
              <section id="data-sharing" className="policy-section">
                <div className="policy-section-header">
                  <span className="policy-section-num">08</span>
                  <h2>How Personal Data is Shared</h2>
                </div>
                <p>
                  <strong>We do not sell, trade, rent, or commercialize your personal information
                  to any third party.</strong>
                </p>
                <p>We share personal data solely under the following limited circumstances:</p>
                <ul>
                  <li>
                    <strong>Infrastructure Service Providers:</strong> With vetted cloud hosting,
                    database, and media distribution providers bound by contractual data
                    protection covenants (see Section 9).
                  </li>
                  <li>
                    <strong>Legal & Law Enforcement Mandates:</strong> Where disclosure is required
                    by applicable law, valid court subpoenas, judicial orders, or formal directives
                    from statutory law enforcement agencies in India.
                  </li>
                  <li>
                    <strong>Protection of Rights:</strong> Where necessary to investigate suspected
                    cyber attacks, enforce terms of service, or protect the safety and rights of
                    our users and the public.
                  </li>
                </ul>
              </section>

              {/* SECTION 9 */}
              <section id="subprocessors" className="policy-section">
                <div className="policy-section-header">
                  <span className="policy-section-num">09</span>
                  <h2>Third-Party Service Providers & Sub-Processors</h2>
                </div>
                <p>
                  To deliver a robust, fast, and secure web application, Hello Dewas collaborates
                  with industry-standard technology sub-processors:
                </p>
                <div className="policy-table-responsive">
                  <table className="policy-table">
                    <thead>
                      <tr>
                        <th>Provider</th>
                        <th>Role in Architecture</th>
                        <th>Data Processed</th>
                        <th>Security / Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Cloudinary Inc.</strong></td>
                        <td>Cloud media & PDF asset hosting</td>
                        <td>Image uploads, newspaper PDF files</td>
                        <td>Encrypted cloud storage over HTTPS</td>
                      </tr>
                      <tr>
                        <td><strong>MongoDB Atlas</strong></td>
                        <td>Cloud Database Management</td>
                        <td>Article records, events, view counts, admin credentials</td>
                        <td>Encrypted at rest (AES-256) & in transit (TLS)</td>
                      </tr>
                      <tr>
                        <td><strong>Render Services Inc.</strong></td>
                        <td>Backend REST API Server</td>
                        <td>API queries, authentication tokens, server logs</td>
                        <td>Isolated cloud container environment over TLS</td>
                      </tr>
                      <tr>
                        <td><strong>Netlify Inc.</strong></td>
                        <td>Frontend Web Hosting & CDN</td>
                        <td>Static web assets, browser requests, CDN caching</td>
                        <td>Global edge CDN with automated SSL/TLS</td>
                      </tr>
                      <tr>
                        <td><strong>jsDelivr CDN</strong></td>
                        <td>Font & icon stylesheet delivery</td>
                        <td>Browser stylesheet requests (Bootstrap Icons)</td>
                        <td>Public CDN asset delivery</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* SECTION 10 */}
              <section id="payments" className="policy-section">
                <div className="policy-section-header">
                  <span className="policy-section-num">10</span>
                  <h2>Payment Processing Architecture & Future Integrations</h2>
                </div>
                <p>
                  To support upcoming digital services (such as premium event ticketing, verified
                  business directory promotions, and sponsored advertisements), Hello Dewas is
                  architected to integrate with Reserve Bank of India (RBI) authorized Payment
                  Aggregators / Gateways (such as Razorpay, Cashfree, PhonePe, or Paytm).
                </p>
                <div className="policy-highlight-card">
                  <h4>Key Payment Security Commitments</h4>
                  <ul>
                    <li>
                      <strong>Zero Storage of Card / Banking Credentials:</strong> Hello Dewas will{" "}
                      <strong>never</strong> collect, capture, view, or store sensitive card numbers,
                      CVVs, card expiry dates, net banking passwords, or UPI MPINs on our servers or
                      databases.
                    </li>
                    <li>
                      <strong>Direct Gateway Handshake:</strong> All sensitive payment processing
                      takes place directly between your web browser and the RBI-licensed payment
                      gateway over encrypted TLS channels compliant with PCI-DSS standards.
                    </li>
                    <li>
                      <strong>Non-Sensitive Metadata Retained:</strong> Hello Dewas only receives and
                      records non-sensitive transaction confirmation metadata, including:
                      <ul>
                        <li>Gateway Transaction ID and Order ID</li>
                        <li>Payment Status (e.g., Success, Pending, Failed)</li>
                        <li>Transaction Amount, Currency, and Timestamp</li>
                        <li>Payment Mode Category (e.g., UPI, Card, Net Banking)</li>
                        <li>Billing contact name, email, or telephone for invoice delivery</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Statutory Accounting:</strong> Transaction metadata is retained
                      strictly for accounting, tax audits, invoice generation, and customer dispute
                      resolution.
                    </li>
                  </ul>
                </div>
              </section>

              {/* SECTION 11 */}
              <section id="data-retention" className="policy-section">
                <div className="policy-section-header">
                  <span className="policy-section-num">11</span>
                  <h2>Data Retention & Storage Lifecycle</h2>
                </div>
                <p>
                  We retain personal data only for as long as required to fulfill the purposes
                  for which it was gathered, or as mandated by applicable Indian laws:
                </p>
                <ul>
                  <li>
                    <strong>Contact Communications & Inquiries:</strong> Retained for the duration
                    necessary to address your inquiry, plus a reasonable period (standard up to 180
                    days) for quality assurance and reference.
                  </li>
                  <li>
                    <strong>Newsletter Subscriptions:</strong> Retained until you request
                    unsubscribing or withdraw your consent.
                  </li>
                  <li>
                    <strong>Financial & Transaction Records:</strong> When payment features are
                    activated, invoicing and transaction metadata will be retained for statutory
                    periods required under Indian tax, GST, and corporate accounting laws
                    (typically 7 to 8 financial years).
                  </li>
                  <li>
                    <strong>System & Security Logs:</strong> Server telemetry logs are retained
                    temporarily for cybersecurity monitoring, after which they are periodically
                    rotated and purged.
                  </li>
                </ul>
              </section>

              {/* SECTION 12 */}
              <section id="data-security" className="policy-section">
                <div className="policy-section-header">
                  <span className="policy-section-num">12</span>
                  <h2>Data Security Safeguards</h2>
                </div>
                <p>
                  We employ reasonable administrative, technical, and organizational safeguards
                  appropriate to the sensitivity of the information we handle:
                </p>
                <div className="policy-security-grid">
                  <div className="policy-sec-item">
                    <div className="policy-sec-icon">
                      <i className="bi bi-lock-fill" aria-hidden="true"></i>
                    </div>
                    <div>
                      <h5>Encryption in Transit</h5>
                      <p>
                        All communication between your device and Hello Dewas servers is enforced
                        via Hypertext Transfer Protocol Secure (HTTPS) using Transport Layer
                        Security (TLS 1.2+).
                      </p>
                    </div>
                  </div>
                  <div className="policy-sec-item">
                    <div className="policy-sec-icon">
                      <i className="bi bi-key-fill" aria-hidden="true"></i>
                    </div>
                    <div>
                      <h5>Cryptographic Credential Hashing</h5>
                      <p>
                        Administrative credentials are protected using industry-standard bcrypt
                        one-way salt hashing. Passwords are never stored in plaintext.
                      </p>
                    </div>
                  </div>
                  <div className="policy-sec-item">
                    <div className="policy-sec-icon">
                      <i className="bi bi-person-badge" aria-hidden="true"></i>
                    </div>
                    <div>
                      <h5>Tokenized Admin Access</h5>
                      <p>
                        Access to backend editorial functions is restricted through signed JSON Web
                        Tokens (JWT) with defined expiration lifecycles.
                      </p>
                    </div>
                  </div>
                  <div className="policy-sec-item">
                    <div className="policy-sec-icon">
                      <i className="bi bi-shield-shaded" aria-hidden="true"></i>
                    </div>
                    <div>
                      <h5>Environment Secret Isolation</h5>
                      <p>
                        Database connection strings, cryptographic secrets, and cloud API keys are
                        strictly isolated on protected server environments and never exposed to the
                        client application.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 13 */}
              <section id="incident-handling" className="policy-section">
                <div className="policy-section-header">
                  <span className="policy-section-num">13</span>
                  <h2>Limitations & Security Incident Handling</h2>
                </div>
                <p>
                  While we implement reasonable technical and organizational safeguards, no method
                  of transmission over the Internet or electronic storage can guarantee absolute
                  invulnerability. We continuously monitor and review our security posture to
                  mitigate potential risks.
                </p>
                <p>
                  In the unexpected event of a verified data security breach impacting personal
                  data, Hello Dewas will promptly initiate incident response procedures to contain
                  and mitigate the issue. Where required under the Digital Personal Data Protection
                  Act, 2023 and Indian Computer Emergency Response Team (CERT-In) guidelines, we will
                  notify affected Data Principals and the Data Protection Board of India without
                  undue delay.
                </p>
              </section>

              {/* SECTION 14 */}
              <section id="user-rights" className="policy-section">
                <div className="policy-section-header">
                  <span className="policy-section-num">14</span>
                  <h2>User Privacy Rights under Indian Law</h2>
                </div>
                <p>
                  Under the <strong>Digital Personal Data Protection Act, 2023</strong>, Data
                  Principals in India are entitled to specific statutory rights:
                </p>
                <ul className="policy-rights-list">
                  <li>
                    <strong>Right to Access Information:</strong> You may request a summary of the
                    personal data being processed about you and the identities of third-party
                    sub-processors with whom it has been shared.
                  </li>
                  <li>
                    <strong>Right to Correction & Updating:</strong> You have the right to request the
                    correction of inaccurate, misleading, or outdated personal data.
                  </li>
                  <li>
                    <strong>Right to Erasure / Deletion:</strong> You have the right to request the
                    deletion of your personal data when it is no longer required for the purpose for
                    which it was collected, unless retention is mandated by law.
                  </li>
                  <li>
                    <strong>Right of Grievance Redressal:</strong> You have the right to readily
                    accessible grievance redressal provided by Hello Dewas.
                  </li>
                  <li>
                    <strong>Right to Nominate:</strong> You have the right to nominate an individual
                    who shall, in the event of death or incapacity, exercise your data protection
                    rights.
                  </li>
                </ul>
              </section>

              {/* SECTION 15 */}
              <section id="requests-process" className="policy-section">
                <div className="policy-section-header">
                  <span className="policy-section-num">15</span>
                  <h2>Correction, Erasure & Request Process</h2>
                </div>
                <p>
                  To exercise any of your privacy rights, request data correction, or withdraw prior
                  consent, please follow this straightforward procedure:
                </p>
                <ol className="policy-steps-list">
                  <li>
                    <strong>Submit an Email Request:</strong> Send an email to{" "}
                    <a href="mailto:info@hellodewas.com">info@hellodewas.com</a> with the subject
                    line: <code>[Data Privacy Request] - Your Name</code>.
                  </li>
                  <li>
                    <strong>Specify Your Request:</strong> Clearly describe whether you are
                    requesting access, correction, deletion, or withdrawal of consent.
                  </li>
                  <li>
                    <strong>Identity Verification:</strong> To safeguard your privacy, we may take
                    reasonable steps to verify your identity before disclosing or altering personal
                    records.
                  </li>
                  <li>
                    <strong>Timely Resolution:</strong> We acknowledge requests within 48 to 72
                    hours and endeavor to complete all valid requests within the statutory timeline
                    (within 30 days of verification).
                  </li>
                </ol>
              </section>

              {/* SECTION 16 */}
              <section id="grievance" className="policy-section">
                <div className="policy-section-header">
                  <span className="policy-section-num">16</span>
                  <h2>Grievance Redressal Mechanism & Officer</h2>
                </div>
                <p>
                  In accordance with the <strong>Information Technology Act, 2000</strong>, the{" "}
                  <strong>IT (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021</strong>,
                  and the <strong>Digital Personal Data Protection Act, 2023</strong>, Hello Dewas
                  provides a dedicated grievance redressal channel:
                </p>

                <div className="policy-callout-box">
                  <h4>Grievance Redressal Contact</h4>
                  <ul className="policy-data-list">
                    <li>
                      <strong>Designated Role:</strong> Grievance Redressal Officer
                    </li>
                    <li>
                      <strong>Organization:</strong> Hello Dewas
                    </li>
                    <li>
                      <strong>Email Address:</strong>{" "}
                      <a href="mailto:info@hellodewas.com?subject=Attn:%20Grievance%20Officer">
                        info@hellodewas.com
                      </a>{" "}
                      <em>(Subject: Attn: Grievance Officer - Privacy)</em>
                    </li>
                    <li>
                      <strong>Helpline Telephones:</strong> +91 7000152525 / +91 89627 48593
                    </li>
                    <li>
                      <strong>Working Hours:</strong> Monday – Friday: 10:00 am – 6:00 pm IST
                    </li>
                    <li>
                      <strong>Postal Jurisdiction:</strong> Dewas, Madhya Pradesh, India
                    </li>
                  </ul>
                </div>
                <p>
                  Grievances are acknowledged within 24–48 hours of receipt and addressed
                  expeditiously within the statutory timeframe (typically within 15 to 30 days).
                </p>
              </section>

              {/* SECTION 17 */}
              <section id="children" className="policy-section">
                <div className="policy-section-header">
                  <span className="policy-section-num">17</span>
                  <h2>Children’s Privacy</h2>
                </div>
                <p>
                  Hello Dewas provides general-audience local news, civic information, and cultural
                  stories. We do not knowingly collect, track, or solicit personal data from children
                  under the age of 18 without verifiable parental or guardian consent where required
                  under the DPDP Act, 2023.
                </p>
                <p>
                  We do not engage in behavioral tracking or targeted advertising directed at
                  minors. If a parent or guardian discovers that a child has provided us with
                  personal information without consent, please contact us immediately at{" "}
                  <a href="mailto:info@hellodewas.com">info@hellodewas.com</a>, and we will take
                  immediate steps to delete such data.
                </p>
              </section>

              {/* SECTION 18 */}
              <section id="cross-border" className="policy-section">
                <div className="policy-section-header">
                  <span className="policy-section-num">18</span>
                  <h2>Cross-Border Data Processing</h2>
                </div>
                <p>
                  Hello Dewas is operated from Dewas, Madhya Pradesh, India. While our primary
                  editorial and operational activities reside in India, certain technical cloud
                  sub-processors (such as global CDN edge nodes and cloud database servers operated
                  by Cloudinary, Netlify, Render, and MongoDB) may process data in distributed global
                  cloud regions to ensure low-latency media delivery and high service resilience.
                </p>
                <p>
                  Any cross-border processing is conducted in strict compliance with the provisions
                  of the DPDP Act, 2023 and applicable Central Government rules governing
                  international data transfers.
                </p>
              </section>

              {/* SECTION 19 */}
              <section id="policy-changes" className="policy-section">
                <div className="policy-section-header">
                  <span className="policy-section-num">19</span>
                  <h2>Changes to This Policy</h2>
                </div>
                <p>
                  We may periodically revise this Privacy Policy & Security document to reflect
                  updates in our technology stack, statutory legal frameworks (such as upcoming
                  DPDP Rules enforcement phases), or operational enhancements (such as the activation
                  of new payment gateways).
                </p>
                <p>
                  When changes are made, the revised policy will be posted on this page with an
                  updated <strong>"Last Updated"</strong> date. Material revisions will be
                  accompanied by a visible notice on our portal. We encourage you to review this
                  page periodically to stay informed about our privacy and security standards.
                </p>
              </section>

              {/* SECTION 20 */}
              <section id="contact" className="policy-section">
                <div className="policy-section-header">
                  <span className="policy-section-num">20</span>
                  <h2>Contact Information</h2>
                </div>
                <p>
                  If you have questions, feedback, or inquiries regarding this Privacy Policy &
                  Security statement, please reach out to our team:
                </p>

                <div className="policy-contact-card">
                  <div className="policy-contact-row">
                    <i className="bi bi-building" aria-hidden="true"></i>
                    <div>
                      <strong>Platform:</strong> Hello Dewas
                    </div>
                  </div>
                  <div className="policy-contact-row">
                    <i className="bi bi-envelope" aria-hidden="true"></i>
                    <div>
                      <strong>Email:</strong>{" "}
                      <a href="mailto:info@hellodewas.com">info@hellodewas.com</a>
                    </div>
                  </div>
                  <div className="policy-contact-row">
                    <i className="bi bi-telephone" aria-hidden="true"></i>
                    <div>
                      <strong>Phone:</strong> +91 7000152525, +91 89627 48593
                    </div>
                  </div>
                  <div className="policy-contact-row">
                    <i className="bi bi-clock" aria-hidden="true"></i>
                    <div>
                      <strong>Working Hours:</strong> Mon – Fri: 10:00 am – 6:00 pm IST
                    </div>
                  </div>
                  <div className="policy-contact-row">
                    <i className="bi bi-geo-alt" aria-hidden="true"></i>
                    <div>
                      <strong>City / Region:</strong> Dewas, Madhya Pradesh, India
                    </div>
                  </div>
                </div>

                <div className="policy-legal-disclaimer">
                  <p>
                    <strong>Notice:</strong> This policy has been drafted in alignment with the
                    technical architecture of Hello Dewas and Indian privacy statutes (DPDP Act,
                    2023). It should receive final administrative review by the business owner prior
                    to commercial payment gateway launch.
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
