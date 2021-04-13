import { useState } from 'react'

const TreeView = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [svg, setSVG] = useState();

  const loadSVG = () => {
    console.log("loading svg...");
    // load in the svg data from the server
    setIsLoading(true);
    setIsLoaded(true);

    console.log("sending fetch request to api")
    fetch('http://localhost:8000/tree/' + props.requestedID)
      .then(response => response.json())
      .then(json => setSVG(encodeURIComponent(json.svg)))
      .then(() => setIsLoading(false))
  }

  if (props.requestedID !== "0") {
    if (!isLoading) {
      if (!isLoaded) {
        loadSVG()
      } else {
        return (
          <img
            src={`data:image/svg+xml,${svg}`}
            alt="Tree of replies to supplied tweet"
            class="full-width"
          />
        )
      }
    } else {
      return <p className="loading"> Loading .... </p>
    }
  } else {
    return <p></p>
  }
}

export default TreeView