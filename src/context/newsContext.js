import React from 'react'
import {store} from '../mobx/configStore'

//CREATE NEWS CONTEXT
const NewsContext = React.createContext()

/**CREATE NEWS CONTEXT PROVIDER */
const NewsProvider = ({children}) => {
  return (
    <NewsContext.Provider value={store}>{children}</NewsContext.Provider>
  )
}

export {NewsContext, NewsProvider}