import React from 'react';
import Color from 'cesium/Source/Core/Color';
import Cartesian3 from 'cesium/Source/Core/Cartesian3';

export default class ContentDot extends React.Component {
  componentDidMount() {
    const { dots, userLocation } = this.props;

    if (dots) {
      this.dot = dots.add({
        position: Cartesian3.fromDegrees(userLocation.lng, userLocation.lat),
        color: Color.DEEPSKYBLUE
      });
    }
  }

  componentWillUnmount() {
    const { dots } = this.props;

    if (dots && !dots.isDestroyed() && this.dot) {
      dots.remove(this.dot);
    }
  }

  render() {
    return null;
  }
}
