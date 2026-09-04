export const sampleEmail = {
  audience: "Regional operations manager (external partner)",
  purpose: "Request approval to extend the coaching programme pilot by four weeks",
  context:
    "The pilot started on 3 August 2026 with 18 participants. Attendance is at 92% and the mid-point survey scored 4.4/5.",
  keyPoints:
    "- Extension needs sign-off before 15 September 2026\n- No additional budget is required\n- Two extra workshop sessions would be added",
  tone: "Professional",
  length: "Medium",
  outcome: "A written approval or a meeting to discuss the extension",
};

export const sampleMeeting = {
  meetingName: "Quarterly Programme Review",
  date: "2026-08-27",
  participants: "T. Nkosi (Programme Lead), A. Peters (Ops), L. Dlamini (Finance)",
  notes: `Reviewed Q3 delivery. 4 of 5 cohorts completed on schedule; Cohort 5 delayed by venue availability.
A. Peters to confirm a new venue by 5 September.
Finance flagged that travel spend is 12% over plan. L. Dlamini will circulate a revised travel policy draft next week.
Team agreed to move the reporting deadline from the 3rd to the 5th of each month.
Open question: whether Cohort 5 learners get an extended assessment window - no decision taken.
Next review scheduled for the last week of November.`,
};

export const samplePlanner = {
  tasks: `- Finalise Q3 programme report (approx 2 hours)
- Prepare slides for Thursday partner meeting (1.5 hours)
- Review 6 learner assessments (1 hour)
- Respond to outstanding emails (45 minutes)
- Draft venue brief for Cohort 5 (1 hour)`,
  deadlines: "Q3 report due tomorrow 17:00; partner slides due Thursday 09:00",
  startTime: "08:30",
  endTime: "17:00",
  commitments: "Team stand-up 09:00-09:20; lunch 13:00-13:45; 1:1 with A. Peters 15:00-15:30",
  period: "Single day",
};

export const samplePrompt =
  "write something about our new coaching programme for the newsletter";

export const dashboardData = {
  priorities: [
    { task: "Finalise Q3 programme report", due: "Today 17:00", level: "High" as const },
    { task: "Prepare partner meeting slides", due: "Thu 09:00", level: "High" as const },
    { task: "Review 6 learner assessments", due: "Today", level: "Medium" as const },
  ],
  completed: [
    "Sent cohort 4 completion certificates",
    "Approved September travel requests",
    "Summarised Monday leadership stand-up",
  ],
  deadlines: [
    { label: "Cohort 5 venue confirmation", when: "5 Sep 2026" },
    { label: "Revised travel policy draft", when: "8 Sep 2026" },
    { label: "Pilot extension sign-off", when: "15 Sep 2026" },
  ],
  activity: [
    { tool: "Smart Email", detail: "Drafted partner extension request", when: "12 min ago" },
    { tool: "Meeting Summarizer", detail: "Quarterly Programme Review notes", when: "1 hr ago" },
    { tool: "Prompt Coach", detail: "Newsletter prompt scored 42/100", when: "Yesterday" },
    { tool: "Task Planner", detail: "Built Tuesday delivery schedule", when: "Yesterday" },
  ],
};
