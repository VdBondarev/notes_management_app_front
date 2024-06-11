import './App.scss';
import { HomePage } from "./pages/homePage/HomePage";
import { store } from "./store/store";
import { Provider } from 'react-redux';

function App() {
    return (
        <Provider store={ store }>
            <div className="App">
                <HomePage/>
            </div>
        </Provider>
    );
}

export default App;
