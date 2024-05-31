
import React, { ReactNode } from 'react'
import { Provider } from 'react-redux';
import { store } from './store';


interface ProvidersInterface {
    children: ReactNode;
  }
  
  
  
  
  const Providers: React.FC<ProvidersInterface> = ({ children }) => {


    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}
export default Providers;