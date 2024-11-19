import React from "react";
import "./Divider.css";

const Divider = ({ type = "line", text }) => {
    return (
        <>
            {type === "line" && (
                <div className="divider-line">
                    <span className="divider-text">{text}</span>
                </div>
            )}
            {type === "scrolling" && (
                <div className="scrolling-line">
                    <div className="scrolling-content">
                        <span>STAY HUMBLE</span>
                        <span>✦</span>
                        <span> BE PROUD </span>
                        <span>✦</span>
                        <span> BELIEVE IN YOURSELF</span>
                        <span>✦</span>
                        <span> NEVER GIVE UP</span>
                        <span>✦</span>
                        <span> TRAIN HARD </span>
                        <span>✦</span>
                        <span> NO PAIN, NO GAIN </span>
                        <span>✦</span>
                        <span> BE STRONG </span>
                        <span>✦</span>
                        <span> BE YOURSELF</span>
                        <span>✦</span>
                        <span> FEEL THE BURN </span>
                        <span>✦</span>
                        <span> BE A WARRIOR</span>
                        <span>✦</span>
                        <span> FOCUS ON THE GOAL</span>
                        <span>✦</span>
                        <span> STAY DISCIPLINED</span>
                    </div>
                </div>
            )}
        </>
    );
};

export default Divider;