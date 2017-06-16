import React from "react";
import socket from "../websockets";
import Color from "cesium/Source/Core/Color";
import Cartesian3 from "cesium/Source/Core/Cartesian3";
import defined from "cesium/Source/Core/defined";
import CallbackProperty from "cesium/Source/DataSources/CallbackProperty";

class LikeAnimation extends React.Component {
  ////
  constructor() {
    super();
    socket.on("new like", like => {
      console.log("new like");
    });
  }

  componentDidMount() {
  	this.props.likesList.forEach((like) => {
  		this.renderLike(like);
  	})
  }

  renderLike(like) {
		const startPos = Cartesian3.fromDegrees(like.fromLng, like.fromLat);
		const endPos = Cartesian3.fromDegrees(like.toLng, like.toLat);
	  this.props.viewer.entities.add({
	    polyline: {
	      positions: this.drawLine(startPos, endPos),
	      material: Color.SALMON
	    }
	  });  	
  }

	drawLine(startPos, endPos) {
	  // render polylines - distance / velocity is render time for the line animation
	  const velocity = 500;
	  const duration = this.distanceBetween(startPos, endPos) / velocity;

	  const startEntity = this.props.viewer.entities.add({
	    position: startPos,
	    point: {
	      color: Color.RED
	    }
	  });
	  const endEntity = this.props.viewer.entities.add({
	    position: endPos,
	    point: {
	      color: Color.RED
	    }
	  });

	  const startTime = performance.now();
	  return new CallbackProperty((time, result) => {
	    if (!defined(result)) {
	      result = [];
	    }
	    const now = performance.now();
	    const start = startEntity.position.getValue(time, result[0]);
	    const end = endEntity.position.getValue(time, result[1]);
	    const t = Math.min(1.0, (now - startTime) / duration);
	    this.Slerp(start, end, t, end);

	    result[0] = start;
	    result[1] = end;
	    result.length = 2;
	    return result;
	  }, false);
	}

	distanceBetween(pos1, pos2) {
	  return Cartesian3.distance(pos1, pos2);
	}

	// spherical interpolation to prevent line from moving when globe is rotated
	Slerp(start, end, t, result) {
	  const result1 = new Cartesian3();
	  const result2 = new Cartesian3();
	  const result3 = new Cartesian3();
	  const theta = Cartesian3.angleBetween(start, end);
	  Cartesian3.multiplyByScalar(start, Math.sin((1-t)*theta), result1);
	  Cartesian3.multiplyByScalar(end, Math.sin(t*theta), result2);
	  Cartesian3.add(result1, result2, result3);
	  Cartesian3.divideByScalar(result3, Math.sin(theta), result);
	  return result;
	}

  ////
  render() {
    return null;
  }
}

export default LikeAnimation;