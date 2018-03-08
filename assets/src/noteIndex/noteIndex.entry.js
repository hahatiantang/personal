
import '../lib/lib';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import NoteIndexPage from './components/NoteIndexPage.jsx';
import ConfigureStore from '../redux/utils/configureStore';
const store = ConfigureStore(undefined, window.__INITIALSTATE__);
const rootElement = document.getElementById('app');

ReactDOM.render(
        <Provider store={store}>
            <NoteIndexPage></NoteIndexPage>
        </Provider>,
        rootElement);
