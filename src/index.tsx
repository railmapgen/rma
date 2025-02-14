import rmgRuntime from '@railmapgen/rmg-runtime';
import { StrictMode } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import AppRoot from './components/app-root';
import { Events } from './constants/constants';
import i18n from './i18n/config';
import store from './redux';
import initStore from './redux/init';

let root: Root;

const renderApp = () => {
    root = createRoot(document.getElementById('root') as HTMLDivElement);
    root.render(
        <StrictMode>
            <Provider store={store}>
                <I18nextProvider i18n={i18n}>
                    <AppRoot />
                </I18nextProvider>
            </Provider>
        </StrictMode>
    );
};

rmgRuntime.ready().then(() => {
    initStore(store);
    renderApp();
    rmgRuntime.injectUITools();
    rmgRuntime.event(Events.APP_LOAD, {});
});
