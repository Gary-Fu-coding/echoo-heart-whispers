
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';

interface SubjectQuestionsProps {
  subject: string;
  grade: string;
  onSelectPrompt: (prompt: string) => void;
}

// Example questions for different subjects
const questionsBySubject: Record<string, string[]> = {
  "Mathematics": [
    "Can you explain how to solve quadratic equations?",
    "What's the difference between mean, median, and mode?",
    "How do I calculate the area of a circle?"
  ],
  "Science": [
    "Can you explain the water cycle?",
    "How does photosynthesis work?",
    "What's the difference between a chemical and physical change?"
  ],
  "Language Arts": [
    "How do I write a strong thesis statement?",
    "Can you explain the difference between metaphors and similes?",
    "What are some strategies for analyzing a poem?"
  ],
  "Social Studies": [
    "What were the main causes of World War II?",
    "Can you explain the three branches of government?",
    "How did the Industrial Revolution change society?"
  ],
  "Computer Science": [
    "How do I create a simple 'for' loop in Python?",
    "What's the difference between HTML, CSS, and JavaScript?",
    "Can you explain what an algorithm is?"
  ],
  "Foreign Languages": [
    "What are some common greetings in Spanish?",
    "How does verb conjugation work?",
    "What's the best way to practice pronunciation?"
  ],
  "Art & Music": [
    "Can you explain the color theory?",
    "What are the elements of composition in visual art?",
    "How do musical scales work?"
  ],
  "Physical Education": [
    "What's the importance of warming up before exercise?",
    "Can you explain the rules of basketball?",
    "What are some exercises to improve flexibility?"
  ]
};

// More specialized questions for different grade levels
const customizeByGrade = (question: string, grade: string): string => {
  if (grade.includes("Elementary")) {
    return question.replace(/complex terms|advanced concepts/g, "simple terms");
  } else if (grade.includes("High School") || grade.includes("College")) {
    return question.replace(/basic|simple/g, "detailed");
  }
  return question;
};

const SubjectQuestions: React.FC<SubjectQuestionsProps> = ({ subject, grade, onSelectPrompt }) => {
  // Get questions for the selected subject or default to math
  const questions = questionsBySubject[subject] || questionsBySubject["Mathematics"];
  
  // Customize questions based on grade level
  const customizedQuestions = questions.map(q => customizeByGrade(q, grade));

  return (
    <div className="my-4">
      <div className="flex items-center gap-2 mb-2">
        <Lightbulb className="text-yellow-500" size={16} />
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Example questions to get started:
        </h3>
      </div>
      <div className="grid gap-2">
        {customizedQuestions.map((question, index) => (
          <Card 
            key={index} 
            className="bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800/30 hover:bg-blue-100/50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer"
            onClick={() => onSelectPrompt(question)}
          >
            <CardContent className="p-3">
              <p className="text-sm text-gray-700 dark:text-gray-300">{question}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SubjectQuestions;
