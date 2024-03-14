import React from "react";
import '../Css/Event.css'
import test from'../testttt/photoport.png'
const Event = () => {
  return (
      <>
          <div className={"EventCenter"}>
              진행중인 이벤트
              <div className={"rowbar"}></div>
          </div>

          <div className={"EventList"}>
              <div className={"EventItem"}>
                  <img src={test} className={"Eventimage"} alt={"이벤트 사진"}/>
                  <div className={"EventContent"}>
                      포토포트 여러분의 곁으로 곧 찾아 갑니다!
                  </div>
              </div>
              <div className={"EventItem"}>
                  <img src={test} className={"Eventimage"} alt={"이벤트 사진"}/>
                  <div className={"EventContent"}>
                      포토포트 여러분의 곁으로 곧 찾아 갑니다!
                  </div>
              </div>
              <div className={"EventItem"}>
                  <img src={test} className={"Eventimage"} alt={"이벤트 사진"}/>
                  <div className={"EventContent"}>
                      포토포트 여러분의 곁으로 곧 찾아 갑니다!
                  </div>
              </div>
              <div className={"EventItem"}>
                  <img src={test} className={"Eventimage"} alt={"이벤트 사진"}/>
                  <div className={"EventContent"}>
                      포토포트 여러분의 곁으로 곧 찾아 갑니다!
                  </div>
              </div>
          </div>
      </>
  )
}

export default Event;