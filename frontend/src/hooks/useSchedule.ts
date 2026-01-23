import { useState, useEffect } from 'react';
import {
  getScheduleDays,
  addSchedule,
  deleteSchedule,
} from '../firebase/firebaseScheduleService';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import ICAL from 'ical.js';

export interface ScheduleItem {
  time: string;
  description: string;
}

export interface Schedule {
  day: string;
  items: ScheduleItem[];
}

export const useSchedule = (userId: string | null) => {
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const parseICSToSchedule = (icsContent: string): Schedule[] => {
    const daysMapping: { [key: number]: string } = {
      1: 'Montag',
      2: 'Dienstag',
      3: 'Mittwoch',
      4: 'Donnerstag',
      5: 'Freitag',
    };

    const parsedData: Schedule[] = [];
    const scheduleData: { [key: string]: ScheduleItem[] } = {};

    const jcalData = ICAL.parse(icsContent);
    const component = new ICAL.Component(jcalData);
    const events = component.getAllSubcomponents('vevent');

    events.forEach((event) => {
      const vevent = new ICAL.Event(event);
      const startDate = vevent.startDate.toJSDate();
      const endDate = vevent.endDate.toJSDate();
      const day = daysMapping[startDate.getDay()];

      if (!day) return;

      const time = `${startDate.getHours()}:${startDate
        .getMinutes()
        .toString()
        .padStart(2, '0')} - ${endDate.getHours()}:${endDate
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;
      let description =
        vevent.description + ' ' + vevent.location || 'No Description';
      description = description
        .replace(/\(Praktikum\)/g, '')
        .replace(/\(Vorlesung\)/g, '')
        .replace(/\(Seminar\)/g, '')
        .replace(/\(Übung\)/g, '')
        //alle Lehrveranstaltungen befinden sich in UDE-Gebäuden
        .replace(/UDE-/g, '')
        .replace(/Fachseminar/g, ' FS')
        .replace(/Praktikum/g, 'P')
        .replace(/Vorlesung/g, 'V')
        .replace(/Übung/g, 'Ü')
        .replace(/Tutorium/g, 'T');

      if (!scheduleData[day]) {
        scheduleData[day] = [];
      }

      scheduleData[day].push({ time, description });
    });

    Object.entries(scheduleData).forEach(([day, items]) => {
      parsedData.push({ day, items });
    });

    return parsedData;
  };

  const handleFileUpload = async (file: File) => {
    if (!userId) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const icsContent = e.target?.result as string;
        const parsedSchedule = parseICSToSchedule(icsContent);
        await addSchedule(userId, parsedSchedule); // Save to Firebase
        setSchedule(parsedSchedule);
      } catch (err) {
        console.error('Fehler bei der Verarbeitung:', err);
      }
    };

    reader.readAsText(file);
  };

  const handleDeleteSchedule = async () => {
    if (!userId) return;
    await deleteSchedule(userId);
    setSchedule([]);
  };

  useEffect(() => {
    const fetchScheduleFromDB = async (uid: string) => {
      const fetchedScheduleData = await getScheduleDays(uid);
      const fetchedSchedule: Schedule[] = fetchedScheduleData.map(
        (doc: any) => ({
          day: doc.day,
          items: doc.items || [],
        })
      );
      setSchedule(fetchedSchedule);
      setIsLoading(false);
    };

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const uid = currentUser.uid;
        if (userId) await fetchScheduleFromDB(uid);
      } else {
        setSchedule([]);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [userId]);

  return { schedule, isLoading, handleFileUpload, handleDeleteSchedule };
};
