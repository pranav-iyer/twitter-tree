const TreeView = (props) => {

  if (props.toDisplay) {
    return (
      <img
        src={`data:image/svg+xml,${props.svg}`}
        alt="Tree of replies to supplied tweet"
        className="full-width"
      />
    )
  } else {
    return <div></div>
  }
}

export default TreeView