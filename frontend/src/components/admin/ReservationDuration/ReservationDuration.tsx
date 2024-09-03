import moment from "moment"
import styled from "styled-components"

const Wrapper = styled.div`
  min-width: 104px;
`

const Status = (props) => {
  const { start, end, size } = props

  return (
    <div className="flex justify-center">
      <Wrapper
        className={
          size
            ? "p-1 bg-custom-green text-white text-xs font-bold whitespace-pre-wrap text-center rounded mr-2"
            : "p-2 bg-custom-green text-white text-xs font-bold whitespace-pre-wrap text-center rounded mr-2"
        }
      >
        {start
          ? `${moment(start).format("YYYY年M月D日")}\n${moment(start).format(
              "HH:mm"
            )}`
          : "ー年ー月ー日\nー:ー"}
      </Wrapper>
      <Wrapper
        className={
          size
            ? "p-1 bg-custom-red text-white text-xs font-bold whitespace-pre-wrap text-center rounded"
            : "p-2 bg-custom-red text-white text-xs font-bold whitespace-pre-wrap text-center rounded"
        }
      >
        {end
          ? `${moment(end).format("YYYY年M月D日")}\n${moment(end).format(
              "HH:mm"
            )}`
          : "ー年ー月ー日\nー:ー"}
      </Wrapper>
    </div>
  )
}

export default Status
