import './App.css';
import SearchBar from './search'
import TreeView from './treeview'
import Title from './title'
import { useState, useEffect } from 'react'


function App() {
  const [searchText, setSearchText] = useState("");
  const [requestedID, setRequestedID] = useState("0");
  const [svg, setSVG] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [buttonShake, setButtonShake] = useState(false);

  const parseURL = (rawURL) => {
    var parsedID = rawURL;
    const lastQuestion = parsedID.lastIndexOf("?");
    if (lastQuestion >= 0) {
      parsedID = parsedID.slice(0, lastQuestion)
    }
    parsedID = parsedID.slice(parsedID.lastIndexOf("/")+1);
    return parsedID;
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    //clear error message on resubmit
    setErrorMessage("");

    //error checking
    const parseResult = parseURL(searchText);
    if (isNaN(parseResult)) {
      //shake button and do not submit the search
      setButtonShake(true);
      setErrorMessage("Unable to parse URL—make sure you pasted the right link!");
      return;
    }
    setRequestedID(parseResult);
  };


  const handleSearchTextChange = (e) => {
    setSearchText(e.target.value);
  };

  const stopButtonShake = (e) => {
    setButtonShake(false);
  };

  useEffect(() => {
    if (requestedID!== "0" && !requestSent && !isLoading) {
      console.log("loading svg...");
      // load in the svg data from the server
      setIsLoading(true);
      setRequestSent(true);

      console.log("sending fetch request to api")
      fetch('http://localhost:8000/tree/' + requestedID)
        .then((response) => {
          console.log(response.status);
          if (response.status === 200) {
            console.log(response);
            return response.json();
          } else if (response.status === 404) {
            throw new Error("Tweet not found. Check the URL, and make sure the tweet isn't private!");
          }
        })
        .then((json) => {
          setSVG(json.svg);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          //shake button and reset state to original
          setButtonShake(true);
          setIsLoading(false);
          setRequestSent(false);
          setRequestedID("0");
          if (error.toString().slice(0,9) === "TypeError") {
            setErrorMessage("Server is down :(. Try again later.")
          } else {
            setErrorMessage(error.toString().slice(6));
          }
        })
    }
    // eslint-disable-next-line
  }, [requestedID])

  return (
    <div className="App">
      <div className="flex-container">
        <Title
          toDisplay={!requestSent || isLoading}
        />
        <SearchBar
          searchText={searchText}
          handleSearchTextChange={handleSearchTextChange}
          handleSearchSubmit={handleSearchSubmit}
          toDisplay={!requestSent || isLoading}
          buttonDisabled={requestSent}
          buttonShake={buttonShake}
          stopButtonShake={stopButtonShake}
        />
        {errorMessage && <div className="error">{errorMessage}</div>}
      </div>
      <TreeView
        toDisplay={requestSent && !isLoading}
        svg={svg}
      />
    </div>
  );
}

export default App;
