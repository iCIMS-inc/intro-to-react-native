import React from 'react';
import { Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getAllApplications } from '../../network/api';
import styles from './styles';

export default class JobList extends React.Component {
  static navigationOptions = {
    title: 'Jobs',
  }

  constructor(props) {
    super(props);

    this.state = {
      jobs: []
    }

    this._navigateToApplications = this._navigateToApplications.bind(this);
    this._renderJobCell = this._renderJobCell.bind(this);
    this._renderSeparator = this._renderSeparator.bind(this);
  }

  async componentDidMount() {
    try {
      const response = await getAllApplications(500);
      this.setState({jobs: response});
    } catch (error) {
      alert('There was an error: ', error);
    }
  }

  _renderSeparator() {
    return (<View style={styles.cellSeparator}/>);
  };

  _navigateToApplications(job) {
    this.props.navigation.navigate('Applications', {applications: job.applications});
  }

  _renderJobCell(row) {
    const job = row.item;
    return (
      <TouchableOpacity onPress={() => {this._navigateToApplications(job)}}>
        <View style={styles.cellContainer}>
          <Text>{job.title} ({job.applications.length})</Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    if (this.state.jobs.length > 0) {
      return (
        <FlatList
          keyExtractor={(item) => item.applications[0].jobId.toString()} // FlatList now requires keys to be strings
          data={this.state.jobs}
          renderItem={this._renderJobCell}
          initialNumToRender={20} // This is 
          ItemSeparatorComponent={this._renderSeparator}
        />
      );
    } else {
      return (<ActivityIndicator size="large" color='red' style={styles.activityIndicator}/>);
    }
  }
}

