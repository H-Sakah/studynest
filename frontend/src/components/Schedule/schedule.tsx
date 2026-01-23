import { useState } from 'react';
import { Modal } from '../Modal/modal';
import { ScheduleDay, scheduleDayProps } from './scheduleDay';
import { getGermanDayName } from '../../utils/dateUtils';
import ArrowLeft from '../../icons/arrowLeft.svg';
import ArrowRight from '../../icons/arrowRight.svg';

export type scheduleProps = {
  schedule: scheduleDayProps[];
  handleDeleteSchedule: () => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
};

export const Schedule = ({
  schedule,
  handleDeleteSchedule,
  isCollapsed,
  toggleCollapse,
}: scheduleProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  schedule = sortSchedule(schedule);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const confirmDeleteSchedule = () => {
    handleDeleteSchedule();
    handleCloseModal();
  };

  return (
    <div
      className={`fixed top-0 right-0 h-screen overflow-y-auto transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-3/6'
      } bg-gray-100`}
    >
      {!isCollapsed && (
        <div className="bg-gray-100 h-full p-6">
          <div className="rounded-lg shadow p-6 bg-white">
            <h2 className="text-lg font-semibold text-800 mb-4 text-center">
              Dein Veranstaltungsplan
            </h2>
            {schedule.map((day, index) => (
              <ScheduleDay key={index} day={day.day} items={day.items} />
            ))}
          </div>
          <button
            className="block mx-auto my-4 font-semibold bg-customBeige text-black px-6 py-2 rounded-lg hover:bg-red-500 focus:ring-2 focus:ring-customGray transition-all focus:outline-none"
            onClick={handleOpenModal}
          >
            Bestehenden Plan löschen und neuen hochladen
          </button>
        </div>
      )}

      <button
        className="absolute bottom-20 left-4 bg-gray-300 rounded p-2 hover:bg-customBeige transition-all focus:ring-2 focus:ring-gray-300"
        onClick={toggleCollapse}
      >
        {isCollapsed ? <ArrowLeft /> : <ArrowRight />}
      </button>

      {/* Modal für das Löschen */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h3 className="text-lg font-bold mb-4 text-center">
          Plan wirklich löschen?
        </h3>
        <p className="text-gray-700 mb-6 text-center">
          Möchten Sie den aktuellen Veranstaltungsplan wirklich löschen? Diese
          Aktion kann nicht rückgängig gemacht werden.
        </p>
        <div className="flex justify-center gap-4">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-300 transition-all"
            onClick={confirmDeleteSchedule}
          >
            Löschen
          </button>
          <button
            className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400 focus:ring-2 focus:ring-gray-300 transition-all"
            onClick={handleCloseModal}
          >
            Abbrechen
          </button>
        </div>
      </Modal>
    </div>
  );
};

// Hilfsfunktion, um den Plan nach dem aktuellen Wochentag zu sortieren
function sortSchedule(schedule: scheduleDayProps[]): scheduleDayProps[] {
  let currentDay = new Date().getDay();
  let sortedSchedule: scheduleDayProps[] = [];
  for (let i = 0; i < 7; i++) {
    let day = getGermanDayName(currentDay);
    let scheduleDay_index = findDay(schedule, day);
    if (scheduleDay_index) {
      sortedSchedule.push(scheduleDay_index);
    }
    currentDay++;
    if (currentDay === 7 && sortedSchedule.length !== schedule.length) {
      currentDay = 0;
    }
  }

  return sortedSchedule;
}

// Hilfsfunktion, um den Index des aktuellen Tags zu finden
function findDay(
  schedule: scheduleDayProps[],
  day: string
): scheduleDayProps | undefined {
  return schedule.find((scheduleDay) => scheduleDay.day === day);
}
