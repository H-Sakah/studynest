import ReactDOM from 'react-dom';

export const LogoutPopup = ({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.id === 'popup-overlay') {
      onClose();
    }
  };

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-all duration-300 ease-in-out animate-fadeIn"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-white p-6 rounded shadow-lg max-w-full w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">Abmelden bestätigen</h2>
        <p className="mb-4">Möchten Sie sich wirklich abmelden?</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 mr-2"
          >
            Abbrechen
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            type="button"
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Abmelden
          </button>
        </div>
      </div>
    </div>,
    document.body // Rendert außerhalb des DOM-Baums, das brauchen wir, damit der Inhalt von Links und Modulen nicht das Logout-Popup verdeckt
  );
};
