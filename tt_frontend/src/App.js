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

  const parseURL = (rawURL) => {
    var parsedID = rawURL;
    const lastQuestion = parsedID.lastIndexOf("?");
    if (lastQuestion >= 0) {
      parsedID = parsedID.slice(0, lastQuestion)
    }
    parsedID = parsedID.slice(parsedID.lastIndexOf("/")+1);
    return parsedID
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setRequestedID(parseURL(searchText));
  };


  const handleSearchTextChange = (e) => {
    setSearchText(e.target.value);
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
          if (response.ok) {
            return response.json()
          } else {
            throw new Error("Request denied by server.");
          }
        })
        .then((json) => {
          setSVG(encodeURIComponent(json.svg));
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          //reset state to original
          setIsLoading(false);
          setRequestSent(false);
          setRequestedID("0");
        })
    }
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
        />
      </div>
      <TreeView
        toDisplay={requestSent && !isLoading}
        svg={svg}
      />
    </div>
  );
}

export default App;
