import axios from 'axios';
import dayjs from 'dayjs';
import database, { firebase } from '../firebase/config';

const BASE_URL = 'https://disc-news.herokuapp.com/';

/** FETCH NEWS */
const fetchNews = async (category) => {
  const URL = `${BASE_URL}?category=${category}`;
  try {
    const response = await axios.get(URL);
    return response.data.data;
  } catch (e) {
    console.log(e.response);
    return null;
  }
};

/** CREATE COMMENTS IN FIRESTORE */
const createCommentInFirestore = async (commentData) => {
  try {
    const {
      comment,
      postedAt = firebase.firestore.Timestamp.now(),
      title,
      type,
    } = commentData;

    const commentToFirebase = {
      title,
      type,
      comments: [{
        comment,
        postedAt,
      }],
    };

    const commentRef = await database.collection('dinComments')
      .where('type', '==', type)
      .where('title', '==', title)
      .get();

    if (commentRef.size <= 0) {
      // Create the entry
      const newCommentRef = await database.collection('dinComments').doc();
      commentToFirebase.id = newCommentRef.id;
      await newCommentRef.set(commentToFirebase, { merge: true });

      return newCommentRef.id;
    }

    const iDOfEntryToUpdate = commentRef.docs[0].id;

    const commentUpdateRef = database.collection('dinComments')
      .doc(iDOfEntryToUpdate);

    await commentUpdateRef.update({
      comments: firebase.firestore.FieldValue.arrayUnion({
        comment,
        postedAt,
      }),
    });

    return commentUpdateRef.id;
  } catch (e) {
    console.log(e);
    return null;
  }
};

/** GET COMMENTS FROM FIRESTORE */
const getCommentsFromFirestore = async (type, title) => {
  try {
    const commentsRef = await database.collection('dinComments')
      .where('type', '==', type)
      .where('title', '==', title)
      .get();

    if (commentsRef.size <= 0) {
      return [];
    }
    let { comments } = commentsRef.docs[0].data();

    comments = comments.sort((a, b) => b.postedAt.seconds - a.postedAt.seconds);

    return comments;
  } catch (e) {
    console.log(e);
    return null;
  }
};

/** CONVERT FIREBASE TIMESTAMP TO READABLE FORMAT */
const convertTimestamp = (t, format) => {
  const date = t.toDate();
  return dayjs(date).format(format);
};

export {
  fetchNews,
  createCommentInFirestore,
  getCommentsFromFirestore,
  convertTimestamp,
};
