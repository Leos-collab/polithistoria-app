import React, { useState, useEffect } from 'react';
import { AppView, Question, UserRegistration, UserAnswer } from './types';
import {
  fetchQuestions,
  saveQuestion,
  deleteQuestion,
  fetchUserRegistrations,
  saveUserRegistration
} from './lib/supabase';
import { HomeScreen } from './components/HomeScreen';
import { QuestionScreen } from './components/QuestionScreen';
import { CompletionScreen } from './components/CompletionScreen';
import { AdmLoginScreen } from './components/AdmLoginScreen';
import { AdmDashboardScreen } from './components/AdmDashboardScreen';
import { AdmQuestionForm } from './components/AdmQuestionForm';
import { AdmQuestionList } from './components/AdmQuestionList';
import { AdmResponsesView } from './components/AdmResponsesView';

export default function App() {
  const [view, setView] = useState<AppView>('home');
  const [siteTitle, setSiteTitle] = useState('POLITHISTÓRIA');

  // Database Data State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userRegistrations, setUserRegistrations] = useState<UserRegistration[]>([]);
  const [loading, setLoading] = useState(true);

  // Active User session
  const [activeUser, setActiveUser] = useState<{ name: string; birthDate: string } | null>(null);
  const [completedRegistration, setCompletedRegistration] = useState<UserRegistration | null>(
    null
  );

  // ADM editing target
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // Load initial data from Firebase Firestore / Local Storage
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [qData, uData] = await Promise.all([
          fetchQuestions(),
          fetchUserRegistrations()
        ]);
        setQuestions(qData);
        setUserRegistrations(uData);
      } catch (err) {
        console.error('Error loading initial data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Handlers for User Flow
  const handleStartQuestionnaire = (name: string, birthDate: string) => {
    setActiveUser({ name, birthDate });
    setView('questionnaire');
  };

  const handleCompleteQuestionnaire = async (answers: UserAnswer[]) => {
    if (!activeUser) return;

    const newRegistration: UserRegistration = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name: activeUser.name,
      birthDate: activeUser.birthDate,
      createdAt: new Date().toISOString(),
      answers,
      completed: true
    };

    setCompletedRegistration(newRegistration);

    // Save to Firestore and Local Storage
    await saveUserRegistration(newRegistration);

    // Refresh list in memory
    const updatedUsers = await fetchUserRegistrations();
    setUserRegistrations(updatedUsers);

    setView('completion');
  };

  // Handlers for ADM Flow
  const handleSaveQuestion = async (q: Question) => {
    await saveQuestion(q);
    const updated = await fetchQuestions();
    setQuestions(updated);
    setEditingQuestion(null);
    setView('adm_edit_question');
  };

  const handleDeleteQuestion = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta pergunta?')) {
      await deleteQuestion(id);
      const updated = await fetchQuestions();
      setQuestions(updated);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 border-4 border-sky-400 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-zinc-400 text-sm font-medium animate-pulse">
          Carregando dados do Supabase e Banco de Dados Local...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 font-sans antialiased text-zinc-100">
      {/* 1. Home Screen */}
      {view === 'home' && (
        <HomeScreen
          siteTitle={siteTitle}
          onStart={handleStartQuestionnaire}
          onGoToAdm={() => setView('adm_login')}
        />
      )}

      {/* 2. Questionnaire Screen */}
      {view === 'questionnaire' && activeUser && (
        <QuestionScreen
          userName={activeUser.name}
          userBirthDate={activeUser.birthDate}
          questions={questions}
          onComplete={handleCompleteQuestionnaire}
          onCancel={() => setView('home')}
        />
      )}

      {/* 3. Completion Screen */}
      {view === 'completion' && completedRegistration && (
        <CompletionScreen
          userReg={completedRegistration}
          onRestart={() => setView('home')}
        />
      )}

      {/* 4. ADM Login Screen */}
      {view === 'adm_login' && (
        <AdmLoginScreen
          onLoginSuccess={() => setView('adm_dashboard')}
          onBack={() => setView('home')}
        />
      )}

      {/* 5. ADM Dashboard Screen */}
      {view === 'adm_dashboard' && (
        <AdmDashboardScreen
          onCreateQuestion={() => {
            setEditingQuestion(null);
            setView('adm_create_question');
          }}
          onEditQuestions={() => setView('adm_edit_question')}
          onViewResponses={() => setView('adm_responses')}
          onLogout={() => setView('home')}
        />
      )}

      {/* 6. ADM Create Question */}
      {view === 'adm_create_question' && (
        <AdmQuestionForm
          initialQuestion={editingQuestion}
          onSave={handleSaveQuestion}
          onCancel={() => setView('adm_dashboard')}
        />
      )}

      {/* 7. ADM Edit Question List */}
      {view === 'adm_edit_question' && (
        <AdmQuestionList
          questions={questions}
          onSelectEdit={(q) => {
            setEditingQuestion(q);
            setView('adm_create_question');
          }}
          onDelete={handleDeleteQuestion}
          onCreateNew={() => {
            setEditingQuestion(null);
            setView('adm_create_question');
          }}
          onBack={() => setView('adm_dashboard')}
        />
      )}

      {/* 8. ADM User Responses View */}
      {view === 'adm_responses' && (
        <AdmResponsesView
          userRegistrations={userRegistrations}
          questions={questions}
          onBack={() => setView('adm_dashboard')}
        />
      )}
    </div>
  );
}
