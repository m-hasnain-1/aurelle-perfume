export type JournalArticle = {
  slug: string;
  category: string;
  title: string;
  dek: string;
  readTime: string;
  tone: string;
  paragraphs: string[];
};

export const journalArticles: JournalArticle[] = [
  {
    slug: "the-art-of-wearing-scent",
    category: "The ritual",
    title: "The art of wearing scent",
    dek: "A few thoughts on finding a fragrance ritual that feels like your own.",
    readTime: "4 minute read",
    tone: "amber",
    paragraphs: [
      "A fragrance ritual does not need a special occasion. It can be a small pause before the day begins: a breath, a familiar bottle, a moment to choose how you want to feel.",
      "Try applying scent to warm pulse points, then give it a little time. The first impression is only one part of the story. As it settles, the composition changes with warmth, air, and the particular chemistry of your skin.",
      "There is no correct amount, or single way to wear it. Begin with less than you think you need. Notice how it moves through your day. The best ritual is the one you want to return to.",
    ],
  },
  {
    slug: "notes-that-stay",
    category: "In composition",
    title: "Notes that stay",
    dek: "On the quiet architecture of an opening, a heart, and a lasting note.",
    readTime: "5 minute read",
    tone: "plum",
    paragraphs: [
      "We often meet a fragrance in its opening: the bright first impression that catches the air. But a composition is less like a single note and more like a room slowly coming into focus.",
      "The heart gives the scent its character. It might feel green and open, floral and softly textured, or warm with the suggestion of spice. The base is what remains close to skin: woods, amber, or musk, meeting the day at its own pace.",
      "These are not strict chapters. They overlap, recede, and return. That is part of the pleasure of wearing scent: it is never quite the same twice.",
    ],
  },
  {
    slug: "a-moment-before-dusk",
    category: "Small moments",
    title: "A moment before dusk",
    dek: "A simple end-of-day ritual for letting the day become the evening.",
    readTime: "3 minute read",
    tone: "sage",
    paragraphs: [
      "When the light changes, let something else change with it. Put the day down for a moment. Open a window. Let the room become quiet before you decide what comes next.",
      "A softer fragrance can be a gentle marker between one part of the day and another. Try one light touch at the wrist, then let it warm as you settle in. You do not need to be going anywhere.",
      "Some rituals are valuable simply because they ask us to notice. A breath, a little quiet, a scent that feels like yours.",
    ],
  },
];
