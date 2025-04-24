export const mockStudents = [
  {
    id: '1',
    name: 'John Smith',
    attentionScore: 85,
    lastActive: '2 minutes ago',
    avgAttention: 82,
    disengagementEvents: 3,
    attentionHistory: [
      { time: '9:00', value: 90 },
      { time: '9:15', value: 85 },
      { time: '9:30', value: 88 },
      { time: '9:45', value: 82 },
      { time: '10:00', value: 85 },
    ],
  },
  {
    id: '2',
    name: 'Emma Wilson',
    attentionScore: 92,
    lastActive: '1 minute ago',
    avgAttention: 89,
    disengagementEvents: 1,
    attentionHistory: [
      { time: '9:00', value: 95 },
      { time: '9:15', value: 90 },
      { time: '9:30', value: 92 },
      { time: '9:45', value: 91 },
      { time: '10:00', value: 92 },
    ],
  },
  {
    id: '3',
    name: 'Michael Brown',
    attentionScore: 45,
    lastActive: '3 minutes ago',
    avgAttention: 48,
    disengagementEvents: 8,
    attentionHistory: [
      { time: '9:00', value: 50 },
      { time: '9:15', value: 45 },
      { time: '9:30', value: 40 },
      { time: '9:45', value: 48 },
      { time: '10:00', value: 45 },
    ],
  },
  {
    id: '4',
    name: 'Sarah Davis',
    attentionScore: 78,
    lastActive: 'Just now',
    avgAttention: 75,
    disengagementEvents: 4,
    attentionHistory: [
      { time: '9:00', value: 80 },
      { time: '9:15', value: 75 },
      { time: '9:30', value: 78 },
      { time: '9:45', value: 76 },
      { time: '10:00', value: 78 },
    ],
  },
  {
    id: '5',
    name: 'James Johnson',
    attentionScore: 65,
    lastActive: '1 minute ago',
    avgAttention: 68,
    disengagementEvents: 5,
    attentionHistory: [
      { time: '9:00', value: 70 },
      { time: '9:15', value: 65 },
      { time: '9:30', value: 68 },
      { time: '9:45', value: 67 },
      { time: '10:00', value: 65 },
    ],
  },
];

export const mockSessions = [
  {
    id: '1',
    subject: 'Mathematics',
    className: 'Math 101',
    date: '2024-03-20',
    duration: '1 hour',
    status: 'completed',
    studentCount: 25,
    engagement: 75,
    peakEngagement: 85,
    engagementData: [
      { time: '9:00', value: 80 },
      { time: '9:15', value: 75 },
      { time: '9:30', value: 85 },
      { time: '9:45', value: 70 },
      { time: '10:00', value: 75 },
    ],
    students: mockStudents,
  },
  {
    id: '2',
    subject: 'Physics',
    className: 'Physics 201',
    date: '2024-03-19',
    duration: '1.5 hours',
    status: 'completed',
    studentCount: 20,
    engagement: 82,
    peakEngagement: 90,
    engagementData: [
      { time: '10:00', value: 85 },
      { time: '10:15', value: 82 },
      { time: '10:30', value: 90 },
      { time: '10:45', value: 88 },
      { time: '11:00', value: 82 },
    ],
    students: mockStudents,
  },
];

export const mockEngagementData = [
  { time: "09:00", value: 85, engagement: 85 },
  { time: "09:15", value: 82, engagement: 82 },
  { time: "09:30", value: 88, engagement: 88 },
  { time: "09:45", value: 90, engagement: 90 },
  { time: "10:00", value: 85, engagement: 85 },
  { time: "10:15", value: 83, engagement: 83 },
  { time: "10:30", value: 87, engagement: 87 },
  { time: "10:45", value: 89, engagement: 89 },
  { time: "11:00", value: 92, engagement: 92 }
];

export const mockMetrics = {
  avgEngagement: {
    value: "85%",
    trend: "up",
    trendValue: "+5%"
  },
  studentsActive: {
    value: "24/25",
    trend: "up",
    trendValue: "+2"
  },
  disengagedCount: {
    value: "3",
    trend: "down",
    trendValue: "-1"
  }
}; 