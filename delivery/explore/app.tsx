import * as React from 'react';

// must use relative imports for proper tree-shaking since
// the ui package pulls everything in
import ExplorePage from '../../packages/ui/page-explore';

const App = () => <ExplorePage />;

export default App;
