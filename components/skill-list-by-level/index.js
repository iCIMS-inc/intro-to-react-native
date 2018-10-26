import React from 'react';
import { Text, View, FlatList } from 'react-native';
import styles from './styles';

export default class SkillListByLevel extends React.Component {
  _renderLevel(row) {
    const level = row.item[0];
    const skills = row.item[1];
    return (
      <View style={styles.cellContainer}>
        <Text>{level}: {skills.join(", ")}</Text>
      </View>
    );
  }

  render() {
    const skills = Array.from(this.props.skills.entries());
    return (
      <FlatList 
        data={skills}
        keyExtractor={el => el[0]}
        renderItem={this._renderLevel}
      />
    );
  }
}

