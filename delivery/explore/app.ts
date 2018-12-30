import * as h from 'react-hyperscript';

// must use relative imports for proper tree-shaking since
// the ui package pulls everything in
import ExplorePage from '../../packages/ui/page-explore';

const App = () => h(ExplorePage);

export default App;
