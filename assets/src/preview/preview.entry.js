/**
 * 文件说明:台历预览
 * 详细描述:
 * 创建者:  MFChen
 * 创建时间: 2016/10/12
 * 变更记录:
 */
import '../lib/lib';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import PreviewPage from './components/PreviewPage.jsx';
import ConfigureStore from '../redux/utils/configureStore';

const store = ConfigureStore(undefined, window.__INITIALSTATE__);
const rootElement = document.getElementById('app');

ReactDOM.render(
    <Provider store={store}>
        <PreviewPage/>
    </Provider>
    , rootElement);