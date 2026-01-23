import React from 'react';

export const Impressum = () => {
  return (
    <div className="bg-gray-100 h-full p-6 flex flex-col items-center">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-black-800 mb-4 text-center">
          Impressum
        </h2>
        <p className="text-gray-700 text-center mb-6">
          Verantwortlich für den Inhalt dieser Webseite:
        </p>

        <div className="text-black-700 space-y-4">
          <div>
            <h3 className="font-semibold text-lg">Name:</h3>
            <p>Oussama Mabchour</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">E-Mail:</h3>
            <p>oussama.mabchour@student.hs-rm.de</p>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-bold text-black-800 mb-4">
            Datenverarbeitung
          </h2>
          <p className="text-gray-700 mb-4">
            Auf dieser Plattform speichern und verarbeiten wir personenbezogene
            Daten, um die Funktionen der Anwendung bereitzustellen und zu
            optimieren:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>
              <strong>E-Mail-Adresse:</strong> Wird verwendet, um den Zugang zur
              Plattform zu ermöglichen 
            </li>
            <li>
              <strong>Stundenplan:</strong> Gespeichert, um Ihren persönlichen
              Zeitplan zu verwalten.
            </li>
            <li>
              <strong>Aufgaben:</strong> Dient zur Nachverfolgung und
              Organisation Ihrer Aufgaben.
            </li>
            <li>
              <strong>Technisch notwendige Daten:</strong>
              <ul className="list-disc ml-6">
                <li>
                  Session-Cookies, um Sie als angemeldeten Nutzer zu
                  identifizieren.
                </li>
                <li>
                  IP-Adressen, um unbefugte Zugriffe zu verhindern und die
                  Sicherheit der Plattform zu gewährleisten.
                </li>
              </ul>
            </li>
          </ul>

          <p className="text-gray-700 mt-4">
            Ihre Daten werden ausschließlich für den Betrieb der Plattform
            verwendet und niemals an Dritte weitergegeben. Wir setzen keine
            Tracking-Tools oder Werbung ein.
          </p>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-bold text-black-800 mb-4">Ihre Rechte</h2>
          <p className="text-gray-700 mb-4">
            Sie haben folgende Rechte gemäß der Datenschutz-Grundverordnung
            (DSGVO):
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>
              <strong>Auskunft:</strong> Erfahren Sie, welche Daten über Sie
              gespeichert sind.
            </li>
            <li>
              <strong>Berichtigung:</strong> Lassen Sie unrichtige oder
              unvollständige Daten korrigieren.
            </li>
            <li>
              <strong>Löschung:</strong> Fordern Sie die Löschung Ihrer Daten
              unter bestimmten Voraussetzungen.
            </li>
            <li>
              <strong>Einschränkung der Verarbeitung:</strong> Verlangen Sie die
              Einschränkung der Datenverarbeitung.
            </li>
            <li>
              <strong>Datenübertragbarkeit:</strong> Erhalten Sie Ihre Daten in
              einem maschinenlesbaren Format.
            </li>
            <li>
              <strong>Widerruf der Einwilligung:</strong> Widerrufen Sie eine
              zuvor erteilte Einwilligung.
            </li>
          </ul>
          <p className="text-gray-700 mt-4">
            Um Ihre Rechte wahrzunehmen, kontaktieren Sie uns bitte unter der
            oben genannten E-Mail-Adresse.
          </p>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-bold text-black-800 mb-4">
            Haftungsausschluss
          </h2>
          <p className="text-gray-700">
            Wir übernehmen keine Haftung für die Richtigkeit und Vollständigkeit
            der auf dieser Plattform bereitgestellten Inhalte. Die Nutzung
            erfolgt auf eigenes Risiko.
          </p>
        </div>

        <div className="mt-6 text-gray-600 text-sm text-center">
          <p>Letzte Aktualisierung: {new Date().toLocaleDateString('de-DE')}</p>
        </div>
      </div>
    </div>
  );
};

export default Impressum;
