import axios from 'axios';

export const AddModulePopup = ({
  isOpen,
  onClose,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newLink: { title: string; link: string; src?: string }) => void;
}) => {
  if (!isOpen) return null;

  async function isLinkValid(link: string): Promise<boolean> {
    try {
      const response = await axios.post('http://localhost:4000/check_url', {
        url: link,
      });

      return response.status >= 200 && response.status < 400;
    } catch (error) {
      return false;
    }
  }

  function adjustLink(link: string): string {
    if (!link.startsWith('http')) {
      link = `http://${link}`;
    }
    if (!link.match(/\.[a-z]{2,3}$/)) {
      link = link.split('/')[0] + '//' + link.split('/')[2];
    }
    return link;
  }

  
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.id === 'popup-overlay') {
      onClose(); 
    }
  };

  return (
    <div
      id="popup-overlay" 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-all duration-300 ease-in-out"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-white rounded-xl p-6 shadow-2xl max-w-lg w-full relative animate-scaleIn"
        onClick={(e) => e.stopPropagation()} 
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Neues Modul hinzufügen
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const title = (e.target as HTMLFormElement).elements.namedItem(
              'title'
            ) as HTMLInputElement;
            const link = (e.target as HTMLFormElement).elements.namedItem(
              'link'
            ) as HTMLInputElement;
            link.value = adjustLink(link.value);

            isLinkValid(link.value).then((isValid) => {
              console.log(isValid);
              if (isValid) {
                if (title.value && link.value) {
                  onSave({ title: title.value, link: link.value });
                  onClose();
                }
              } else {
                const message = `Möchtest Du den Link von ${title.value} als ${link.value} speichern?`;
                const answer = window.confirm(message);
                if (answer) {
                  onSave({ title: title.value, link: link.value });
                  onClose();
                } else {
                  alert('Bitte fülle alle Felder aus.');
                }
              }
            });
          }}
        >
          <div className="mb-4">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-red-500 hover:text-gray-800 focus:outline-none"
              aria-label="Close Modal"
            >
              ✖
            </button>
            <label
              htmlFor="title"
              className="block text-base font-semibold text-gray-700"
            >
              Titel <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Titel..."
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="link"
              className="block text-base font-semibold text-gray-700"
            >
              Link <span className="text-red-500">*</span>
            </label>
            <input
              id="link"
              name="link"
              type="text"
              placeholder="Link..."
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="
                flex
                items-center
                justify-center
                gap-2
                px-6
                py-2
                rounded-full
                font-medium
                uppercase
                text-white
                bg-gradient-to-r
                from-blue-500
                to-indigo-500
                hover:from-blue-600
                hover:to-indigo-600
                shadow
                hover:shadow-lg
                transform
                transition
                duration-300
                ease-in-out
                focus:outline-none
                focus:ring-2
                focus:ring-blue-300"
            >
              Link erstellen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
