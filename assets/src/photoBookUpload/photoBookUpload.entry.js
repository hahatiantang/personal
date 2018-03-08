/**
 * 文件说明:照片书上传
 * 详细描述:
 * 创建者:  hxb
 * 创建时间: 2017/2/9
 * 变更记录:
 */
import '../lib/lib';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import PhotoBookUpload from './components/photoBookUpload.jsx';
import ConfigureStore from '../redux/utils/configureStore';

const store = ConfigureStore(undefined, window.__INITIALSTATE__);
const rootElement = document.getElementById('app');

ReactDOM.render(
    <Provider store={store}>
        <PhotoBookUpload></PhotoBookUpload>
    </Provider>
,rootElement);