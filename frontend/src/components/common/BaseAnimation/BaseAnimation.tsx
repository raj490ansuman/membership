import { motion } from "framer-motion"

const BaseV = {
  hidden: {
    opacity: 0,
  },
  enter: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  }
}

const BaseAnimation = (props) => {
  const { children, className, style } = props

  return (
    <motion.div
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={BaseV}
      transition={{ type: 'linear' }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  )
}

export default BaseAnimation
