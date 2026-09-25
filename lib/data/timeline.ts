export type Stage = {
  id: string;
  label: string;
  window: string;
  headline: string;
  guidance: string;
  actions: string[];
};

export const stages: Stage[] = [
  {
    id: "acceptance",
    label: "Acceptance",
    window: "12–10 weeks before",
    headline: "Pause. Then make it official.",
    guidance:
      "The letter has arrived. Before anything else, secure your place: accept the offer, pay the acceptance fee, and store every document in one folder you will never lose.",
    actions: ["Accept your admission offer", "Pay acceptance fee and keep the receipt", "Create one folder for every document"],
  },
  {
    id: "planning",
    label: "Planning",
    window: "10–6 weeks before",
    headline: "Turn a big change into a short list.",
    guidance:
      "Decide where you will live, set an honest budget and learn how your university works. The earlier you understand the system, the less it surprises you.",
    actions: ["Choose hostel or off-campus living", "Draft a first-semester budget", "Read your university's fresher guide"],
  },
  {
    id: "packing",
    label: "Packing",
    window: "6–2 weeks before",
    headline: "Pack for the life you will actually live.",
    guidance:
      "Start with the room: bedding, storage, light and power. Then study tools. Then comfort. Anything you are unsure about can wait — campus has shops.",
    actions: ["Build your packing checklist", "Buy essentials, not extras", "Label chargers, bottles and boxes"],
  },
  {
    id: "moving",
    label: "Moving",
    window: "The week before",
    headline: "Arrive early. Arrive rested.",
    guidance:
      "Travel a day ahead if you can. Unpack the essentials first — bed, light, water, charger — and leave the rest for tomorrow.",
    actions: ["Confirm travel and arrival time", "Pack a first-night bag", "Share your location with family"],
  },
  {
    id: "orientation",
    label: "Orientation",
    window: "Week one",
    headline: "Learn the map before you need it.",
    guidance:
      "Walk to your lecture halls, find the library, the health centre and the quietest place to eat. Say yes to invitations; the first friendships form quickly.",
    actions: ["Complete registration and clearance", "Walk every lecture route", "Join your departmental group"],
  },
  {
    id: "first-lecture",
    label: "First Lecture",
    window: "Week two",
    headline: "Sit near the front. Write everything down.",
    guidance:
      "The first lecture sets the tone. Bring a notebook, arrive ten minutes early and note every deadline mentioned — they are rarely repeated.",
    actions: ["Set up your semester planner", "Record every assessment date", "Introduce yourself to one classmate"],
  },
  {
    id: "thriving",
    label: "Thriving",
    window: "Week three onward",
    headline: "Prepared people get to be curious.",
    guidance:
      "With the essentials handled, attention can go where it belongs: learning, people and becoming who you came here to be. Review your plan every Sunday.",
    actions: ["Hold a weekly review", "Track spending against budget", "Protect time for rest"],
  },
];
