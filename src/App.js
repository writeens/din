import React, { useState } from 'react';
import './App.global.css';
import './styles/main.css';
import NewsFeed from './components/NewsFeed';
import NewsDetail from './components/NewsDetail';
import {NewsProvider} from './context/newsContext'

const App = () => {
  const [showDetails, setShowDetails] = useState(false)
  const [details, setDetails] = useState({title:'', type:''})

  const navigateToDetails = (title, type) => {
    setShowDetails(true)
    setDetails({title, type})
  }

  const navigateToHome = () => {
    setShowDetails(false)
  }

  return (
  <NewsProvider>
    {!showDetails && <NewsFeed handleNavigation={navigateToDetails}/>}
    {showDetails && <NewsDetail handleNavigation={navigateToHome} details={details}/>}
  </NewsProvider>
)}

export default App;
