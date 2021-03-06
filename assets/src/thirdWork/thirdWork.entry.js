/**
 * 文件说明:台历首页
 * 详细描述:
 * 创建者: 余成龙
 * 创建时间: 16/10/09
 * 变更记录:
 */
import '../lib/lib';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import ThirdWorkPage from './components/ThirdWorkPage.jsx';
import ConfigureStore from '../redux/utils/configureStore';

const store = ConfigureStore(undefined, window.__INITIALSTATE__);
const rootElement = document.getElementById('app');

ReactDOM.render(
  <Provider store={store}>
    <ThirdWorkPage/>
  </Provider>
  , rootElement);