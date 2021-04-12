import { useState } from 'react'

const TreeView = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [svg, setSVG] = useState();

  const loadSVG = () => {
    // load in the svg data from the server
    setIsLoading(true);
    setIsLoaded(true);
    fetch('http://localhost:8000/tree/' + props.requestedID)
      .then(response => response.json())
      .then(data => setSVG(encodeURIComponent(data.svg)))
      .then(data => setIsLoading(false))
  }

  if (props.requestedID !== "0") {
    if (!isLoading) {
      if (!isLoaded) {
        loadSVG()
      } else {
        return <img src={`data:image/svg+xml,${svg}`} alt="Tree of replies to supplied tweet" />
      }
    } else {
      return <p> Loading .... </p>
    }
  } else {
    return <p>No ID submitted</p>
  }
}

export default TreeView