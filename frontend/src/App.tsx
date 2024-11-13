import { BrowserRouter } from 'react-router-dom';
import LayoutProvider from './layout.provider';


function App() {
    return (
        <BrowserRouter basename="/">
            <LayoutProvider />
        </BrowserRouter>
    );
}
export default App;