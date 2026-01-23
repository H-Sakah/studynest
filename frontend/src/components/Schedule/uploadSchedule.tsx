import { useState } from 'react';
import ArrowLeft from '../../icons/arrowLeft.svg';
import ArrowRight from '../../icons/arrowRight.svg';
interface ScheduleItem {
  time: string;
  description: string;
}

interface UploadScheduleProps {
  upload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  toggleCollapse: () => void;
}

interface DaySchedule {
  day: string;
  items: ScheduleItem[];
}

const exampleSchedule: DaySchedule[] = [
  {
    day: 'Montag',
    items: [
      {
        time: '8:15 - 9:45',
        description: 'Wahlprojekt (Praktikum) Raum UDE-C037',
      },
      { time: '14:15 - 15:45', description: 'Fachseminar Raum UDE-C405' },
      { time: '16:00 - 17:30', description: 'Fachseminar Raum UDE-C405' },
    ],
  },
  {
    day: 'Dienstag',
    items: [
      { time: '8:15 - 9:45', description: 'Fachseminar Raum UDE-C405' },
      { time: '10:00 - 11:30', description: 'Vorlesung Raum UDE-A101' },
      { time: '16:00 - 17:30', description: 'Praktikum Raum UDE-C202' },
    ],
  },
  {
    day: 'Mittwoch',
    items: [
      { time: '8:15 - 9:45', description: 'Fachseminar Raum UDE-C407' },
      { time: '11:45 - 13:15', description: 'Fachseminar Raum UDE-C407' },
      {
        time: '14:15 - 15:45',
        description: 'Kapitel der Wirtschaftsinformatik Raum UDE-C407',
      },
    ],
  },
  {
    day: 'Donnerstag',
    items: [
      { time: '8:15 - 9:45', description: 'Wahlprojekt Raum UDE-C037' },
      { time: '10:00 - 11:30', description: 'Vorlesung Raum UDE-C037' },
      {
        time: '14:15 - 15:45',
        description: 'Kapitel der Wirtschaftsinformatik Raum UDE-C405',
      },
    ],
  },
];

export const UploadSchedule = ({ upload }: UploadScheduleProps) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isCollapsedFAQ, setIsCollapsedFAQ] = useState(false);
  const [showExample, setShowExample] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div
      className={`fixed top-0 right-0 h-screen overflow-y-auto transition-all duration-300 bg-gray-100 ${
        isCollapsed ? 'w-16' : 'w-2/6'
      }`}
    >
      {!isCollapsed && (
        <div className="p-6">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl">
            <h2 className="text-2xl font-bold text-black-800 mb-4 text-center">
              Veranstaltungsplan hochladen
            </h2>
            <p className="text-gray-700 text-center mb-6">
              Lade deinen Stundenplan hoch, um eine Übersicht über deine Termine
              zu erhalten. Mit wenigen Klicks bist du organisiert!
            </p>
            <div className="bg-customBeige rounded-lg shadow-sm p-4 mb-6">
              {/* Collapsible FAQ Header */}
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setIsCollapsedFAQ(!isCollapsedFAQ)}
              >
                <h3 className="text-lg font-semibold text-800">
                  Wie bekomme ich meinen Stundenplan als .ics Datei?
                </h3>
                <button
                  className="text-800 focus:outline-none"
                  aria-expanded={isCollapsedFAQ}
                >
                  {isCollapsedFAQ ? (
                    <span>&#x25B2; {/* Up Arrow */}</span>
                  ) : (
                    <span>&#x25BC; {/* Down Arrow */}</span>
                  )}
                </button>
              </div>

              {/* Collapsible FAQ Content */}
              {isCollapsedFAQ && (
                <div className="mt-4 text-black-700">
                  <p>
                    Kopiere dir den folgenden Link
                    <span className="text-gray">
                      {' '}
                      (wenn du darauf klickst, wird der Link automatisch
                      kopiert)
                    </span>{' '}
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          'https://aor.cs.hs-rm.de/plans.ics?user_plan=true'
                        );
                        alert('Der Link wurde kopiert!');
                      }}
                      className="text-blue-600 underline focus:outline-none"
                    >
                      https://aor.cs.hs-rm.de/plans.ics?user_plan=true
                    </button>{' '}
                    in die Adresszeile. Dort meldest du dich an und bekommst die
                    Datei direkt heruntergeladen.
                  </p>
                  <p className="mt-2 text-sm">
                    <strong>Hinweis:</strong> Die Hochschulseite erlaubt direkte
                    Links leider nicht. Daher musst du den Link manuell
                    einfügen.
                  </p>
                </div>
              )}
            </div>

            {/* File Upload */}
            <div className="text-center">
              <input
                type="file"
                accept=".ics"
                className="block mx-auto my-4 p-2 border border-gray-400 rounded text-gray-600"
                onChange={upload}
              />
            </div>

            {/* Show Example Button */}
            <div className="text-center mt-6">
              <button
                className="bg-customBeige text-black px-6 py-2 rounded-lg hover:bg-customBrown focus:ring-2 focus:ring-customGray"
                onClick={() => setShowExample(!showExample)}
              >
                {showExample ? 'Beispiel ausblenden' : 'Beispiel anzeigen'}
              </button>
            </div>

            {/* Example Schedule */}
            {showExample && (
              <div className="mt-6 bg-customBeige p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-800 mb-4">
                  Beispiel-Stundenplan
                </h3>
                {exampleSchedule.map((day, index) => (
                  <div key={index} className="mb-4">
                    <h4 className="font-bold text-700 mb-2">{day.day}</h4>
                    <ul className="space-y-2">
                      {day.items.map((item: ScheduleItem, idx: number) => (
                        <li
                          key={idx}
                          className="flex justify-between items-center text-gray-700 border-b border-customBrown-200 pb-2"
                        >
                          <span className="font-medium">{item.time}</span>
                          <span>{item.description}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Collapse Button */}
      <button
        className="absolute bottom-20 left-4 bg-gray-300 rounded p-2 hover:bg-customBeige transition-all focus:ring-2 focus:ring-gray-300"
        onClick={toggleCollapse}
      >
        {isCollapsed ? <ArrowLeft /> : <ArrowRight />}
      </button>
    </div>
  );
};