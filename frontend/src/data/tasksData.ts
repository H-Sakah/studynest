import { Task } from '../components/Tasks/types';

export const tasksData: Task[] = [
  {
    id: 'task-1',
    title: 'UI Mockup',
    description: 'Figma Mockup für die Startseite erstellen',
    color: 'bg-yellow-300',
    columnId: 'todo',
    moduleTitle: 'Web Engineering',
  },
  {
    id: 'task-2',
    title: 'Terminrecherche',
    description: 'Termine bei Prof Mustermann klären',
    color: 'bg-cyan-300',
    columnId: 'todo',
    moduleTitle: 'Einführung in die Informatik',
  },
  {
    id: 'task-3',
    title: 'Refactoring',
    description: 'Code-Struktur verbessern',
    color: 'bg-purple-300',
    columnId: 'in-progress',
    moduleTitle: 'Programmiermethoden',
  },
  {
    id: 'task-4',
    title: 'Projekt planen',
    description: 'Aufgabenpakete definieren und ToDo-Liste erstellen',
    color: 'bg-yellow-300',
    columnId: 'done',
    moduleTitle: 'Business Intelligence',
  },
  {
    id: 'task-5',
    title: 'Dokumentation',
    description: 'Erste Ergebnisse in Word protokollieren',
    color: 'bg-cyan-300',
    columnId: 'done',
    moduleTitle: 'Wahlprojekt',
  },
];
