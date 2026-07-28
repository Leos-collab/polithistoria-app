import { createClient } from '@supabase/supabase-js';
import { Question, UserRegistration } from '../types';
import { DEFAULT_QUESTIONS } from './initialData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const LOCAL_QUESTIONS_KEY = 'app_local_questions_v1';
const LOCAL_USERS_KEY = 'app_local_users_v1';

// --- Local Storage Helpers ---
function getLocalQuestions(): Question[] {
  try {
    const data = localStorage.getItem(LOCAL_QUESTIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Error reading local questions:', err);
    return [];
  }
}

function setLocalQuestions(questions: Question[]): void {
  try {
    localStorage.setItem(LOCAL_QUESTIONS_KEY, JSON.stringify(questions));
  } catch (err) {
    console.error('Error saving local questions:', err);
  }
}

function getLocalUsers(): UserRegistration[] {
  try {
    const data = localStorage.getItem(LOCAL_USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Error reading local users:', err);
    return [];
  }
}

function setLocalUsers(users: UserRegistration[]): void {
  try {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Error saving local users:', err);
  }
}

// --- Questions Management ---
export async function fetchQuestions(): Promise<Question[]> {
  let questions: Question[] = [];

  try {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .order('createdAt', { ascending: true });

    if (error) throw error;
    if (data && data.length > 0) {
      questions = data as Question[];
    }
  } catch (error) {
    console.warn('Supabase fetch failed, falling back to local storage:', error);
  }

  // If Supabase returned nothing, check local storage
  let fromSupabase = questions.length > 0;
  if (!fromSupabase) {
    questions = getLocalQuestions();
  }

  // If still empty, populate with default questions
  if (questions.length === 0) {
    questions = DEFAULT_QUESTIONS;
  }

  // If we didn't get them from Supabase, seed Supabase now (either from local storage or defaults)
  if (!fromSupabase && questions.length > 0) {
    setLocalQuestions(questions);
    
    // Async seed to Supabase
    Promise.all(
      questions.map((q) =>
        supabase
          .from('questions')
          .upsert(q)
          .then(({ error }) => {
            if (error) console.warn('Could not seed question to Supabase:', error);
          })
      )
    );
  } else {
    setLocalQuestions(questions);
  }

  return questions;
}

export async function saveQuestion(question: Question): Promise<void> {
  // 1. Save to Local Storage immediately
  const local = getLocalQuestions();
  const existingIdx = local.findIndex((q) => q.id === question.id);
  let updated: Question[];
  if (existingIdx >= 0) {
    updated = [...local];
    updated[existingIdx] = question;
  } else {
    updated = [...local, question];
  }
  setLocalQuestions(updated);

  // 2. Save to Supabase
  try {
    const { error } = await supabase.from('questions').upsert(question);
    if (error) throw error;
  } catch (err) {
    console.error('Failed to save question to Supabase:', err);
  }
}

export async function deleteQuestion(questionId: string): Promise<void> {
  // 1. Remove from Local Storage
  const local = getLocalQuestions();
  const updated = local.filter((q) => q.id !== questionId);
  setLocalQuestions(updated);

  // 2. Delete from Supabase
  try {
    const { error } = await supabase.from('questions').delete().eq('id', questionId);
    if (error) throw error;
  } catch (err) {
    console.error('Failed to delete question from Supabase:', err);
  }
}

// --- User Registration Management ---
export async function fetchUserRegistrations(): Promise<UserRegistration[]> {
  let users: UserRegistration[] = [];

  try {
    const { data, error } = await supabase
      .from('user_registrations')
      .select('*');

    if (error) throw error;
    if (data && data.length > 0) {
      users = data as UserRegistration[];
    }
  } catch (error) {
    console.warn('Supabase fetch users failed, falling back to local storage:', error);
  }

  if (users.length === 0) {
    users = getLocalUsers();
  } else {
    setLocalUsers(users);
  }

  // Sort by latest created
  return users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function saveUserRegistration(user: UserRegistration): Promise<void> {
  // 1. Save to Local Storage
  const local = getLocalUsers();
  const existingIdx = local.findIndex((u) => u.id === user.id);
  let updated: UserRegistration[];
  if (existingIdx >= 0) {
    updated = [...local];
    updated[existingIdx] = user;
  } else {
    updated = [user, ...local];
  }
  setLocalUsers(updated);

  // 2. Save to Supabase
  try {
    const { error } = await supabase.from('user_registrations').upsert(user);
    if (error) throw error;
  } catch (err) {
    console.error('Failed to save user registration to Supabase:', err);
  }
}
