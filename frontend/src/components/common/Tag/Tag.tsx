const Tag = (props) => {
  const { backgroundColor, borderColor, color, icon, text } = props

  return (
    <div
      className="flex flex-col justify-center border rounded m-1"
      style={{
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        color: color,
      }}
    >
      <div className="flex items-center px-2">
        <p>
          {icon ? icon : ""}
          <span className={`${icon ? "ml-2" : ""} whitespace-pre-wrap text-xs`}>
            {text}
          </span>
        </p>
      </div>
    </div>
  )
}

export default Tag
