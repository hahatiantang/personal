/**
 * 文件说明:台历编辑
 * 详细描述:
 * 创建者: ycl
 * 创建时间: 2016/10/11
 * 变更记录:
 */
import '../lib/lib';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import EditPage from './components/EditPage.jsx';
import ConfigureStore from '../redux/utils/configureStore';
const store = ConfigureStore(undefined, window.__INITIALSTATE__);
const rootElement = document.getElementById('app');

ReactDOM.render(
    <Provider store={store}>
        <EditPage></EditPage>
    </Provider>
    , rootElement);