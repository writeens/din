import React, { useEffect, useContext, Fragment, useState } from 'react';
import {observer} from 'mobx-react-lite';
import Loader from './Loader'
import { NewsContext } from '../context/newsContext';
import Nav from './Nav';
import UserIcon from '../assets/user.svg'

const categories = [
  { label: 'Business', value: 'business' },
  { label: 'Entertainment', value: 'entertainment' },
  { label: 'General', value: 'general' },
  { label: 'Health', value: 'health' },
  { label: 'Science', value: 'science' },
  { label: 'Technology', value: 'technology' },
  { label: 'Sports', value: 'sports' },
];

const CategorySlider = ({handleClickCategory}) => {

  const [selected, setSelected] = useState('business')

  const handleClick = (value) => {
    handleClickCategory(value)
    setSelected(value)

  }
  return (
    <div className="flex justify-center mb-4">
    <div className="customScroll text-blue-900 pb-1 mb-4 flex w-full md:w-10/12 self-center overflow-x-auto">
      {categories.map(({ value, label }) => <button
        type="button" 
        className={`px-8 flex-1 text-center cursor-pointer ${value === selected ? 'bg-red-600 text-white rounded-sm border-0 outline-none focus:outline-none' : ''} `} 
        key={value}
        onClick={() => handleClick(value)}
        >{label}</button>)}
    </div>
  </div>
  )
}

const NewsItem = ({
  title, postedAt, author, url, handleClick, type
}) => (
  <div className=" text-blue-900 flex flex-col w-full md:w-6/12 lg:w-3/12 p-1 mb-4 cursor-pointer">
    <div onClick={() => handleClick(title, type)} className="shadow-md rounded bg-white pb-4">
      {url && (
        <div style={{paddingBottom: '65%'}} className="relative">
        <img src={url} alt="news-banner" className=" absolute w-full h-full" />
      </div>
      )}
      {!url && (
        <div style={{paddingBottom: '65%'}} className="relative bg-transparent h-40">
          <img src={UserIcon} className=" absolute w-full h-full"></img>
        </div>
      )}
      <div className="px-4 pt-2 pb-4 text-sm h-40 flex flex-col justify-between">
        <p className=" text-blue-900 font-semibold">{postedAt}</p>
        <p className="text-justify">{title}</p>
        <p className=" text-red-600 font-semibold text-right">{author}</p>
      </div>
    </div>
  </div>
);

const NewsFeed = observer(({handleNavigation}) => {
  const newsStore = useContext(NewsContext)

  const [newsType, setNewsType] = useState('Business')
  const [news, setNews] = useState([])
  const [category, setCategory] = useState('business')
  
  /**HANDLE USER CLICK CATEGORY */
  const handleClickCategory = async (category) => {
    await newsStore.updateNewsItem(category)
    const title = categories.find((item) => item.value === category)
    setNewsType(title.label)
    setCategory(category)
  }

  /**FETCH NEWS ITEM */
  const fetchNewsItems = async () => {
    await newsStore.fetchNewsItem('business')
  }

  /**GO TO DETAILS */
  const navigateToDetails = (title, type) => {
    handleNavigation(title, type)
  }
  
  useEffect(() => {
    fetchNewsItems()
  }, [])

  useEffect(() => {
    setNews(newsStore.news.filter((item) => item.type === category))
  }, [newsStore.news, newsStore.category])

  const renderNewsItems = () => {
    if(newsStore.state === 'pending'){
      return <Loader small />
    }

    return (
      <Fragment>
        {news.map((item) => (
          <NewsItem 
            key={item.url} 
            author={item.author} 
            url={item.urlToImage} 
            postedAt={item.postedAt} 
            title={item.title}
            handleClick={navigateToDetails}
            type={item.type}
            ></NewsItem>
        ))}
      </Fragment>
    )
  }

  return (
    <div className="flex flex-col bg-gray-300 min-h-screen">
      <Nav/>
      <CategorySlider handleClickCategory={handleClickCategory}/>
      <p className="text-2xl text-blue-900 font-bold px-8 mb-8 text-center">{
        newsStore.state === 'pending' ? '' : `${newsType} News`
      }</p>
      <div style={{minHeight:'400px'}} className="relative flex w-full md:w-10/12 self-center flex-wrap">
        {renderNewsItems()}
      </div>
    </div>
  );
})

export default NewsFeed;
