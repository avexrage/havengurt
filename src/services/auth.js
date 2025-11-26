import { auth as firebaseAuth, googleProvider } from './firebase';
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from 'firebase/auth';

export const auth = {
    // Register a new user
    register: async (name, email, password) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
            const user = userCredential.user;
            await updateProfile(user, { displayName: name });
            return {
                id: user.uid,
                name: user.displayName,
                email: user.email,
                avatar: user.photoURL,
                createdAt: user.metadata.creationTime
            };
        } catch (error) {
            throw new Error(error.message);
        }
    },

    // Login with email/password
    login: async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
            const user = userCredential.user;
            return {
                id: user.uid,
                name: user.displayName,
                email: user.email,
                avatar: user.photoURL,
                createdAt: user.metadata.creationTime
            };
        } catch (error) {
            throw new Error(error.message);
        }
    },

    // Google Login
    loginWithGoogle: async () => {
        try {
            const result = await signInWithPopup(firebaseAuth, googleProvider);
            const user = result.user;
            return {
                id: user.uid,
                name: user.displayName,
                email: user.email,
                avatar: user.photoURL,
                createdAt: user.metadata.creationTime,
                isGoogle: true
            };
        } catch (error) {
            throw new Error(error.message);
        }
    },

    // Logout
    logout: async () => {
        await signOut(firebaseAuth);
    },

    // Subscribe to auth state changes
    onAuthStateChanged: (callback) => {
        return onAuthStateChanged(firebaseAuth, (user) => {
            if (user) {
                callback({
                    id: user.uid,
                    name: user.displayName,
                    email: user.email,
                    avatar: user.photoURL,
                    createdAt: user.metadata.creationTime
                });
            } else {
                callback(null);
            }
        });
    }
};
