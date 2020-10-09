import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { NewsContext } from '../context/newsContext';

const CommentItem = ({ comment, postedAt, postedOn }) => (
  <div className="text-blue-900 flex flex-col mb-4 border-b-2 py-2">
    <p className="text-base mb-2 text-justify">{comment}</p>
    <p className="text-sm text-red-600 font-semibold text-right">{postedOn} at {postedAt}</p>
  </div>
);

const Comment = observer(({type, title}) => {
  const newsStore = useContext(NewsContext)

  const [comment, setComment] = useState('')
  const handleSubmitComment = async (e) => {
    e.preventDefault()

    const commentData = {
      type,
      title,
      comment,
    }

    await newsStore.createComment(commentData)

    setComment('')
  };

  const handleChange = (e) => {
    const {value } = e.target
    setComment(value)
  }

  const getComments = async () => {
    await newsStore.fetchComments(type, title)
  }

  useEffect(() => {
    getComments()
  }, [title, type])

  return (
    <div style={{ minHeight: '300px' }} className="flex flex-col">
      <form className="flex flex-col md:flex-row items-center justify-between mb-8" onSubmit={handleSubmitComment}>
        <textarea className=" md:mr-2 mr-0 mb-4 md:mb-0 border-2 border-blue-100 rounded-md p-2 w-full md:w-5/6" rows={5} value={comment} onChange={handleChange} placeholder="Leave a comment" required />
        <button type="submit" className="text-white bg-blue-900 px-6 py-2 rounded-md">{newsStore.commentState === 'pending' ? 'Commenting' : 'Comment'}</button>
      </form>
      <div className="flex flex-col">
        {newsStore.comments.map((item) => <CommentItem key={`${item.comment}-${item.postedAt}`} comment={item.comment} postedOn={item.fullDate} postedAt={item.fullTime}/>)}
      </div>
    </div>
  );
}
)

export default Comment;
