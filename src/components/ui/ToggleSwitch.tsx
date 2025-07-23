"use client";

import * as motion from "motion/react-client";
import { useState } from "react";

export default function LayoutAnimation() {
  const [isOn, setIsOn] = useState(false);

  const toggleSwitch = () => setIsOn(!isOn);

  return (
    <div className="flex justify-end">
      <button
        className={`flex 
          bg-blue-100
         p-2 rounded-4xl w-16 h-8 cursor-pointer toggle-container"`}
        style={{
          ...container,
          justifyContent: "flex-" + (isOn ? "end" : "start"),
        }}
        onClick={toggleSwitch}
      >
        <motion.div
          className={`rounded-4xl w-4 h-4 toggle-handle ${
            isOn ? "bg-blue-500" : "bg-blue-200"
          }`}
          layout
          transition={{
            type: "spring",
            visualDuration: 0.2,
            bounce: 0.2,
          }}
        />
      </button>
    </div>
  );
}

/**
 * ==============   Styles   ================
 */

const container = {
  // width: 100,
  // height: 50,
  // borderRadius: 50,
  // cursor: "pointer",
  // display: "flex",
  // padding: 10,
};

// const handle = {
//   width: 20,
//   height: 20,
//   backgroundColor: "gry"
//   borderRadius: "50%",
// };
