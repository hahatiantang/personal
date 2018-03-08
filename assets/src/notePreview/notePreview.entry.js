import '../lib/lib';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import NotePreviewPage from './components/NotePreviewPage.jsx';
import ConfigureStore from '../redux/utils/configureStore';
/*require('vconsole');*/
const store = ConfigureStore(undefined, window.__INITIALSTATE__);
const rootElement = document.getElementById('app');


ReactDOM.render(
    <Provider store={store}>
        <NotePreviewPage />
    </Provider>,
    rootElement);
