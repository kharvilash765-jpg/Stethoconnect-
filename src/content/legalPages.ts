export interface LegalSection {
  heading: string;
  paragraphs: string[];
}

export interface LegalDocument {
  slug: string;
  title: string;
  description: string;
  summary: string;
  sections: LegalSection[];
}

export const LEGAL_LAST_UPDATED = '1 November 2026';

export const FOUNDERS = 'Praveen koli and Monu Lakshakar';

export const LEGAL_DOCUMENTS: LegalDocument[] = [
  {
    slug: 'disclaimer',
    title: 'Platform Purpose',
    description: 'What StethoConnect is, and our campus student vision',
    summary:
      'StethoConnect is an exclusive campus social network designed to connect college students and alumni, foster college communities, and share authentic campus life, notes, and memes.',
    sections: [
      {
        heading: 'Who runs StethoConnect',
        paragraphs: [
          `StethoConnect is founded and operated by ${FOUNDERS}. We created this platform to bring college students together in a clean, vibrant digital campus environment.`,
        ],
      },
      {
        heading: 'Pure campus social community',
        paragraphs: [
          'StethoConnect is exclusively for college students and alumni to interact, discuss campus activities, share study resources, and celebrate college memories.',
          'It is not intended for clinical consultations, medical diagnoses, or formal medical advice.',
        ],
      },
      {
        heading: 'Student responsibility',
        paragraphs: [
          'All students are responsible for maintaining a supportive, respectful, and genuine campus environment.',
        ],
      },
    ],
  },
  {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    description: 'How StethoConnect and Firebase safeguard your student profile and data',
    summary:
      'This policy outlines how your Google credentials, student profile, college affiliation, batch year, and campus posts are secured using Firebase Firestore and Authentication.',
    sections: [
      {
        heading: 'Data Controller & Platform Operators',
        paragraphs: [
          `StethoConnect is maintained by ${FOUNDERS}. Your account data is secured using enterprise Firebase Firestore and Google Authentication infrastructure.`,
        ],
      },
      {
        heading: 'Information stored',
        paragraphs: [
          'When signing in via Google and creating your profile, we store your display name, username handle, college name, course/batch year, bio, and profile avatar.',
          'Your campus posts, photos, comments, likes, and following connections are synchronized in real-time to your Firebase Firestore cloud database.',
        ],
      },
      {
        heading: 'Usage of information',
        paragraphs: [
          'We use this information exclusively to power your college feed, enable college-filtered searches, and connect you with peers from your campus. We never sell your personal student data.',
        ],
      },
      {
        heading: 'Public visibility',
        paragraphs: [
          'Your profile name, college, batch year, bio, and public campus posts are visible to fellow students on StethoConnect.',
        ],
      },
      {
        heading: 'Your control',
        paragraphs: [
          'You can edit your profile details, delete your posts and comments at any time, or unfollow peers with instant real-time synchronization.',
        ],
      },
    ],
  },
  {
    slug: 'terms-and-conditions',
    title: 'Terms & Conditions',
    description: 'Rules and terms of participation for campus members',
    summary:
      'By joining StethoConnect, you agree to respectful campus interactions, academic honesty, and a safe community for all college mates.',
    sections: [
      {
        heading: 'Agreement',
        paragraphs: [
          `StethoConnect is founded by ${FOUNDERS}. These terms constitute an agreement for safe, engaging, and collaborative campus networking.`,
        ],
      },
      {
        heading: 'Student conduct',
        paragraphs: [
          'Members agree to treat fellow students with dignity. Harassment, ragging, bullying, hate speech, or impersonating students from other colleges will result in immediate suspension.',
        ],
      },
      {
        heading: 'Content ownership',
        paragraphs: [
          'You retain full ownership of the posts, campus photos, and study notes you share. By posting, you grant StethoConnect permission to display your contributions to your campus network.',
        ],
      },
      {
        heading: 'Community safety & moderation',
        paragraphs: [
          'Posts violating community guidelines can be reported by any user and will be reviewed and removed by platform moderation.',
        ],
      },
    ],
  },
  {
    slug: 'student-safety-policy',
    title: 'Student Safety Policy',
    description: 'Guidelines for a safe, positive, and harassment-free college network',
    summary:
      'We are dedicated to building a welcoming space free of ragging, cyberbullying, doxxing, or malicious content.',
    sections: [
      {
        heading: 'Zero tolerance for harassment or ragging',
        paragraphs: [
          'StethoConnect strictly prohibits any form of cyber-ragging, bullying, targeted defamation, or non-consensual sharing of personal information of peers or professors.',
        ],
      },
      {
        heading: 'Authentic student identity',
        paragraphs: [
          'Be genuine with your college name and batch year. Misrepresenting identity or creating deceptive accounts undermines campus trust.',
        ],
      },
    ],
  },
  {
    slug: 'community-guidelines',
    title: 'Community Guidelines',
    description: 'Fostering vibrant, helpful, and fun campus camaraderie',
    summary:
      'StethoConnect fosters an environment of peer support, relatable humor, academic collaboration, and lifelong college connections.',
    sections: [
      {
        heading: 'Campus camaraderie & respect',
        paragraphs: [
          'Cheer on your college mates, share helpful exam prep advice, and celebrate campus events together.',
        ],
      },
      {
        heading: 'Constructive discussions',
        paragraphs: [
          'Keep conversations lively and respectful. Disagreements should remain friendly and respectful of different points of view.',
        ],
      },
    ],
  },
];
