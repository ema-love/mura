/**
 * Editorial guides. Written to be useful on their own — products appear only as a
 * quiet suggestion at the end, never as the point of the article.
 */

export type ResourceTopic = "Semester" | "Study" | "Grades" | "Money" | "Opportunities" | "Career";

export type ArticleSection = {
  heading: string;
  body: string[];
  /** Optional list shown after the paragraphs. */
  list?: string[];
  /** Optional worked example, shown as a quiet table. */
  table?: { caption: string; head: string[]; rows: string[][]; foot?: string[] };
};

export type Article = {
  slug: string;
  title: string;
  /** One-line description, used on cards and as the meta description. */
  dek: string;
  topic: ResourceTopic;
  minutes: number;
  publishedAt: string;
  /** Texture used for the editorial cover. */
  cover: "paper" | "linen" | "stone" | "walnut" | "glass" | "morning";
  sections: ArticleSection[];
  /** Product ids offered as a gentle next step. */
  related: string[];
};

export const topics: ResourceTopic[] = ["Semester", "Study", "Grades", "Money", "Opportunities", "Career"];

export const articles: Article[] = [
  {
    slug: "how-to-plan-your-semester",
    title: "How to Plan Your Semester",
    dek: "A calm, one-evening method for seeing the whole semester before it starts.",
    topic: "Semester",
    minutes: 7,
    publishedAt: "2026-09-25",
    cover: "morning",
    related: ["semester-system", "student-reset"],
    sections: [
      {
        heading: "Start with the fixed points",
        body: [
          "Before you plan anything, collect what you can't move: lecture times, lab slots, exam weeks, holidays and any assessment dates already announced. Put them in one place. Most semester stress comes from surprises, and most surprises were written down somewhere you didn't look.",
        ],
        list: ["Your weekly timetable", "Every assessment date in each course outline", "Exam period and holidays", "Work shifts or regular commitments"],
      },
      {
        heading: "Work backwards from deadlines",
        body: [
          "For each major deadline, count back the time it realistically needs and mark a start date. An essay due in week 9 probably needs to begin in week 6. Seeing start dates — not just due dates — is what turns a list of deadlines into a plan.",
        ],
      },
      {
        heading: "Find the crowded weeks early",
        body: [
          "Look across the semester for weeks where several deadlines collide. You can't change them, but you can move work earlier. Knowing in week 1 that week 10 is heavy is the single most useful thing a semester plan can tell you.",
        ],
      },
      {
        heading: "Review it every week",
        body: [
          "A plan made once and never opened is a wish. Take twenty minutes each Sunday to look at the week ahead, adjust for anything new and choose your top three priorities. That short, regular review is what keeps the plan alive.",
        ],
      },
    ],
  },
  {
    slug: "how-to-organize-university-assignments",
    title: "How to Organise University Assignments",
    dek: "One list, clear statuses and a weekly check — a simple system that stops deadlines slipping.",
    topic: "Semester",
    minutes: 6,
    publishedAt: "2026-09-25",
    cover: "paper",
    related: ["assignment-command-center"],
    sections: [
      {
        heading: "Put every assignment in one place",
        body: [
          "Assignments arrive through lectures, learning platforms, emails and group chats. The first rule is simple: the moment you hear about one, write it into a single list. Course, title, due date, weighting. If it isn't on the list, it doesn't exist.",
        ],
      },
      {
        heading: "Give each one a status",
        body: [
          "Three statuses are enough: not started, in progress and done. Being able to see at a glance what hasn't been started is more useful than any colour scheme.",
        ],
      },
      {
        heading: "Sort by what's next, not by course",
        body: [
          "Order your list by due date, then check the weighting. A small quiz due tomorrow and a major project due in three weeks both need attention this week — for different reasons.",
        ],
        list: ["Due within 7 days: work on it now", "Due within 3 weeks and heavily weighted: start it now", "Everything else: schedule a start date"],
      },
      {
        heading: "Break big work into first steps",
        body: [
          "“Write essay” is hard to start. “Find three sources” is easy. For anything larger than an evening's work, write the first concrete step next to it.",
        ],
      },
    ],
  },
  {
    slug: "how-to-prepare-for-exams",
    title: "How to Prepare for Exams",
    dek: "A revision plan built backwards from the exam date, with active recall at its centre.",
    topic: "Study",
    minutes: 8,
    publishedAt: "2026-09-25",
    cover: "stone",
    related: ["exam-prep-system", "revision-kit"],
    sections: [
      {
        heading: "Count the days, then the topics",
        body: [
          "Start with two numbers: how many days until the exam, and how many topics it covers. Divide the topics across the days, leaving the final few days free for past papers and review. Now you know whether you're on track — before it's too late to change anything.",
        ],
      },
      {
        heading: "Test yourself instead of re-reading",
        body: [
          "Re-reading notes feels productive but rarely sticks. Close the book and try to explain the topic, answer questions or rewrite the key points from memory. The effort of recalling is what builds memory.",
        ],
      },
      {
        heading: "Use past papers early",
        body: [
          "Past papers show you what examiners actually ask and how questions are worded. Try one early to find your weak topics, then again near the end under timed conditions.",
        ],
      },
      {
        heading: "Protect the last night",
        body: [
          "Sleep does more for exam performance than one more late session. Plan to finish new material a day or two before, and use the final evening for a light review and an early night.",
        ],
      },
    ],
  },
  {
    slug: "how-to-calculate-your-tgpa",
    title: "How to Calculate Your TGPA",
    dek: "The weighted-average method behind your semester grade point average, with a worked example.",
    topic: "Grades",
    minutes: 6,
    publishedAt: "2026-09-25",
    cover: "glass",
    related: ["grade-tgpa-tracker"],
    sections: [
      {
        heading: "What you need",
        body: [
          "Your grade point average for a term is a weighted average: each course counts in proportion to its credit units. You need three things for every course — its credit units, the grade you received and the grade points that grade is worth on your university's scale.",
        ],
      },
      {
        heading: "The method",
        body: ["Multiply each course's grade points by its credit units. Add those results together, then divide by the total number of credit units."],
        list: ["Grade points × credit units, for every course", "Add the results", "Divide by total credit units"],
      },
      {
        heading: "A worked example",
        body: ["Here's one term on a 5-point scale, where A = 5, B = 4 and C = 3."],
        table: {
          caption: "Example term on a 5-point scale",
          head: ["Course", "Units", "Grade", "Points × units"],
          rows: [
            ["Calculus I", "3", "A (5)", "15"],
            ["Intro to Economics", "3", "B (4)", "12"],
            ["Academic Writing", "2", "A (5)", "10"],
            ["Statistics", "3", "C (3)", "9"],
          ],
          foot: ["Total", "11", "", "46"],
        },
      },
      {
        heading: "Reading the result",
        body: [
          "46 ÷ 11 = 4.18. That's the grade point average for this term. Grading scales and the names used for them vary between universities and countries, so always check your own university's scale and rules — including how repeated or failed courses are counted.",
        ],
      },
    ],
  },
  {
    slug: "how-to-build-a-student-budget",
    title: "How to Build a Student Budget",
    dek: "Divide your money before you spend it, then track honestly for four weeks.",
    topic: "Money",
    minutes: 6,
    publishedAt: "2026-09-25",
    cover: "linen",
    related: ["student-budget"],
    sections: [
      {
        heading: "Start with what actually comes in",
        body: [
          "List every source of money for the semester or month — allowance, part-time work, scholarship payments — and when each arrives. Irregular income is normal for students; knowing the timing matters as much as the amount.",
        ],
      },
      {
        heading: "Divide before you spend",
        body: ["When money arrives, split it straight away into three parts. What's left after the first two is genuinely yours to enjoy."],
        list: ["Fixed costs: rent, fees, transport, phone", "Weekly living: food, printing, small essentials", "A small reserve you don't touch"],
      },
      {
        heading: "Track for four weeks",
        body: [
          "You don't need to track every expense forever. Four honest weeks will show you where your money really goes — and that knowledge is usually enough to change it.",
        ],
      },
      {
        heading: "Plan for the uneven months",
        body: [
          "Some months cost more: the start of term, exam season, travel home. Put a little aside in quieter months so the expensive ones don't arrive as emergencies.",
        ],
      },
    ],
  },
  {
    slug: "how-to-find-scholarships",
    title: "How to Find Scholarships",
    dek: "Where to look, how to keep track and how to write one strong story you can adapt.",
    topic: "Opportunities",
    minutes: 8,
    publishedAt: "2026-09-25",
    cover: "paper",
    related: ["scholarship-tracker"],
    sections: [
      {
        heading: "Look close to home first",
        body: [
          "Your faculty, your university's financial aid office, local government, professional bodies and alumni associations often fund students. These awards usually receive fewer applications than large international ones.",
        ],
      },
      {
        heading: "Keep every opportunity in one list",
        body: ["Scholarships differ in eligibility, documents and deadlines. For each one you find, record:"],
        list: ["Deadline", "Eligibility requirements", "Documents needed (transcripts, references, essays)", "Where and how to apply"],
      },
      {
        heading: "Write one excellent story",
        body: [
          "Draft a single, honest personal statement about where you come from, what you're working towards and why the support matters. Then adapt it for each application instead of starting from nothing each time.",
        ],
      },
      {
        heading: "Ask for references early",
        body: [
          "Referees are busy. Ask at least two weeks before a deadline, and give them a short summary of the scholarship and what you'd like them to mention.",
        ],
      },
    ],
  },
  {
    slug: "how-to-find-internships",
    title: "How to Find Internships",
    dek: "Start early, apply steadily and follow up — a practical approach for students.",
    topic: "Opportunities",
    minutes: 7,
    publishedAt: "2026-09-25",
    cover: "morning",
    related: ["internship-tracker", "cv-kit"],
    sections: [
      {
        heading: "Know the timelines",
        body: [
          "Many larger organisations open internship applications months before they start. Check the timing in your field early, so you're preparing rather than rushing.",
        ],
      },
      {
        heading: "Look beyond job boards",
        body: ["Job boards are only one source. Many opportunities come through:"],
        list: ["Your university's careers service", "Lecturers and departmental notices", "Professional associations and student societies", "People already working where you'd like to be"],
      },
      {
        heading: "Apply steadily, and track everything",
        body: [
          "A few careful applications each week beats a frantic burst. Record where you applied, when, who you spoke to and what happens next. Following up politely after a week or two is normal and often noticed.",
        ],
      },
      {
        heading: "Prepare a few stories",
        body: [
          "Interviews often ask about times you solved a problem, worked in a team or learned something quickly. Prepare three or four short examples from your studies, projects or part-time work.",
        ],
      },
    ],
  },
  {
    slug: "how-to-build-a-student-cv",
    title: "How to Build a Student CV",
    dek: "What counts as experience, how to present it, and how to keep it to one clear page.",
    topic: "Career",
    minutes: 7,
    publishedAt: "2026-09-25",
    cover: "linen",
    related: ["cv-kit"],
    sections: [
      {
        heading: "Experience is more than jobs",
        body: [
          "Projects, volunteering, society roles, competitions, tutoring and part-time work all count. What matters is what you did and what came of it.",
        ],
      },
      {
        heading: "Lead with what you achieved",
        body: ["Write each point as an action and a result, not a duty. Compare:"],
        list: ["Weak: “Responsible for social media”", "Stronger: “Grew the society's Instagram from 300 to 1,200 followers in one semester”"],
      },
      {
        heading: "Keep it to one clear page",
        body: [
          "For most students, one page is right. Use a simple layout, consistent dates and plenty of white space. Recruiters often scan a CV in seconds; clarity is kinder than decoration.",
        ],
      },
      {
        heading: "Tailor it each time",
        body: ["Read the role description and move the most relevant experience to the top. Small changes for each application make a noticeable difference."],
      },
    ],
  },
  {
    slug: "how-to-build-a-student-portfolio",
    title: "How to Build a Student Portfolio",
    dek: "Choose fewer projects, explain your thinking and let the work speak clearly.",
    topic: "Career",
    minutes: 6,
    publishedAt: "2026-09-25",
    cover: "walnut",
    related: ["portfolio-kit", "presentation-kit"],
    sections: [
      {
        heading: "Choose fewer, better projects",
        body: [
          "Three to six strong projects are more convincing than twenty mixed ones. Choose work that shows range and the kind of work you want to do next.",
        ],
      },
      {
        heading: "Show the thinking, not just the result",
        body: ["For each project, explain briefly:"],
        list: ["The problem or brief", "Your role and the decisions you made", "What changed or what you learned"],
      },
      {
        heading: "Make it easy to scan",
        body: [
          "Lead each project with one strong image or a clear summary. Keep text short, captions precise and navigation simple. Anyone reviewing it should understand each project in under a minute.",
        ],
      },
      {
        heading: "Keep it current",
        body: ["Add new work at the end of each semester while it's fresh, and retire older pieces that no longer represent you."],
      },
    ],
  },
];

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);
export const articlesForProduct = (productId: string) => articles.filter((a) => a.related.includes(productId));
