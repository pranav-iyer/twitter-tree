import {headShake} from 'react-animations';
import {StyleSheet, css} from 'aphrodite';
import {useState, useEffect} from 'react';

const styles = StyleSheet.create({
  headShake: {
    animationName: headShake,
    animationDuration: '1s'
  }
});

const makeWiggle = (Target) => {
  return (props) => {
    const [startWiggle, setStartWiggle] = useState(false);

    useEffect(()=>{
      if (props.shouldWiggle) {
        setStartWiggle(true);
        setTimeout(() => setStartWiggle(false), 1010);
      }
    });

    return (
      <Target {...props}
        frameClass={props.startShake ? css(styles.headShake) : ''}
      />
    )
  }
}

export default makeWiggle;