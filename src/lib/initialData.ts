import { Question } from '../types';

export const DEFAULT_QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: 'Qual destas civilizações antigas construiu as Grandes Pirâmides de Gizé?',
    imageUrl: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=800&q=80',
    options: [
      'Império Romano',
      'Antigo Egito',
      'Grécia Antiga',
      'Império Maia'
    ],
    correctOptionIndex: 1,
    createdAt: Date.now() - 3000
  },
  {
    id: 'q2',
    text: 'Em qual cidade dos Estados Unidos fica localizada a Capitólio Nacional?',
    imageUrl: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80',
    options: [
      'Nova Iorque',
      'Los Angeles',
      'Washington, D.C.',
      'Chicago'
    ],
    correctOptionIndex: 2,
    createdAt: Date.now() - 2000
  },
  {
    id: 'q3',
    text: 'Qual elemento químico possui o símbolo "O" na tabela periódica?',
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
    options: [
      'Ouro',
      'Osfólio',
      'Oxigênio',
      'Ozônio'
    ],
    correctOptionIndex: 2,
    createdAt: Date.now() - 1000
  }
];

export const DEFAULT_ADMIN_CREDENTIALS = {
  username: 'leonardo estivalet',
  password: 'leo1406'
};
