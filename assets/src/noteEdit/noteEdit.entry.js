/**
 * 文件说明:记事本编辑
 * 详细描述:
 * 创建者: 邵纪昊
 * 创建时间: 2016/11/11
 * 变更记录:
 */
import '../lib/lib';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import NoteEditPage from './components/NoteEditPage.jsx';
import ConfigureStore from '../redux/utils/configureStore';
const store = ConfigureStore(undefined, window.__INITIALSTATE__);
const rootElement = document.getElementById('app');

ReactDOM.render(
    <Provider store={store}>
        <NoteEditPage/>
    </Provider>
    , rootElement);