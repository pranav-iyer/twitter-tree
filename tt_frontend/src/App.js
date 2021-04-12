import './App.css';
import SearchBar from './search'
import TreeView from './treeview'
import { useState } from 'react'


function App() {
  const [searchText, setSearchText] = useState("pranav");
  const [requestedID, setRequestedID] = useState("0");
  const [isWaiting, setIsWaiting] = useState(false);

  const parseURL = (rawURL) => {
    var parsedID = rawURL;
    const lastQuestion = parsedID.lastIndexOf("?");
    if (lastQuestion >= 0) {
      parsedID = parsedID.slice(0, lastQuestion)
    }
    parsedID = parsedID.slice(parsedID.lastIndexOf("/")+1);
    return parsedID
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setRequestedID(parseURL(searchText));
  }


  const handleSearchTextChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleIsWaitingChange = (e) => {
    setIsWaiting(e.target.value);
  };

  return (
    <div className="App">
      <SearchBar
        searchText={searchText}
        handleSearchTextChange={handleSearchTextChange}
        handleSearchSubmit={handleSearchSubmit}
      />
      <TreeView
        requestedID={requestedID}
        isWaiting={isWaiting}
        handleIsWaitingChange={handleIsWaitingChange}
      />
    </div>
  );
}

export default App;
