import './App.css';
import {store} from './Redux/store';
import {Provider} from "react-redux";
import AllRoutes from './AllRoutes';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react'
function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Provider store={store}>
        <ChakraProvider>
        <AllRoutes/>
        </ChakraProvider>
      </Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
