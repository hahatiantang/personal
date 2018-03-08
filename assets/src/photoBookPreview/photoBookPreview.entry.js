/**
 * 文件说明:照片书预览
 * 详细描述:
 * 创建者:  hxb
 * 创建时间: 2017/3/2
 * 变更记录:
 */
import '../lib/lib';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import PhotoBookPreview from './components/photoBookPreview.jsx';
import ConfigureStore from '../redux/utils/configureStore';

const store = ConfigureStore(undefined, window.__INITIALSTATE__);
const rootElement = document.getElementById('app');


ReactDOM.render(
    <Provider store={store}>
        <PhotoBookPreview/>
    </Provider>
    ,rootElement);
