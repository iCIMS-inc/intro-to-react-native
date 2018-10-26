import JobList from './screens/job-list';
import ApplicationList from './screens/application-list';
import PersonProfile from './screens/person-profile';
import { createStackNavigator } from 'react-navigation';
import constants from './constants';

export default createStackNavigator({ 
  Jobs: JobList,
  Applications: ApplicationList,
  Person: PersonProfile
}, { 
  initialRouteName: 'Jobs',
  navigationOptions: {
    headerStyle: {
      backgroundColor: constants.appColors.brandRed
    },
    headerTintColor: 'white'
  }
});