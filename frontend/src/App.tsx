import './styles/App.css';
import { Aside } from './components/Aside/Aside';
import { Main } from './components/Main/Main';

function App() {

    return (
        <div className="main_container">
            <Aside></Aside>
            <Main></Main>
        </div>
    );
}

export default App;
