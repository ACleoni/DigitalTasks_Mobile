import
{
  createStackNavigator
} from 'react-navigation';

import 
{
  Login
} from './src/containers';




const App = createStackNavigator(
  {
    Login:
    {
      screen: Login
    }
  }
)

export default App