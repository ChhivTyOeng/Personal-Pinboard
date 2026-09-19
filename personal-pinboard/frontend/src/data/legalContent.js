// Terms of Service and Privacy Policy data for Personal Pinboard

export const TERMS_OF_SERVICE = {
  title: 'Terms of Service',
  lastUpdated: 'September 9, 2026',
  summary:
    'Please read these Terms of Service carefully before using Personal Pinboard. By accessing our platform, you agree to abide by these guidelines, respect other creators, and use our tools responsibly.',
  sections: [
    {
      id: 'acceptance',
      title: '1. Acceptance of Terms',
      icon: 'IconCheck',
      content: [
        'By accessing, registering for, or using Personal Pinboard ("the Service", "we", "us", or "our"), you acknowledge that you have read, understood, and agreed to be bound by these Terms of Service and our Privacy Policy.',
        'If you do not agree to these terms, you must immediately discontinue your use of the platform. We reserve the right to modify these terms at any time, and continued use constitutes acceptance of updated terms.',
      ],
    },
    {
      id: 'eligibility',
      title: '2. Eligibility & Account Security',
      icon: 'IconUserCheck',
      content: [
        'You must be at least 13 years of age (or the legal age of digital consent in your jurisdiction) to create an account on Personal Pinboard.',
        'When creating an account, you agree to provide true, accurate, and complete information and keep your credentials updated.',
        'You are solely responsible for maintaining the confidentiality of your account credentials, password, and session tokens. You agree to notify us immediately of any unauthorized access or security breaches.',
      ],
    },
    {
      id: 'user-content',
      title: '3. Your Content & Visual Bookmarks',
      icon: 'IconPin',
      content: [
        'You retain full ownership and intellectual property rights over all bookmarks, notes, images, links, tags, and collections you create or upload on Personal Pinboard.',
        'By saving content, you grant Personal Pinboard a worldwide, non-exclusive, royalty-free license solely to host, store, index, format, and display your content to provide you with the Service.',
        'Shared vs. Private Pins: Pins and boards designated as "Private" are confidential and only visible to you. Pins designated as "Shared" are strictly restricted to your private circle of up to 5 invited friends and are never broadcast to the public web.',
      ],
    },
    {
      id: 'acceptable-use',
      title: '4. Acceptable Use Guidelines',
      icon: 'IconShieldCheck',
      content: [
        'You agree not to use Personal Pinboard for any unlawful, infringing, or harmful purpose. Prohibited activities include, but are not limited to:',
        '• Uploading, bookmarking, or distributing content that is illegal, defamatory, abusive, harassing, or sexually explicit.',
        '• Violating any third-party intellectual property, patent, trademark, trade secret, or copyright.',
        '• Deploying automated crawlers, scrapers, bots, or unauthorized scripts to extract data or disrupt service performance.',
        '• Attempting to reverse engineer, decompile, or breach the security architecture of the platform.',
      ],
    },
    {
      id: 'intellectual-property',
      title: '5. Intellectual Property & Copyright',
      icon: 'IconScale',
      content: [
        'The Personal Pinboard name, branding, logos, custom user interface design, and underlying code are the intellectual property of Personal Pinboard.',
        'We respect intellectual property rights. If you believe any content hosted on our platform infringes your copyright, please reach out with detailed infringement documentation for swift review and takedown.',
      ],
    },
    {
      id: 'termination',
      title: '6. Account Termination & Deletion',
      icon: 'IconTrash',
      content: [
        'You may delete your account and all associated pins, boards, and personal data at any time through your Profile Settings.',
        'We reserve the right to suspend, restrict, or terminate your access to the Service at our sole discretion, without prior notice, if we determine that you have breached these Terms of Service or engaged in abusive conduct.',
      ],
    },
    {
      id: 'disclaimers',
      title: '7. Disclaimer of Warranties & Liability',
      icon: 'IconAlertCircle',
      content: [
        'Personal Pinboard is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, whether express or implied.',
        'While we strive for 99.9% uptime and reliable cloud synchronization, we do not guarantee uninterrupted, secure, or error-free operation.',
        'To the maximum extent permitted by applicable law, Personal Pinboard and its affiliates shall not be liable for any indirect, incidental, punitive, or consequential damages resulting from your use of the Service.',
      ],
    },
    {
      id: 'contact',
      title: '8. Contact Information',
      icon: 'IconMail',
      content: [
        'If you have any questions, concerns, or feedback regarding these Terms of Service, please contact our support and legal team:',
        'Email: chhivtyy16@gmail.com | Support: chhivtyy16@gmail.com',
      ],
    },
  ],
};

export const PRIVACY_POLICY = {
  title: 'Privacy Policy',
  lastUpdated: 'September 9, 2026',
  summary:
    'At Personal Pinboard, your privacy is our core priority. We do not sell your personal data or track you across the web. This Privacy Policy details the exact data we collect, how it is safeguarded, and how you retain total control over your information.',
  sections: [
    {
      id: 'info-collection',
      title: '1. Information We Collect',
      icon: 'IconDatabase',
      content: [
        'We collect only the minimum information necessary to provide you with a fast, seamless visual bookmarking experience:',
        '• Account Information: Your email address, username, display name, and securely hashed passwords (via bcrypt).',
        '• Bookmarking Content: Saved web links, titles, custom notes, pin descriptions, categories, tags, and board structures.',
        '• Visual Assets: Image URLs or uploaded media that you pin to your personal or public collections.',
        '• Technical & Usage Telemetry: Device type, browser user agent, IP address for security logging, and local theme preferences (light/dark mode).',
      ],
    },
    {
      id: 'info-usage',
      title: '2. How We Use Your Information',
      icon: 'IconSparkles',
      content: [
        'We use the information we collect strictly to:',
        '• Authenticate your identity, manage your sessions, and safeguard your account security.',
        '• Store, sync, and organize your pins, favorites, and custom boards across all your devices in real time.',
        '• Strictly honor your privacy toggles: pins marked "Private" remain shielded from public search results and feeds.',
        '• Prevent fraudulent activity, spam, and abuse of the platform infrastructure.',
      ],
    },
    {
      id: 'privacy-controls',
      title: '3. Privacy Controls: Public vs. Private',
      icon: 'IconLock',
      content: [
        'You have absolute, granular control over the visibility of every item you pin on Personal Pinboard:',
        '• Secret / Private Pins: Completely hidden from public view, discover feeds, and guest users. Only accessible when you are logged into your account.',
        '• Shared Pins: Shareable strictly with your private circle of up to 5 designated friends. You can convert any pin from Shared to Private (and vice versa) at any time.',
      ],
    },
    {
      id: 'data-sharing',
      title: '4. No Selling of Data & Sharing Limits',
      icon: 'IconShieldCheck',
      content: [
        'We NEVER sell, rent, monetize, or trade your personal data or browsing bookmarks to third-party advertisers, data aggregators, or marketing firms.',
        'We only share data with essential technical service providers (e.g., secure database hosting, transactional email delivery) who are legally bound to uphold equivalent confidentiality and data protection standards.',
      ],
    },
    {
      id: 'data-security',
      title: '5. Data Security & Encryption',
      icon: 'IconKey',
      content: [
        'We employ robust industry best practices to safeguard your data:',
        '• All passwords are salted and hashed using bcrypt prior to database storage.',
        '• API requests are authenticated via secure JSON Web Tokens (JWT) with automated expiration.',
        '• Encrypted connections (HTTPS/TLS) protect all traffic between your browser and our servers.',
        '• Database access is restricted to verified internal services with strict role-based access policies.',
      ],
    },
    {
      id: 'user-rights',
      title: '6. Your Rights & Data Portability',
      icon: 'IconUser',
      content: [
        'You have comprehensive rights regarding your personal information:',
        '• Right of Access: You can inspect all your saved pins, boards, tags, and account settings directly in the app.',
        '• Right to Rectification: You can update or edit your username, email, or profile details at any time.',
        '• Right to Erasure (Deletion): You can delete individual pins or delete your entire account permanently with one click in Settings.',
      ],
    },
    {
      id: 'cookies-storage',
      title: '7. Cookies & Local Storage',
      icon: 'IconCookie',
      content: [
        'We do not utilize invasive tracking cookies or third-party advertising pixels.',
        'We utilize browser LocalStorage exclusively for essential operational parameters: preserving your authentication session token and remembering your preferred visual theme (Light/Dark mode).',
      ],
    },
    {
      id: 'contact-privacy',
      title: '8. Privacy Questions & Officer Contact',
      icon: 'IconMail',
      content: [
        'If you have any questions, requests to exercise your data protection rights, or suggestions regarding our Privacy Policy, please reach out to:',
        'Email: chhivtyy16@gmail.com | DPO Contact: chhivtyy16@gmail.com',
      ],
    },
  ],
};
