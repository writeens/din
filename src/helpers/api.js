import axios from 'axios';
import dayjs from 'dayjs';
import database, { firebase } from '../firebase/config';

const API_KEY = process.env.REACT_APP_API_KEY;
const BASE_URL = 'https://newsapi.org/v2/top-headlines?language=en&country=us';

const fetchNews = async (category) => {
  const URL = `${BASE_URL}&category=${category}&apiKey=${API_KEY}`;
  try {
    const response = await axios.get(URL);
    return response.data;
  } catch (e) {
    console.log(e.response);
    return null;
  }
};

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

const getCommentsFromFirestore = async (type, title) => {
  try {
    const commentsRef = await database.collection('dinComments')
      .where('type', '==', type)
      .where('title', '==', title)
      .get();

    let { comments } = commentsRef.docs[0].data();

    comments = comments.sort((a, b) => b.postedAt.seconds - a.postedAt.seconds);

    return comments;
  } catch (e) {
    console.log(e);
    return null;
  }
};

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
