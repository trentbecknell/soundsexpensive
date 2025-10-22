import { Key } from './assessment-questions';

export type AssessmentPrompt = {
  key: Key;
  systemMessage: string;
  suggestions: string[];
};

export const ASSESSMENT_PROMPTS: AssessmentPrompt[] = [
  {
    key: 'craft',
    systemMessage: "Let's talk about your musical abilities. Tell me about your songwriting process, performance experience, or technical skills. For example, do you write your own songs? Play instruments? Produce?",
    suggestions: [
      "I write and produce my own music",
      "I collaborate with other songwriters",
      "I'm mainly focused on performing",
      "I'm learning production right now"
    ]
  },
  {
    key: 'catalog',
    systemMessage: "Let's discuss your song catalog. How many finished songs do you have? Are they released or unreleased? Think about both quantity and quality.",
    suggestions: [
      "I have several demos",
      "I release music regularly",
      "Working on my first EP",
      "Building a collection of singles"
    ]
  },
  {
    key: 'brand',
    systemMessage: "Tell me about your artist brand and visual identity. Do you have a consistent look, logo, or aesthetic? What story does your visual presence tell?",
    suggestions: [
      "I have professional photos",
      "Working on my visual style",
      "My aesthetic is DIY/authentic",
      "Need help with branding"
    ]
  },
  {
    key: 'team',
    systemMessage: "Who's on your team? This could include managers, producers, bookers, or regular collaborators. Don't worry if you're doing everything yourself right now.",
    suggestions: [
      "I'm indie/self-managed",
      "I work with a producer",
      "Have some key collaborators",
      "Looking for management"
    ]
  },
  {
    key: 'audience',
    systemMessage: "Let's talk about your audience and engagement. This includes social media followers, streaming numbers, live show attendance, or any other ways you connect with fans.",
    suggestions: [
      "Building social following",
      "Regular live shows",
      "Growing streaming numbers",
      "Focused on content creation"
    ]
  },
  {
    key: 'ops',
    systemMessage: "How organized are your music business operations? Think about things like copyright registration, streaming accounts, financial tracking, or legal agreements.",
    suggestions: [
      "Registered for PROs",
      "Have distribution setup",
      "Track my expenses",
      "Need legal help"
    ]
  }
];