import { CourseTerm, MessageObjType, Section } from "@polylink/shared/types";

export const mockMessages: MessageObjType[] = [
  {
    id: "msg1",
    sender: "user",
    text: "Hey! Can you help me understand how machine learning works?",
    userReaction: null,
  },
  {
    id: "msg2",
    sender: "bot",
    text: "Of course! Machine learning is like teaching computers to learn from examples, similar to how humans learn from experience. Would you like me to break down the basic concepts?",
    urlPhoto: "https://example.com/ai-avatar.jpg",
    userReaction: "like",
  },
  {
    id: "msg3",
    sender: "user",
    text: "Yes, please! Can you give me a simple example?",
    userReaction: null,
  },
  {
    id: "msg4",
    sender: "bot",
    text: "Think of it like teaching a computer to recognize cats. You show it thousands of cat pictures, and it learns the patterns - whiskers, pointy ears, fur. Then it can identify new cat pictures it's never seen before! This is called supervised learning.",
    urlPhoto: "https://example.com/ai-avatar.jpg",
    userReaction: null,
  },
  {
    id: "msg5",
    sender: "user",
    text: "That makes sense! What about neural networks?",
    userReaction: null,
  },
  {
    id: "msg6",
    sender: "bot",
    text: "Neural networks are inspired by how our brains work! Imagine a complex web of interconnected nodes, each making simple decisions that add up to solve complex problems. They're particularly good at tasks like image recognition and language processing.",
    urlPhoto: "https://example.com/ai-avatar.jpg",
    userReaction: "like",
    thinkingState: false,
  },
];

export const mockSections: Section[] = [
  {
    classNumber: 1234,
    courseName: "Test Class",
    term: "spring2025" as CourseTerm,
    courseId: "COURSE1",
    subject: "TEST",
    catalogNumber: "101",
    component: "LEC",
    description: "Test Description",
    prerequisites: null,
    units: "3",
    enrollmentStatus: "O",
    enrollment: {
      waitTotal: 0,
      waitCap: 0,
      classCapacity: 100,
      enrollmentTotal: 50,
      enrollmentAvailable: 50,
      enrollmentStatusDescription: "Open",
    },
    instructionMode: "PA",
    courseAttributes: [],
    meetings: [],
    instructors: [],
    instructorsWithRatings: null,
    techElectives: [],
    classPair: null,
    isCreditNoCredit: false,
  },
] as Section[];
