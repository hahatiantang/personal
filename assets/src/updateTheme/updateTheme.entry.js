/**
 * Created by huxubin on 2017/2/23.
 */
import '../lib/lib';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import UpdateTheme from './components/updateTheme.jsx';
import ConfigureStore from '../redux/utils/configureStore';

const store = ConfigureStore(undefined, window.__INITIALSTATE__);
const rootElement = document.getElementById('app');

ReactDOM.render(
    <Provider store={store}>
        <UpdateTheme/>
    </Provider>
    ,rootElement);