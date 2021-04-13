const Title = (props) => {
  if (props.toDisplay) {
    return (
      <div className="title flex-container">
        <img
          src="./logo_large.svg"
          className="logo"
          alt="Twitter Tree Logo"
        />
      </div>
    )
  } else {
    return <div></div>
  }
}

export default Title