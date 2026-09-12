import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LegalDocumentIndex from "../privacy-policy/PrivacyPolicyIndex";
import "../privacy-policy/privacy-policy.css";

export const metadata: Metadata = {
  title: "Security | ForgeSec",
  description:
    "Learn how ForgeSec approaches platform security, data protection, access control, secure development, and incident response."
};

const lastUpdated = "September 12, 2026";

const securitySections = [
  {
    id: "overview",
    navTitle: `Last updated ${lastUpdated}`,
    title: `Last updated ${lastUpdated}`,
    copy: [
      "Security is central to the way ForgeSec designs, operates, and supports its platform. This Security Statement describes the principles and safeguards we use to protect our Services and the customer security data entrusted to us.",
      "The controls described here provide a general overview. Specific contractual commitments, service configurations, and customer agreements may define additional requirements or take precedence."
    ]
  },
  {
    id: "security-program",
    navTitle: "Our security program",
    title: "Our Security Program",
    copy: [
      "ForgeSec follows a risk-based security program designed around prevention, detection, response, and continuous improvement. We evaluate safeguards according to the sensitivity of the information, the nature of the Services, and relevant operational risks.",
      "Security responsibilities are incorporated into product development, infrastructure operations, access management, incident handling, and supplier oversight."
    ]
  },
  {
    id: "shared-responsibility",
    navTitle: "Shared responsibility",
    title: "Shared Responsibility",
    copy: [
      "Protecting a security testing environment is a shared responsibility. ForgeSec works to secure the platform and supporting infrastructure, while customers control their users, credentials, testing scope, connected systems, and the data they submit.",
      "Customers should assign access according to job responsibilities, review authorized users regularly, protect credentials, configure integrations carefully, and ensure that all testing targets are properly authorized."
    ]
  },
  {
    id: "platform-protection",
    navTitle: "Platform protection",
    title: "Platform and Infrastructure Protection",
    copy: [
      "ForgeSec applies layered safeguards intended to reduce unauthorized access, prevent misuse, isolate customer activity, and protect the availability and integrity of the Services.",
      "Infrastructure and application controls are reviewed as the platform changes. Security-relevant configuration, service health, and operational events may be monitored to identify conditions requiring investigation."
    ],
    items: [
      "Layered controls across application, infrastructure, identity, and operational boundaries.",
      "Environment and service configuration managed through controlled processes.",
      "Monitoring designed to identify suspicious activity and service degradation.",
      "Logical separation of customer workspaces and authorized testing activity."
    ]
  },
  {
    id: "data-protection",
    navTitle: "Data protection",
    title: "Data Protection",
    copy: [
      "ForgeSec treats findings, validation evidence, scan configurations, asset information, reports, and related workspace content as sensitive customer security data.",
      "The Services are designed to protect data in transit and at rest using appropriate encryption and platform safeguards. Access to customer data is limited to authorized purposes such as providing support, maintaining the Services, investigating security issues, or meeting legal obligations.",
      "Retention and deletion depend on service configuration, contractual commitments, legal requirements, and the type of information involved."
    ]
  },
  {
    id: "identity-access",
    navTitle: "Identity and access",
    title: "Identity and Access Management",
    copy: [
      "Access to ForgeSec systems is governed by the principles of least privilege and business need. Permissions are intended to be assigned according to role and reviewed as responsibilities change.",
      "Administrative and production access is restricted and subject to appropriate authentication, authorization, and oversight. Customers remain responsible for managing workspace users and promptly removing access that is no longer required."
    ]
  },
  {
    id: "secure-development",
    navTitle: "Secure development",
    title: "Secure Development",
    copy: [
      "Security is considered throughout the software development lifecycle. Changes are developed, reviewed, tested, and released through managed workflows intended to reduce defects and unauthorized modification.",
      "ForgeSec evaluates application and dependency risk using a combination of engineering review, automated analysis, testing, and remediation processes appropriate to the affected component."
    ],
    items: [
      "Security-aware design and threat consideration for material changes.",
      "Peer review and controlled change-management practices.",
      "Automated checks and testing integrated into delivery workflows.",
      "Prioritized remediation based on severity, exploitability, and exposure."
    ]
  },
  {
    id: "vulnerability-management",
    navTitle: "Vulnerability management",
    title: "Vulnerability Management",
    copy: [
      "ForgeSec evaluates security issues affecting the platform and prioritizes remediation according to risk. Relevant factors may include severity, exploitability, exposure, available mitigations, and potential impact on customers.",
      "We review information from internal testing, monitoring, software dependencies, service providers, and responsible external reports. When an issue affects customers, we take steps appropriate to the risk and available evidence."
    ]
  },
  {
    id: "monitoring-response",
    navTitle: "Monitoring and response",
    title: "Security Monitoring and Incident Response",
    copy: [
      "ForgeSec maintains processes intended to detect, assess, contain, investigate, and recover from security events. Alerts and operational signals are reviewed according to their context and potential impact.",
      "If we determine that a security incident affects customer information, we will communicate with impacted customers in accordance with applicable law and contractual obligations. Notifications may include known impact, actions taken, and practical steps customers should consider."
    ]
  },
  {
    id: "availability",
    navTitle: "Availability and recovery",
    title: "Availability and Recovery",
    copy: [
      "ForgeSec plans for service interruptions and operational failures based on the importance of affected systems. Resilience, backup, restoration, and recovery measures are selected according to service architecture and business risk.",
      "We review operational incidents to identify improvements that can reduce recurrence, shorten recovery time, or strengthen monitoring and response."
    ]
  },
  {
    id: "people-security",
    navTitle: "People and operations",
    title: "People and Operational Security",
    copy: [
      "Personnel with access to sensitive systems or information are expected to follow security and confidentiality requirements appropriate to their responsibilities.",
      "Access is granted based on business need, adjusted when roles change, and removed when it is no longer required. Security awareness and operational procedures support consistent handling of customer information and security events."
    ]
  },
  {
    id: "suppliers",
    navTitle: "Service providers",
    title: "Service Provider Security",
    copy: [
      "ForgeSec relies on selected service providers for capabilities such as infrastructure, communications, support, analytics, and business operations. We consider the nature of the service and the information involved when evaluating supplier risk.",
      "Providers that handle sensitive information are expected to follow applicable contractual, confidentiality, privacy, and security obligations. We limit access to what is reasonably necessary for the service they provide."
    ]
  },
  {
    id: "customer-guidance",
    navTitle: "Customer guidance",
    title: "Customer Security Guidance",
    copy: [
      "Customers can materially strengthen their ForgeSec environment by applying sound identity, endpoint, integration, and testing-scope practices."
    ],
    items: [
      "Use unique credentials and strong authentication controls.",
      "Grant the minimum workspace permissions required for each role.",
      "Review users, integrations, scan targets, and exported reports regularly.",
      "Keep connected systems and endpoints appropriately patched and monitored.",
      "Report suspected account compromise or unexpected platform activity promptly."
    ]
  },
  {
    id: "responsible-disclosure",
    navTitle: "Responsible disclosure",
    title: "Responsible Disclosure",
    copy: [
      "We welcome good-faith reports that help us protect ForgeSec and our customers. If you believe you have found a security issue in a ForgeSec-owned system, report it privately and provide enough detail for us to understand and reproduce the concern.",
      "Do not access customer data, disrupt services, use destructive testing, or publicly disclose an unresolved issue. We will review credible reports and communicate as appropriate during investigation and remediation."
    ]
  },
  {
    id: "contact",
    navTitle: "Contact security",
    title: "Contact Security",
    copy: [
      "For security questions, suspected platform misuse, or responsible disclosure, contact the ForgeSec team at hello@forgesec.com. Include a clear description, the affected service or URL, reproduction details, and your preferred contact information."
    ]
  }
];

export default function SecurityPage() {
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

      <header className="policy-notice-hero" aria-labelledby="security-title">
        <div className="policy-notice-hero-inner">
          <h1 id="security-title">ForgeSec Security</h1>
        </div>
      </header>

      <div className="policy-notice-layout">
        <LegalDocumentIndex sections={securitySections} />

        <article className="policy-notice-document">
          {securitySections.map((section, index) => (
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
                  <span>Security inquiries</span>
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
