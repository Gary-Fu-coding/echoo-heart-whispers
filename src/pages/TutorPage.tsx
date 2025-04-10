
import React, { useState } from 'react';
import { Book, GraduationCap, ArrowRight, School } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

const grades = [
  "Elementary (Grades 1-5)",
  "Middle School (Grades 6-8)",
  "High School (Grades 9-12)",
  "College/University",
  "Adult Learning"
];

const subjects = [
  "Mathematics",
  "Science",
  "Language Arts",
  "Social Studies",
  "Computer Science",
  "Foreign Languages",
  "Art & Music",
  "Physical Education"
];

const TutorPage = () => {
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleStartLearning = () => {
    if (!selectedGrade || !selectedSubject) {
      toast({
        title: "Selection required",
        description: "Please select both your grade level and a subject.",
        variant: "destructive",
      });
      return;
    }

    // Set these values in local storage for future reference
    localStorage.setItem('echoo-tutor-grade', selectedGrade);
    localStorage.setItem('echoo-tutor-subject', selectedSubject);
    
    // Navigate back to the chat with the tutor role already set
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 p-4 pt-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
              <GraduationCap className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            AI Tutor Setup
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
            Let me help you learn! Please tell me about your education level and what subject you'd like to study.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card className="bg-white/80 dark:bg-gray-800/50 shadow-md border-blue-100 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <School className="h-5 w-5 text-blue-500" />
                Education Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your grade level" />
                </SelectTrigger>
                <SelectContent>
                  {grades.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 dark:bg-gray-800/50 shadow-md border-blue-100 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5 text-blue-500" />
                Subject
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center">
          <Button 
            onClick={handleStartLearning} 
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
            size="lg"
          >
            Start Learning
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-8 text-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/roles')}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            Go Back to Role Selection
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TutorPage;
