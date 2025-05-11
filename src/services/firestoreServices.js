import { db } from "../firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy, 
  limit,
} from "firebase/firestore";
const quizzesRef = collection(db, "quizzes");

// Fetch a Document by ID
export const getDocumentById = async (collectionName, documentId) => {
  const docRef = doc(db, collectionName, documentId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() }; // Return document data
  } else {
    throw new Error(`${collectionName} not found`);
  }
};

//Fetch All Documents from a Collection
export const getAllDocuments = async (collectionName) => {
  const collectionRef = collection(db, collectionName);
  const q = query(collectionRef);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const getQuizByTopicId = async (topicId) => {
  const q = query(quizzesRef, where("topicId", "==", topicId),where('status', '==', 'approved'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getRecentQuizzes = async (userId) => {
  const userRef = doc(db, "recentQuizzes", userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data().recentQuizzes || [];
  } else {
    return [];
  }
};



// Create Quiz
export const createQuiz = async (quizData) => {
  const newQuiz = {
    ...quizData,
    approved: false, // Default approval status
    createdAt: new Date(),
  };
  const docRef = await addDoc(quizzesRef, newQuiz);
  return { id: docRef.id, ...newQuiz };
};

// Get Single Quiz by ID
export const getQuizById = async (id) => {
  const docSnap = await getDoc(doc(db, "quizzes", id));
  if (!docSnap.exists()) throw new Error("Quiz not found");
  return { id: docSnap.id, ...docSnap.data() };
};

// Get All Quizzes
export const getAllQuizzes = async () => {
  const snapshot = await getDocs(quizzesRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Get Approved Quizzes (for users)
export const getApprovedQuizzes = async () => {
  const q = query(quizzesRef, where("status", "==", "approved"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Get Pending Quizzes (for admin)
export const getPendingQuizzes = async () => {
  const q = query(quizzesRef, where("approved", "==", false));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Approve a Quiz
export const approveQuiz = async (id) => {
  const docRef = doc(db, "quizzes", id);
  await updateDoc(docRef, { approved: true });
};

// Reject/Delete a Quiz
export const rejectQuiz = async (id) => {
  const docRef = doc(db, "quizzes", id);
  await deleteDoc(docRef);
};

// Update Quiz
export const updateQuiz = async (id, updatedData) => {
  const docRef = doc(db, "quizzes", id);
  await updateDoc(docRef, updatedData);
};

// Delete Quiz
export const deleteQuiz = async (id) => {
  const docRef = doc(db, "quizzes", id);
  await deleteDoc(docRef);
};



export const getQuizzesByUser = async (uid) => {
  const q = query(collection(db, "quizzes"), where("createdBy", "==", uid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};


export const getTopics = async () => {
  const q = query(collection(db, 'topics'), orderBy('order'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getQuizzesByTopic = async (topicId) => {
  const q = query(
    collection(db, 'quizzes'),
    where('topicId', '==', topicId),
    where('status', '==', 'approved')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};


export const getUserQuizAttempts = async (userId) => {
  try {
    const q = query(
      collection(db, 'quizAttempts'),
      where('userId', '==', userId),
      orderBy('date', 'desc'),
      limit(10)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching quiz attempts:', error);
    return [];
  }
};

// collection: Topics
export const getAllTopics = async () => {
  const snapshot = await getDocs(collection(db, "topics"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
