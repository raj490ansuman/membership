const BlockButton = (props) => {
  const { backgroundColor, borderColor, color, icon, content, onClick } = props

  return (
    <div
      className="flex px-4 py-1 rounded border shadow-md"
      style={{
        borderColor: borderColor,
        backgroundColor: backgroundColor,
        color: color,
      }}
      onClick={onClick}
    >
      <div className="flex justify-center items-center grow-0">{icon}</div>
      <div className="flex grow justify-center">{content}</div>
    </div>
  )
}

export default BlockButton
