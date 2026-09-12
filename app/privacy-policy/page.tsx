import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PrivacyPolicyIndex from "./PrivacyPolicyIndex";
import "./privacy-policy.css";

export const metadata: Metadata = {
  title: "Privacy Policy | ForgeSec",
  description:
    "Learn how ForgeSec collects, uses, protects, and retains personal information and customer security data."
};

const lastUpdated = "September 11, 2026";

const policySections = [
  {
    id: "overview",
    navTitle: `Last updated ${lastUpdated}`,
    title: `Last updated ${lastUpdated}`,
    copy: [
      "ForgeSec recognizes the importance of privacy, security, and transparency. This Privacy Policy explains how we collect, use, disclose, and protect personal information when you visit our website, request a demonstration, contact our team, or use the ForgeSec security assurance platform.",
      "In this policy, “personal information” means information that identifies, relates to, or can reasonably be linked with an individual. Customer security data is addressed separately where its technical and sensitive nature requires additional context."
    ],
  },
  {
    id: "scope",
    navTitle: "Scope of this policy",
    title: "Scope of this Policy",
    copy: [
      "This policy applies to ForgeSec websites, products, hosted services, demonstrations, support channels, and other interactions that link to or reference this policy.",
      "It does not govern information processed solely on behalf of a customer under a separate agreement where that customer determines the purposes and means of processing. In those cases, the customer’s privacy terms and our applicable service agreement control."
    ]
  },
  {
    id: "information-we-collect",
    navTitle: "Information we collect",
    title: "Information We Collect",
    copy: [
      "We collect information you provide directly, including your name, work email, company, role, account details, demo requests, support messages, and billing-related information.",
      "We may also collect technical and usage information such as device and browser type, pages viewed, approximate location, access times, referring source, IP address, product interactions, and diagnostic logs needed to operate, secure, and improve our services."
    ]
  },
  {
    id: "customer-data",
    navTitle: "Customer security data",
    title: "Customer Security Data",
    copy: [
      "ForgeSec is designed for authorized security testing. When customers use the platform, we may process workspace information such as authorized assets, domains, URLs, IP ranges, scan configurations, security findings, validation evidence, remediation notes, reports, activity logs, and team ownership details.",
      "We treat this information as customer-controlled security data and use it only to deliver, secure, support, and improve the services as described in this policy and applicable customer agreements. Customers are responsible for ensuring that targets and environments submitted for assessment are authorized."
    ]
  },
  {
    id: "how-we-use-information",
    navTitle: "How we use information",
    title: "How We Use Information",
    copy: [
      "We use information to provide and administer ForgeSec products, create and manage accounts, run requested security assessments, validate findings, support remediation workflows, deliver reports, respond to inquiries, and maintain service reliability.",
      "We also use information to protect against fraud and misuse, investigate incidents, troubleshoot issues, measure performance, improve product functionality, satisfy legal obligations, and communicate service or account updates.",
      "Where permitted, we may send product, event, or marketing communications. You can opt out of promotional messages at any time without affecting essential service communications."
    ]
  },
  {
    id: "legal-bases",
    navTitle: "Legal bases",
    title: "Legal Bases for Processing",
    copy: [
      "Where applicable law requires a legal basis, we process personal information to perform a contract, comply with legal obligations, protect our or another person’s vital interests, pursue legitimate business and security interests, or with your consent.",
      "Our legitimate interests include operating and improving our services, securing our systems, communicating with customers, and developing our business. We consider and balance those interests against the rights and expectations of affected individuals."
    ]
  },
  {
    id: "sharing",
    navTitle: "How we share information",
    title: "How We Share Information",
    copy: [
      "We may share information with vetted service providers that support hosting, analytics, communications, customer support, security, payment processing, and business operations. These providers may access information only as needed to perform services for us and are subject to appropriate obligations.",
      "Information may be shared with customer-authorized users in the same workspace, including administrators, security owners, engineering owners, and assigned team members.",
      "We may also disclose information when required by law, to protect rights and safety, prevent abuse, respond to lawful requests, or support a corporate transaction such as a merger, acquisition, financing, reorganization, or sale of assets."
    ]
  },
  {
    id: "cookies",
    navTitle: "Cookies and analytics",
    title: "Cookies and Similar Technologies",
    copy: [
      "ForgeSec may use cookies, local storage, pixels, and similar technologies to keep our website and platform secure, remember preferences, understand product usage, and improve performance.",
      "Some technologies are essential for authentication, functionality, and security. Where required, optional analytics or marketing technologies are used only after appropriate notice or consent. You can also manage certain choices through your browser settings."
    ]
  },
  {
    id: "retention",
    navTitle: "Retention",
    title: "Data Retention",
    copy: [
      "We retain information only for as long as reasonably necessary to provide services, maintain security, satisfy legal and business obligations, resolve disputes, and support audit or compliance requirements.",
      "Retention periods vary according to the type of information, account settings, service configuration, contractual commitments, legal requirements, and the sensitivity of the data. When information is no longer needed, we take reasonable steps to delete, anonymize, or securely isolate it."
    ]
  },
  {
    id: "security",
    navTitle: "Security",
    title: "How We Protect Information",
    copy: [
      "We use technical and organizational safeguards designed to protect personal information and customer security data against unauthorized access, alteration, loss, misuse, or disclosure.",
      "No system can be guaranteed completely secure. We continually assess our controls and encourage customers to use strong credentials, limit access appropriately, and notify us promptly of suspected unauthorized activity."
    ]
  },
  {
    id: "international-transfers",
    navTitle: "International transfers",
    title: "International Data Transfers",
    copy: [
      "ForgeSec and our service providers may process information in countries other than the country where it was collected. Those countries may have different data protection laws.",
      "When personal information is transferred across regions, we use contractual, organizational, or other safeguards intended to provide an appropriate level of protection under applicable law."
    ]
  },
  {
    id: "rights",
    navTitle: "Your rights and choices",
    title: "Your Rights and Choices",
    copy: [
      "Depending on your location, you may have rights to access, correct, delete, or export personal information, or to restrict or object to certain processing. You may also have the right to withdraw consent or lodge a complaint with a relevant data protection authority.",
      "You can update certain account information in your workspace, unsubscribe from marketing communications using the link in those messages, or contact us for help. We may need to verify your identity, location, or authority before completing a request."
    ]
  },
  {
    id: "children",
    navTitle: "Children’s privacy",
    title: "Children’s Privacy",
    copy: [
      "ForgeSec services are intended for organizations and professional users. They are not directed to children, and we do not knowingly collect personal information from children. If you believe a child has provided personal information to us, please contact us so we can take appropriate action."
    ]
  },
  {
    id: "changes",
    navTitle: "Changes to this policy",
    title: "Changes to this Policy",
    copy: [
      "We may update this Privacy Policy to reflect changes in our services, practices, or legal obligations. The “Last updated” date shows when this version became effective. When changes are material, we will provide additional notice through our website, product, email, or another appropriate channel."
    ]
  },
  {
    id: "contact",
    navTitle: "Contact us",
    title: "Contact Us",
    copy: [
      "If you have a privacy question, want to exercise a privacy right, or need more information about our practices, contact the ForgeSec team at hello@forgesec.com."
    ]
  }
];

export default function PrivacyPolicyPage() {
  return (
    <main className="policy-notice-page">
      <div className="policy-notice-brandbar">
        <div className="policy-notice-brandbar-inner">
          <Link className="policy-notice-logo" href="/" aria-label="ForgeSec home">
            <Image
              alt="ForgeSec"
              height={190}
              priority
              src="/images/logo1.png"
              width={190}
            />
          </Link>
        </div>
      </div>

      <header className="policy-notice-hero" aria-labelledby="privacy-policy-title">
        <div className="policy-notice-hero-inner">
          <h1 id="privacy-policy-title">ForgeSec Privacy Policy</h1>
        </div>
      </header>

      <div className="policy-notice-layout">
        <PrivacyPolicyIndex sections={policySections} />

        <article className="policy-notice-document">
          {policySections.map((section, index) => (
            <section
              className={`policy-notice-section${index === 0 ? " policy-notice-section-intro" : ""}`}
              id={section.id}
              key={section.id}
            >
              <h2>{section.title}</h2>
              {section.copy.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}

              {section.id === "contact" ? (
                <a className="policy-notice-contact" href="mailto:hello@forgesec.com">
                  <span>Privacy inquiries</span>
                  <strong>hello@forgesec.com</strong>
                  <i aria-hidden="true">↗</i>
                </a>
              ) : null}
            </section>
          ))}
        </article>
      </div>
    </main>
  );
}
