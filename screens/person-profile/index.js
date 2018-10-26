import React from 'react';
import { Text, View, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import styles from './styles';
import SkillListByLevel from '../../components/skill-list-by-level';
import constants from '../../constants';

export default class PersonProfile extends React.Component {
  constructor(props) {
    super(props);
  }

  _renderId(person) {
      return (<Text>ID: {person.id}</Text>);
  }

  _renderName(person) {
    return (
      <Text>{person.firstName || ''} {person.middleName || ''} {person.lastName || ''}</Text>
    )
  }

  /**
   * Organizes skills by level
   *
   * @param {Array} skills
   * @returns {Map<String, Array<String>}
   * @memberof PersonProfile
   */
  _getSkillsByLevel(skills) {
    const levels = new Map();
    if (skills) {
      skills.forEach(skill => {
        if (levels.has(skill.level) === false) {
          levels.set(skill.level, [skill.name]);
        } else {
          levels.get(skill.level).push(skill.name);
        }
      });
    }

    return levels;
  }

  render() {
    // Get person object passed through navigation
    const person = this.props.navigation.getParam('person', null);

    // Sanity Check. Don't render anything if we don't get the person's information
    if (person === null) {
      return null;
    }

    // Get applicationStatus passed through navigation
    const applicationStatus = this.props.navigation.getParam('applicationStatus', '');
    // Remove underscore from status code-name
    const applicationStatusText = applicationStatus.replace('_', ' ');
    // Build list of skills grouped by level
    const skills = this._getSkillsByLevel(person.skills);

    return (
      <View style={styles.container}>
        <View style={styles.idContainer}>
          {this._renderId(person)}
        </View>
        <View style={styles.nameContainer}>
          <FontAwesome name="user" size={32} style={{marginBottom: 10}}/>
          {this._renderName(person)}
          <Text style={{color: constants.statusColor[applicationStatus] || 'gray'}}>{applicationStatusText}</Text>
        </View>
        <View style={styles.skillsContainer}>
          <SkillListByLevel skills={skills}/>
        </View>
      </View>
    );
  }
}

