"use client";

import { Global } from "@emotion/react";

const Fonts = () => {
  return (
    <Global
      styles={`
        @font-face {
            font-family: "Montserrat";
            src: url("/fonts/Montserrat-Regular.ttf") format("truetype");
            font-weight: normal;
            font-style: normal;
        }

        @font-face {
            font-family: "Montserrat-Black";
            src: url("/fonts/Montserrat-Black.ttf") format("truetype");
            font-weight: normal;
            font-style: normal;
        }

        @font-face {
            font-family: "Montserrat-Bold";
            src: url("/fonts/Montserrat-Bold.ttf") format("truetype");
            font-weight: 900;
            font-style: normal;
        }
        
        * {
            font-family: "Montserrat";
            font-size: 14px;
        }
      `}
    />
  );
};

export default Fonts;
