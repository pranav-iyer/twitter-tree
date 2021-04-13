const Title = (props) => {
  if (props.searchRequested) {
    return <div></div>
  } else {
    return (
      <div className="title flex-container">
        <img
          src="./logo_large.svg"
          className="logo"
          alt="Twitter Tree Logo"
        />
      </div>
    )
  }
}

export default Title