export type moduleDetailsProps = {
  lecturers: string[];
  deadlines: { name: string; date: string }[];
};

export const moduleData = [
  {
    title: 'Web Engineering',
    tasksCount: 10,
    progress: 80,
    color: 'bg-yellow-300',
    details: {
      lecturers: ['Ansgar Hoyer', 'Yannick Technow'],
      deadlines: [
        { name: 'Abgabetermin', date: '21.01.2024' },
        { name: 'Fachgespräch', date: '31.01.2024' },
      ],
    },
  },
  {
    title: 'Einführung in die Informatik',
    tasksCount: 5,
    progress: 60,
    color: 'bg-cyan-300',
    details: {
      lecturers: ['Max Mustermann'],
      deadlines: [
        { name: 'Abgabetermin', date: 'XX.XX.XXXX' },
        { name: 'Fachgespräch', date: 'XX.XX.XXXX' },
      ],
    },
  },
  {
    title: 'Programmiermethoden',
    tasksCount: 8,
    progress: 90,
    color: 'bg-purple-300',
    details: {
      lecturers: ['Max Mustermann'],
      deadlines: [
        { name: 'Abgabetermin', date: 'XX.XX.XXXX' },
        { name: 'Klausur', date: 'XX.XX.XXXX' },
      ],
    },
  },
  {
    title: 'Business Intelligence',
    tasksCount: 12,
    progress: 50,
    color: 'bg-gray-300',
    details: {
      lecturers: ['Max Mustermann'],
      deadlines: [{ name: 'Abgabetermin', date: 'XX.XX.XXXX' }],
    },
  },
  {
    title: 'Wahlprojekt',
    tasksCount: 3,
    progress: 40,
    color: 'bg-blue-300',
    details: {
      lecturers: ['Max Mustermann'],
      deadlines: [
        { name: 'Abgabetermin', date: 'XX.XX.XXXX' },
        { name: 'Fachgespräch', date: 'XX.XX.XXXX' },
      ],
    },
  },
];
