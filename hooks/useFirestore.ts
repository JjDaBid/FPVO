import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, getDoc, query, where, DocumentData } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

export const useCollection = (collectionName: string) => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        const unsub = onSnapshot(collection(db, collectionName),
            (snapshot) => {
                const results: any[] = [];
                snapshot.docs.forEach((doc) => {
                    results.push({ ...doc.data(), id: doc.id });
                });
                setData(results);
                setLoading(false);
            },
            (err) => {
                console.error(err);
                setError(err.message);
                setLoading(false);
            }
        );

        return () => unsub();
    }, [collectionName]);

    return { data, loading, error };
};

export const useDocument = (collectionName: string, docId: string) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!docId) {
            setLoading(false);
            return;
        }

        const unsub = onSnapshot(doc(db, collectionName, docId),
            (doc) => {
                if (doc.exists()) {
                    setData({ ...doc.data(), id: doc.id });
                } else {
                    setData(null);
                    setError('Document not found');
                }
                setLoading(false);
            },
            (err) => {
                console.error(err);
                setError(err.message);
                setLoading(false);
            }
        );

        return () => unsub();
    }, [collectionName, docId]);

    return { data, loading, error };
}

export const useUserProfile = () => {
    const { currentUser } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) {
            setLoading(false);
            return;
        }

        const unsub = onSnapshot(doc(db, 'users', currentUser.uid), (doc) => {
            if (doc.exists()) {
                setProfile({ ...doc.data(), id: doc.id });
            }
            setLoading(false);
        });

        return () => unsub();
    }, [currentUser]);

    return { profile, loading };
}
