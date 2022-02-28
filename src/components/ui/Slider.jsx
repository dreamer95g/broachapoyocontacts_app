import "./ui.css";
import React, { useState, useEffect } from "react";
import { Carousel } from "antd";
import { url_base } from "../../config/app";

export const Slider = () => {
  const contentStyle = {
    height: "350px",
    color: "#fff",
    lineHeight: "160px",
    textAlign: "center",
    background: "#364d79",
  };

  return (
    <>
      <Carousel autoplay>
        <div>
          <img
            src={`${url_base}/assets/images/slider/vision.jpg`}
            className="w-full"
            style={contentStyle}
          />
        </div>
        <div>
          <img
            src={`${url_base}/assets/images/slider/dario.jpg`}
            className="w-full"
            style={contentStyle}
          />
        </div>
        <div>
          <img
            src={`${url_base}/assets/images/slider/tim.jpg`}
            className="w-full"
            style={contentStyle}
          />
        </div>
      </Carousel>
    </>
  );
};
