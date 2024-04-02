import React from "react";
import "./EventDetail.scss"

const EventDetail = () => {
  return(
      <>
          <div className={"EventCenter"}>
              진행중인 이벤트
              <div className={"rowbar"}></div>
          </div>
          <div className={"EventDetail-image"}></div>
      </>
  )
}
export default EventDetail;