import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, doc, updateDoc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Database Helpers
export const dbService = {
    // Add Order
    addOrder: async (orderData) => {
        try {
            const docRef = await addDoc(collection(db, "orders"), {
                ...orderData,
                createdAt: new Date().toISOString()
            });
            return { id: docRef.id, ...orderData };
        } catch (e) {
            console.error("Error adding document: ", e);
            throw e;
        }
    },

    // Get All Orders (for Admin)
    getAllOrders: async () => {
        const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    // Get User Orders
    getUserOrders: async (userId) => {
        const q = query(collection(db, "orders"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    // Update Order Status
    updateOrderStatus: async (orderId, status) => {
        const orderRef = doc(db, "orders", orderId);
        await updateDoc(orderRef, { status });
    },

    // Save User
    saveUser: async (user) => {
        try {
            const userRef = doc(db, "users", user.id);
            await setDoc(userRef, {
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                lastLogin: new Date().toISOString(),
                ...user // Spread other properties if any
            }, { merge: true });
        } catch (e) {
            console.error("Error saving user: ", e);
            throw e;
        }
    },

    // Get User
    getUser: async (userId) => {
        try {
            const userRef = doc(db, "users", userId);
            const docSnap = await getDoc(userRef);
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() };
            } else {
                return null;
            }
        } catch (e) {
            console.error("Error getting user: ", e);
            throw e;
        }
    },

    // Get All Products
    getAllProducts: async () => {
        const q = query(collection(db, "products"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    // Seed Products
    seedProducts: async (products) => {
        const batch = []; // Firestore batch is better but let's just loop for simplicity in this helper
        // Actually, let's use setDoc to keep IDs if possible, or just addDoc
        // We want to update if exists.
        // Let's assume we overwrite based on ID if we can, but products from file have numeric IDs.
        // Let's just add them.

        // Better: Check if collection is empty? No, just add.
        // Wait, if we run this multiple times we get duplicates.
        // Let's use setDoc with the ID from the file (converted to string).

        for (const product of products) {
            const { img, ...productData } = product;
            // We need to handle the image. We can't store the imported object/path directly if it's dynamic.
            // But for now, we will store a "imgKey" that maps to the local image map.
            // We need to determine the imgKey from the product.
            // This is tricky because 'img' in product is the resolved path.
            // We will rely on the caller to provide the correct data structure for DB.

            const ref = doc(db, "products", String(product.id));
            await setDoc(ref, productData, { merge: true });
        }
    },

    // Get Admin Settings
    getAdminSettings: async () => {
        const docRef = doc(db, "settings", "admin");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            // Default fallback if DB is empty
            return {
                username: "admin",
                password: "admin", // In production this should be hashed or handled via Auth
                notifiedEmail: "havengurt@gmail.com"
            };
        }
    },

    // Save Admin Settings
    saveAdminSettings: async (settings) => {
        const docRef = doc(db, "settings", "admin");
        await setDoc(docRef, settings, { merge: true });
    },

    // Clear All Orders (Testing only)
    clearAllOrders: async () => {
        const q = query(collection(db, "orders"));
        const snapshot = await getDocs(q);
        const deletePromises = snapshot.docs.map(d => deleteDoc(doc(db, "orders", d.id)));
        await Promise.all(deletePromises);
    }
};
