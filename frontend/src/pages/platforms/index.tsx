import { useEffect, useState } from 'react';
import { NameProvider } from '../../components/User/nameContext';
import { AddModulePopup } from '../../components/Platforms/addModuleProp';
import {
  getLinks,
  addLink,
  deleteLink,
} from '../../firebase/firebaseLinksService';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Layout } from '../../components/Layout';
import { Header } from '../../components/Header/header';
import { LinkGrid } from '../../components/Platforms/linkGrid';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
}

export default function Home() {
  const [userData, setUserData] = useState<UserData>({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [links, setLinks] = useState<
    { id: string; title: string; link: string; src?: string }[]
  >([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoadingLinks, setIsLoadingLinks] = useState(true);

  // Benutzer-ID abrufen und Links laden
  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const uid = currentUser.uid;
        setUserId(uid);

        const fetchedLinks = (await getLinks(uid)) as {
          id: string;
          title: string;
          link: string;
          src?: string;
        }[];
        setLinks(fetchedLinks);
      } else {
        setUserId(null);
        setLinks([]);
      }
      setIsLoadingLinks(false);
    });

    return () => unsubscribe();
  }, []);

  // Benutzerdaten abrufen
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/getUser', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          window.location.href = '/login';
        }

        const data = await response.json();
        setUserData(data.user);
      } catch (error) {
        console.error('Fehler beim Laden der Benutzerdaten:', error);
      }
    };

    fetchUserData();
  }, []);

  // Link hinzufügen
  const handleAddLink = async (newLink: {
    title: string;
    link: string;
    src?: string;
  }) => {
    if (!userId) return;
    const docRef = await addLink(userId, newLink);
    setLinks((prevLinks) => [...prevLinks, { id: docRef.id, ...newLink }]);
  };

  // Link entfernen
  const handleRemoveLink = async (id: string) => {
    if (!userId) return;
    await deleteLink(userId, id);
    setLinks((prevLinks) => prevLinks.filter((link) => link.id !== id));
  };

  return (
    <NameProvider value={userData}>
      <Layout userId={userId} userData={userData}>
        {isLoadingLinks ? (
          <div className="text-center text-gray-500">
            Links werden geladen...
          </div>
        ) : (
          <div className="flex mb-10">
            <div className="transition-all duration-300 flex-grow p-4">
              <Header
                addButtonTitle="neuer Link"
                addFunctionOnClick={() => setIsPopupOpen(true)}
              />
              <LinkGrid data={links} onRemove={handleRemoveLink} />
            </div>
          </div>
        )}
        <AddModulePopup
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          onSave={handleAddLink}
        />
      </Layout>
    </NameProvider>
  );
}
