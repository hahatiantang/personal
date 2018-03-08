/**
 * 文件说明:微信公众号内容书首页
 * 详细描述:
 * 创建者: 查甘望
 * 创建时间: 17/07/06
 * 变更记录:
 */
import '../lib/lib';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import IndexPage from './components/IndexPage.jsx';
import ConfigureStore from '../redux/utils/configureStore';

const store = ConfigureStore(undefined, window.__INITIALSTATE__);
const rootElement = document.getElementById('app');

ReactDOM.render(
    <Provider store={store}>
        <IndexPage></IndexPage>
    </Provider>
    , rootElement);