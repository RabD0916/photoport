import React from "react"
import '../Css/Create.scss'
const Create = (props) => {

    return (
        <div className="centerer">
            <h1>Just Some More</h1>
            <h1>Button Hover Effects</h1>
            <h4>By: <a href="http://kylebrumm.com" target="_blank">Kyle Brumm</a></h4>

            <div className="wrap">
                <a className="btn-0" href="#">Swipe</a>
                <a className="btn-1" href="#">Diagonal Swipe</a>
                <a className="btn-1-2" href="#">Double Swipe</a>
                <a className="btn-2" href="#">Diagonal Close</a>
                <a className="btn-3" href="#"><span>Zoning In</span></a>
                <a className="btn-4" href="#"><span>4 Corners</span></a>
                <a className="btn-5" href="#">Slice</a>
            </div>
            <div className="wrap">
                <a className="btn-6" href="#">Position Aware<span></span></a>
                <a className="btn-7" href="#"><span>Alternate</span></a>
                <a className="btn-8" href="#">Smoosh</a>
                <a className="btn-9" href="#"><span>Vertical Overlap</span></a>
                <a className="btn-10" href="#"><span>Horizontal Overlap</span></a>
                <a className="btn-11" href="#">Collision</a>
            </div>
        </div>
    )
}

export default Create;