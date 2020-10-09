import dayjs from 'dayjs';
import {
  makeObservable, runInAction, action, observable, computed,
} from 'mobx';
import { firebase } from '../firebase/config';
import {
  fetchNews, createCommentInFirestore, getCommentsFromFirestore, convertTimestamp,
} from '../helpers/api';

class NewsStore {
  state = 'pending'

  category = 'business'

  commentState = ''

  comments = []

    news = []

    totalResults = {
      business: 0,
      entertainment: 0,
      general: 0,
      health: 0,
      science: 0,
      sports: 0,
      technology: 0,
    }

    constructor() {
      makeObservable(this, {
        news: observable,
        state: observable,
        category: observable,
        commentState: observable,
        comments: observable,
        fetchNewsItem: action,
        updateNewsItem: action,
        createComment: action,
        fetchComments: action,
      });
    }

    fetchNewsItem = async (category) => {
      this.news = [];
      this.state = 'pending';
      this.category = category;
      try {
        const newsDetails = await fetchNews(category);
        const updatedNews = newsDetails.articles.map((item) => {
          const postedAt = dayjs(item.publishedAt).format('dddd DD MMMM YYYY');
          return {
            ...item,
            postedAt,
            type: category,
          };
        });
        runInAction(() => {
          this.state = 'done';
          this.totalResults[category] = newsDetails.totalResults;
          this.news = updatedNews;
        });
      } catch (e) {
        runInAction(() => {
          this.state = 'error';
        });
      }
    }

    updateNewsItem = async (category) => {
      this.state = 'pending';
      this.category = category;
      try {
        const newsDetails = await fetchNews(category);
        let updatedNews = newsDetails.articles.map((item) => {
          const postedAt = dayjs(item.publishedAt).format('dddd DD MMMM YYYY');
          return {
            ...item,
            postedAt,
            type: category,
          };
        });

        updatedNews = updatedNews.filter((item) => {
          const foundItem = this.news.find((itemInState) => itemInState.type === item.type && itemInState.title === item.title);
          if (foundItem) {
            return false;
          }
          return true;
        });

        runInAction(() => {
          this.state = 'done';
          this.news = [...this.news, ...updatedNews];
          this.totalResults[category] = newsDetails.totalResults;
        });
      } catch (e) {
        runInAction(() => {
          this.state = 'error';
        });
      }
    }

    createComment = async (commentData) => {
      this.commentState = 'pending';
      const id = await createCommentInFirestore(commentData);

      if (!id) {
        runInAction(() => {
          this.commentState = 'error';
        });
        return;
      }

      const postedAt = firebase.firestore.Timestamp.now();
      const fullTime = convertTimestamp(postedAt, 'hh:mm A');
      const fullDate = convertTimestamp(postedAt, 'dddd DD MMMM YYYY');

      const newComment = {
        comment: commentData.comment,
        postedAt,
        fullTime,
        fullDate,

      };

      runInAction(() => {
        this.comments = [newComment, ...this.comments];
        this.commentState = 'done';
      });
    }

    fetchComments = async (type, title) => {
      const fetchedComments = await getCommentsFromFirestore(type, title);

      if (!fetchedComments) {
        runInAction(() => {
          this.commentState = 'error';
          this.comments = [];
        });
        return;
      }

      if (fetchedComments.length === 0) {
        runInAction(() => {
          this.commentState = 'error';
          this.comments = [];
        });
        return;
      }

      const updatedComments = fetchedComments.map((item) => {
        const newTime = convertTimestamp(item.postedAt, 'hh:mm A');
        const newDate = convertTimestamp(item.postedAt, 'dddd DD MMMM YYYY');
        return {
          ...item,
          fullTime: newTime,
          fullDate: newDate,
        };
      });

      runInAction(() => {
        this.comments = updatedComments;
      });
    }
}

const store = new NewsStore();
export {
  store,
};
