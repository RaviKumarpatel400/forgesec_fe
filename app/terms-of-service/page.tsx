import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LegalDocumentIndex from "../privacy-policy/PrivacyPolicyIndex";
import "../privacy-policy/privacy-policy.css";

export const metadata: Metadata = {
  title: "Terms of Service | ForgeSec",
  description:
    "Review the terms that govern access to and use of the ForgeSec website, platform, and security testing services."
};

const lastUpdated = "September 12, 2026";

const termsSections = [
  {
    id: "overview",
    navTitle: `Last updated ${lastUpdated}`,
    title: `Last updated ${lastUpdated}`,
    copy: [
      "These Terms of Service (“Terms”) govern access to and use of the ForgeSec website, hosted platform, security testing capabilities, reports, support channels, and related services (collectively, the “Services”).",
      "By creating an account, accepting an order form, accessing the Services, or otherwise using ForgeSec, you agree to these Terms. If you use the Services on behalf of an organization, you represent that you have authority to bind that organization, and “you” includes that organization."
    ]
  },
  {
    id: "eligibility",
    navTitle: "Agreement and eligibility",
    title: "Agreement and Eligibility",
    copy: [
      "You must be legally capable of entering into a binding agreement and must use the Services only for lawful business or professional purposes. The Services are not intended for children.",
      "If a separate order form, master services agreement, data processing agreement, or other written agreement applies to your use of ForgeSec, that agreement forms part of these Terms. If its terms conflict with these Terms, the specifically negotiated agreement controls to the extent of the conflict."
    ]
  },
  {
    id: "accounts",
    navTitle: "Accounts and access",
    title: "Accounts and Access",
    copy: [
      "You are responsible for providing accurate account information, safeguarding credentials, limiting access to authorized users, and keeping administrator and billing contacts current.",
      "You are responsible for activity conducted through your account unless it results from a failure of ForgeSec systems. Notify us promptly if you suspect unauthorized access, credential compromise, or misuse of your workspace."
    ]
  },
  {
    id: "service-access",
    navTitle: "Service access and license",
    title: "Service Access and License",
    copy: [
      "Subject to these Terms and any applicable order, ForgeSec grants you a limited, non-exclusive, non-transferable, and revocable right to access and use the Services during the applicable subscription or service period for your internal business purposes.",
      "Your service plan may define usage limits, included capabilities, authorized users, scan volumes, support levels, or other entitlements. You may not resell, sublicense, or provide the Services to another party unless ForgeSec expressly agrees in writing."
    ]
  },
  {
    id: "authorized-testing",
    navTitle: "Authorized security testing",
    title: "Authorized Security Testing",
    copy: [
      "ForgeSec is built for legitimate and authorized security assessment. You must have all rights, permissions, and approvals required to test every domain, application, API, host, network, cloud environment, account, or other target submitted to the Services.",
      "You remain responsible for defining an appropriate scope, timing tests responsibly, maintaining backups where appropriate, and coordinating with system owners or service providers."
    ],
    items: [
      "Submit only assets you own or are expressly authorized to assess.",
      "Follow applicable laws, contractual restrictions, and third-party acceptable-use policies.",
      "Do not use ForgeSec to access data or systems beyond the approved testing scope.",
      "Stop activity and notify the appropriate owner if testing creates an unexpected material risk."
    ]
  },
  {
    id: "acceptable-use",
    navTitle: "Acceptable use",
    title: "Acceptable Use",
    copy: [
      "You may not use the Services in a way that harms people, systems, networks, or ForgeSec, or that interferes with another customer’s use of the Services."
    ],
    items: [
      "Do not test systems without authorization or use the Services for unlawful surveillance, exploitation, extortion, or disruption.",
      "Do not introduce malicious code, evade service limits, bypass access controls, or attempt to compromise the ForgeSec platform.",
      "Do not reverse engineer, copy, scrape, or derive source code from the Services except where applicable law does not permit that restriction.",
      "Do not misrepresent scan results, remove proprietary notices, or use the Services to build a competing product."
    ]
  },
  {
    id: "customer-content",
    navTitle: "Customer data and content",
    title: "Customer Data and Content",
    copy: [
      "You retain ownership of data, configurations, targets, findings, evidence, reports, instructions, and other content you or your authorized users submit to the Services (“Customer Content”).",
      "You grant ForgeSec the limited rights necessary to host, process, transmit, display, and otherwise use Customer Content to provide, secure, maintain, and support the Services. You represent that you have the rights required to provide Customer Content and permit this processing.",
      "ForgeSec will handle personal information and customer security data as described in our Privacy Policy and applicable customer agreements."
    ]
  },
  {
    id: "intellectual-property",
    navTitle: "Intellectual property",
    title: "Intellectual Property and Feedback",
    copy: [
      "ForgeSec and its licensors retain all rights in the Services, including software, interfaces, workflows, models, documentation, branding, and improvements. Except for the limited access right stated in these Terms, no rights are transferred to you.",
      "If you provide suggestions or feedback, you permit ForgeSec to use that feedback without restriction or payment, provided we do not identify you publicly as its source without permission."
    ]
  },
  {
    id: "fees",
    navTitle: "Fees and subscriptions",
    title: "Fees, Subscriptions, and Taxes",
    copy: [
      "Fees, billing frequency, subscription length, usage entitlements, and payment terms are stated in the applicable order or checkout flow. Unless an order states otherwise, fees are non-refundable except where required by law.",
      "You are responsible for applicable taxes other than taxes based on ForgeSec’s net income. We may suspend paid Services for overdue undisputed amounts after providing reasonable notice and an opportunity to resolve the issue."
    ]
  },
  {
    id: "confidentiality",
    navTitle: "Confidentiality and security",
    title: "Confidentiality and Security",
    copy: [
      "Each party may receive non-public information that is identified as confidential or should reasonably be understood to be confidential. The receiving party will use that information only for the relationship, protect it using reasonable care, and disclose it only to people who need it and are bound by appropriate obligations.",
      "Confidentiality obligations do not apply to information that is lawfully public, already known without restriction, independently developed, or rightfully received from another source. A party may disclose information when legally required after providing notice where permitted."
    ]
  },
  {
    id: "third-party-services",
    navTitle: "Third-party services",
    title: "Third-Party Services",
    copy: [
      "The Services may integrate with or link to products, infrastructure, or content operated by third parties. Your use of third-party services is governed by their terms and privacy practices.",
      "ForgeSec is not responsible for third-party services outside our control. Changes to those services may affect an integration or feature, and we may modify or discontinue affected functionality when reasonably necessary."
    ]
  },
  {
    id: "suspension-termination",
    navTitle: "Suspension and termination",
    title: "Suspension and Termination",
    copy: [
      "You may stop using the Services at any time, subject to the commitments in your order. Either party may terminate for a material breach that remains uncured after any required notice period, or as otherwise stated in an applicable agreement.",
      "ForgeSec may suspend access when reasonably necessary to prevent harm, address a security threat, comply with law, respond to prohibited activity, or protect the Services and other customers. Where practical, we will provide notice and work to restore access after the issue is resolved.",
      "Terms that by their nature should continue—including payment obligations, confidentiality, ownership, disclaimers, liability limitations, and general legal terms—survive termination."
    ]
  },
  {
    id: "disclaimers",
    navTitle: "Warranties and disclaimers",
    title: "Warranties and Disclaimers",
    copy: [
      "ForgeSec will provide the Services with reasonable care and skill and in material accordance with applicable documentation. Security testing reduces uncertainty but cannot identify every vulnerability, guarantee that a system is secure, or replace professional judgment and layered security controls.",
      "Except for express commitments in these Terms or an applicable written agreement, the Services are provided “as is” and “as available.” To the fullest extent permitted by law, ForgeSec disclaims implied warranties, including merchantability, fitness for a particular purpose, non-infringement, and uninterrupted or error-free operation."
    ]
  },
  {
    id: "liability",
    navTitle: "Liability and indemnity",
    title: "Liability and Indemnification",
    copy: [
      "To the fullest extent permitted by law, neither party will be liable for indirect, incidental, special, exemplary, punitive, or consequential damages, or for lost profits, revenues, goodwill, or data, arising from these Terms or the Services.",
      "Any aggregate liability cap, exclusions, or indemnification obligations applicable to your use of the Services will be set out in your order or other written agreement. Nothing in these Terms limits liability that cannot legally be limited or excluded."
    ]
  },
  {
    id: "general-terms",
    navTitle: "General terms",
    title: "General Terms",
    copy: [
      "Neither party is responsible for delay or failure caused by events beyond its reasonable control. You may not assign these Terms without ForgeSec’s written consent, except as part of a permitted corporate transaction. ForgeSec may assign these Terms to an affiliate or in connection with a merger, reorganization, or sale of relevant assets.",
      "If any provision is unenforceable, it will be adjusted only as necessary and the remaining provisions will continue. A waiver must be explicit and does not waive a later breach. These Terms and incorporated agreements form the complete agreement regarding the Services.",
      "The governing law, venue, and dispute process identified in an applicable order or written agreement will apply. If no separate agreement specifies them, the rules applicable to the ForgeSec entity providing the Services will govern."
    ]
  },
  {
    id: "changes",
    navTitle: "Changes to these terms",
    title: "Changes to These Terms",
    copy: [
      "We may update these Terms to reflect changes in the Services, law, security practices, or business operations. The “Last updated” date identifies the current version.",
      "If a change materially affects your rights or obligations, we will provide reasonable advance notice through the website, platform, email, or another appropriate channel. Continued use after the effective date of an update constitutes acceptance where permitted by law."
    ]
  },
  {
    id: "contact",
    navTitle: "Contact us",
    title: "Contact Us",
    copy: [
      "Questions about these Terms, your account, or an applicable agreement can be sent to the ForgeSec team at hello@forgesec.com."
    ]
  }
];

export default function TermsOfServicePage() {
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

      <header className="policy-notice-hero" aria-labelledby="terms-of-service-title">
        <div className="policy-notice-hero-inner">
          <h1 id="terms-of-service-title">ForgeSec Terms of Service</h1>
        </div>
      </header>

      <div className="policy-notice-layout">
        <LegalDocumentIndex sections={termsSections} />

        <article className="policy-notice-document">
          {termsSections.map((section, index) => (
            <section
              className={`policy-notice-section${index === 0 ? " policy-notice-section-intro" : ""}`}
              id={section.id}
              key={section.id}
            >
              <h2>{section.title}</h2>
              {section.copy.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}

              {section.items ? (
                <ul className="policy-notice-list">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}

              {section.id === "contact" ? (
                <a className="policy-notice-contact" href="mailto:hello@forgesec.com">
                  <span>Terms inquiries</span>
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
