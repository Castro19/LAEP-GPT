import { MessageObjType } from "@polylink/shared/types";

export const mockMessages: MessageObjType[] = [
  {
    id: "msg1",
    sender: "user",
    text: "Hey! Can you help me understand how machine learning works?",
    model: "GPT-4",
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
    model: "GPT-4",
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
    model: "GPT-4",
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
