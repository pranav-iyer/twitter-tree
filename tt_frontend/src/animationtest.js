import {Motion, spring, presets} from 'react-motion';
import {useState} from 'react';

const AnimationTest = () => {
  const [startAnimation, setAnimation] = useState(false);
  const initialStyle = { opacity: 0, translateY: 30 };
  return (
    <div className="App">
      <Motion
        style={
          startAnimation
            ? {
                opacity: spring(1),
                translateY: spring(0, presets.wobbly)
              }
            : initialStyle
        }
      >
        {interpolatedStyles => (
          <div
            style={{
              transform: `translateY(${interpolatedStyles.translateY}px)`,
              opacity: interpolatedStyles.opacity
            }}
          >
            <h1>Triggered Animation</h1>
          </div>
        )}
      </Motion>
      <button onClick={() => setAnimation(true)}>Trigger Animation</button>
      <button onClick={() => setAnimation(false)}>Reset Animation</button>
    </div>
  );
}

export default AnimationTest