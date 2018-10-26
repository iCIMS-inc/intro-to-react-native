import React from 'react';
import { Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import styles from './styles';
import constants from '../../constants';
import {getPersonById} from '../../network/api';
export default class ApplicationList extends React.Component {
  static navigationOptions = {
    title: 'Applicants',
  }

  constructor(props) {
    super(props);
    this.state = {loadingPeople: true};

    this._navigateToPerson = this._navigateToPerson.bind(this);
    this._renderApplicationCell = this._renderApplicationCell.bind(this);
    this._renderSeparator = this._renderSeparator.bind(this);
  }

  async _getPeople(applications) {
    const promises = applications.map((application) => {
      if (!application.person) { // If we already have that application/person, don't fetch them again
        return new Promise(async (resolve, reject) => {
          try {
            const person = await getPersonById(application.personId);
            application.person = person; // Add person object to application
            resolve(); // we're done here
          } catch (error) {
            reject(error); // there was an error, throw exception
          }
        });
      } else {
        return null;
      }
    }).filter(promise => promise != null);

    await Promise.all(promises);
  }


  async componentDidMount() {
    const applications = this.props.navigation.getParam('applications', []);
    try {
      await this._getPeople(applications);
      this.setState({loadingPeople: false});
    } catch (error) {
      alert('There was an error: ', error); // Alert user of error
    }
  }

  _navigateToPerson(application) {
    this.props.navigation.navigate('Person', {
      person: application.person, 
      applicationStatus: application.status
    });
  }

  _renderSeparator() {
    return (<View style={styles.cellSeparator}/>);
  };

  _renderApplicationCell(row) {
    const application = row.item;
    const person = application.person;
    if (!person) { return null;}
    return (
      <TouchableOpacity onPress={() => {this._navigateToPerson(application)}}>
        <View style={styles.cellContainer}>
          <Text style={{color: constants.statusColor[application.status] || 'gray'}}>
            {person.firstName || ''} {person.lastName || ''} ({person.email.toLowerCase() || ''})
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    if (this.state.loadingPeople === false) {
      return (
        <FlatList
          keyExtractor={(item) => item.id.toString()}
          data={this.props.navigation.getParam('applications', [])}
          renderItem={this._renderApplicationCell}
          ItemSeparatorComponent={this._renderSeparator}
        />
      );
    } else {
      return (<ActivityIndicator size="large" color='red'/>);
    }
  }
}

