const TreeView = (props) => {

  if (props.toDisplay) {
    return (
      <div dangerouslySetInnerHTML={{__html: props.svg}}></div>
    )
  } else {
    return <div></div>
  }
}

export default TreeView