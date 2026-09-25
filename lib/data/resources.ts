export type Article = {
  slug: string;
  title: string;
  dek: string;
  category: "Preparation" | "Money" | "Technology" | "Living" | "Wellbeing" | "Academics";
  minutes: number;
  /** Texture used for the editorial cover. */
  cover: "paper" | "linen" | "stone" | "walnut" | "glass" | "morning";
  sections: { heading: string; body: string[] }[];
};

export const articles: Article[] = [
  {
    slug: "packing-checklist",
    title: "The Packing Checklist",
    dek: "What to bring, what to buy there, and what to leave at home.",
    category: "Preparation",
    minutes: 6,
    cover: "linen",
    sections: [
      {
        heading: "Pack for the room first",
        body: [
          "Your first night matters more than your first week. Before anything else, make sure you can sleep, see and charge: bedding, a light that works without mains power, and an extension cord with enough sockets for you and a roommate.",
          "Everything else can arrive in stages. Campus neighbourhoods exist to sell buckets and hangers; you do not need to carry them across the country.",
        ],
      },
      {
        heading: "Then the tools of study",
        body: [
          "One notebook per course. A planner you will actually open. A calculator if your programme uses one. A laptop sleeve, because a cracked screen in week two is a very expensive lesson.",
        ],
      },
      {
        heading: "Leave behind",
        body: [
          "Anything you are packing ‘just in case’. The first month will teach you what you really need, and you will have space — and budget — to respond.",
        ],
      },
    ],
  },
  {
    slug: "laptop-buying-guide",
    title: "Choosing a Laptop",
    dek: "The only specifications that matter for four years of study.",
    category: "Technology",
    minutes: 8,
    cover: "glass",
    sections: [
      {
        heading: "Battery before speed",
        body: [
          "Most coursework is writing, research and video calls. A machine that lasts a full day away from a socket will serve you better than one that renders video quickly but dies before your afternoon lecture.",
        ],
      },
      {
        heading: "The honest minimums",
        body: [
          "Aim for 8GB of memory, a solid-state drive of at least 256GB, and a screen you can read for hours. Engineering, architecture and computing students should check their department’s software list before buying.",
        ],
      },
      {
        heading: "Protect it like it matters",
        body: [
          "Buy a sleeve, enable a password, and set up automatic backups on day one. Your laptop will hold four years of work; treat it accordingly.",
        ],
      },
    ],
  },
  {
    slug: "first-week",
    title: "Your First Week",
    dek: "A calm, day-by-day guide to orientation.",
    category: "Preparation",
    minutes: 7,
    cover: "morning",
    sections: [
      {
        heading: "Days one and two: settle",
        body: [
          "Unpack the essentials, find water and food, and sleep properly. Registration queues will still be there tomorrow — and they move faster for people who are rested and organised.",
        ],
      },
      {
        heading: "Days three to five: map",
        body: [
          "Walk to every lecture hall on your timetable. Find the library, the health centre, the bank and the quietest place to eat. Knowing where things are removes a surprising amount of anxiety.",
        ],
      },
      {
        heading: "The weekend: connect",
        body: [
          "Say yes to one invitation. Join your departmental group. Call home. The foundation you build in week one is mostly made of people.",
        ],
      },
    ],
  },
  {
    slug: "budget-planning",
    title: "Budgeting, Honestly",
    dek: "A simple system for money that has to last a semester.",
    category: "Money",
    minutes: 6,
    cover: "paper",
    sections: [
      {
        heading: "Divide before you spend",
        body: [
          "When money arrives, split it immediately: fixed costs (rent, fees, transport), weekly living, and a small reserve you do not touch. What remains is genuinely yours to enjoy.",
        ],
      },
      {
        heading: "Track for four weeks",
        body: [
          "You do not need to track forever. Four honest weeks will show you where money actually goes, and that knowledge is enough to change it.",
        ],
      },
    ],
  },
  {
    slug: "time-management",
    title: "Time, Designed",
    dek: "A weekly rhythm that makes room for study, rest and life.",
    category: "Academics",
    minutes: 5,
    cover: "stone",
    sections: [
      {
        heading: "The Sunday review",
        body: [
          "Thirty minutes every Sunday: look at the week ahead, write down every deadline, and choose the three things that matter most. Everything else is optional.",
        ],
      },
      {
        heading: "Protect deep work",
        body: [
          "Two uninterrupted hours of study are worth more than five distracted ones. Put your phone in another room. Put on headphones. Guard the time like a lecture you cannot miss.",
        ],
      },
    ],
  },
  {
    slug: "scholarships",
    title: "Finding Scholarships",
    dek: "Where to look, when to apply and how to stand out.",
    category: "Money",
    minutes: 9,
    cover: "paper",
    sections: [
      {
        heading: "Start close to home",
        body: [
          "Your faculty, your state government, alumni associations and local companies often fund students who simply ask. These awards receive fewer applications than international ones.",
        ],
      },
      {
        heading: "Write one excellent story",
        body: [
          "Draft a single, honest personal statement about where you come from and where you are going. Adapt it for each application rather than starting again.",
        ],
      },
    ],
  },
  {
    slug: "university-life",
    title: "On University Life",
    dek: "Independence, community and the art of becoming.",
    category: "Living",
    minutes: 6,
    cover: "morning",
    sections: [
      {
        heading: "Freedom is a skill",
        body: [
          "For the first time, nobody will ask where you are. That freedom is a gift and a responsibility. The students who flourish build small routines early — waking time, study time, rest — and let everything else stay flexible.",
        ],
      },
      {
        heading: "Find your few",
        body: [
          "You do not need a hundred friends. You need three or four people who will notice if you disappear for a week. Look for them in your department, your hall and the activities you genuinely enjoy.",
        ],
      },
    ],
  },
  {
    slug: "hostel-living",
    title: "Hostel Living",
    dek: "Sharing a room gracefully — and keeping your peace.",
    category: "Living",
    minutes: 5,
    cover: "linen",
    sections: [
      {
        heading: "Agree early",
        body: [
          "In the first week, talk with your roommates about lights-out, visitors and shared items. Five minutes of conversation prevents five months of quiet resentment.",
        ],
      },
      {
        heading: "Own a small, tidy system",
        body: [
          "Storage under the bed, a padlock for valuables, a basket for laundry. When your corner is organised, the whole room feels calmer.",
        ],
      },
    ],
  },
  {
    slug: "mental-wellness",
    title: "Mental Wellness",
    dek: "Looking after your mind through a season of change.",
    category: "Wellbeing",
    minutes: 7,
    cover: "stone",
    sections: [
      {
        heading: "Expect a dip — and plan for it",
        body: [
          "Many students feel a wave of homesickness or doubt around weeks three to six. It is common, and it passes. Knowing it may come makes it much easier to meet.",
        ],
      },
      {
        heading: "Know where support lives",
        body: [
          "Before you need it, find your university’s counselling service and health centre. Save the numbers in your phone. Asking for help early is a sign of preparation, not weakness.",
        ],
      },
    ],
  },
  {
    slug: "academic-success",
    title: "Academic Success",
    dek: "Habits that compound from the first lecture to the final exam.",
    category: "Academics",
    minutes: 8,
    cover: "walnut",
    sections: [
      {
        heading: "Review within a day",
        body: [
          "Ten minutes spent re-reading your notes the same evening does more than an hour of cramming later. Memory is built by returning, not by repeating.",
        ],
      },
      {
        heading: "Ask one question a week",
        body: [
          "In a lecture, in office hours, or by email. Lecturers remember students who engage, and the habit of asking will carry you through every difficult course.",
        ],
      },
    ],
  },
];

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);
