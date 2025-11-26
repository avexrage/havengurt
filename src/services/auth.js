import { auth as firebaseAuth, googleProvider, dbService } from './firebase';
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from 'firebase/auth';

export const auth = {
    // Register a new user
    register: async (name, email, password) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
            const user = userCredential.user;
            await updateProfile(user, { displayName: name });
            const userData = {
                id: user.uid,
                name: user.displayName,
                email: user.email,
                avatar: user.photoURL,
                createdAt: user.metadata.creationTime
            };
            await dbService.saveUser(userData);
            return userData;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    // Login with email/password
    login: async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
            const user = userCredential.user;
            const userData = {
                id: user.uid,
                name: user.displayName,
                email: user.email,
                avatar: user.photoURL,
                createdAt: user.metadata.creationTime
            };
            await dbService.saveUser(userData);
            return userData;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    // Google Login
    loginWithGoogle: async () => {
        try {
            const result = await signInWithPopup(firebaseAuth, googleProvider);
            const user = result.user;
            const userData = {
                id: user.uid,
                name: user.displayName,
                email: user.email,
                avatar: user.photoURL,
                createdAt: user.metadata.creationTime,
                isGoogle: true
            };
            await dbService.saveUser(userData);
            return userData;
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
        return onAuthStateChanged(firebaseAuth, async (user) => {
            if (user) {
                try {
                    const dbUser = await dbService.getUser(user.uid);
                    if (dbUser) {
                        callback(dbUser);
                    } else {
                        // User exists in Auth but not in DB (e.g. first login or DB was created later)
                        // Save them now!
                        const userData = {
                            id: user.uid,
                            name: user.displayName || 'User',
                            email: user.email,
                            avatar: user.photoURL,
                            createdAt: user.metadata.creationTime
                        };
                        await dbService.saveUser(userData);
                        console.log("User synced to database:", userData);
                        callback(userData);
                    }
                } catch (error) {
                    console.error("Error fetching/saving user data:", error);
                    // Fallback to basic auth data
                    callback({
                        id: user.uid,
                        name: user.displayName,
                        email: user.email,
                        avatar: user.photoURL,
                        createdAt: user.metadata.creationTime
                    });
                }
            } else {
                callback(null);
            }
        });
    }
};
