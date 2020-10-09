import React, {useContext, useEffect, useState} from 'react';
import Nav from './Nav';
import Comment from './Comment';
import LeftIcon from '../assets/Orion_arrow-left.svg';
import { NewsContext } from '../context/newsContext';
import { observer } from 'mobx-react-lite';

const NewsDetail = observer(({ details, handleNavigation }) => {
  const newsStore = useContext(NewsContext)

  const [data, setData] = useState({})
  
  useEffect(() => {
    const detail = newsStore.news.find((item) => item.type === details.type && item.title === details.title)
    setData(detail)
  }, [details])


  return (
    <div className="flex flex-col bg-gray-300 min-h-screen">
      <Nav />
      <div className=" relative shadow-md rounded bg-white w-full md:w-10/12 self-center py-10 px-4 mb-8">
        <img style={{ top: '5px', left: '20px' }} onClick={handleNavigation} className="absolute w-8 h-8 cursor-pointer hover:bg-gray-300 rounded" src={LeftIcon} alt="left-icon" />
        <div className="flex justify-center mb-8">
          <img className="w-full md:w-4/6" src={data.urlToImage} alt="news-detail" />
        </div>
        <div className="text-blue-900 flex flex-col mx-2 md:mx-24">
          <p className=" text-justify text-2xl font-bold mb-4">
            {data.title}
          </p>
          <div className="flex justify-between mb-8">
            <p className=" text-blue-900 font-semibold mb-3">{data.postedAt}</p>
            <p className=" text-red-600 font-bold text-lg">{data.author}</p>
          </div>
          <p className="text-base mb-8">
            {data.description}
          </p>
          <a className="self-end font-bold hover:text-red-600 mb-8" href={data.url} rel="noreferrer" target="_blank">Go to website</a>
          <p className="mb-4 text-blue-900 text-xl font-bold">Comments</p>
          {data.type && data.title && (
            <Comment type={data.type} title={data.title}/>
          )}
        </div>
      </div>
    </div>
  );
})

export default NewsDetail;
