import Link from 'next/link';
import React from 'react'

const Beffect = ({ id, title, leftIcon, containerClass, rightIcon, textClass }) => {
  return (
    <div>
    <button
      id={id}
      className={
        `group relative z-10 w-fit cursor-pointer overflow-hidden
        ${containerClass}`}
    >
      {leftIcon}

      <span className={`relative inline-flex overflow-hidden ${textClass}`}>
      <div className="translate-y-0 skew-y-0 transition duration-500 group-hover:translate-y-[-200%] group-hover:skew-y-2">
          {title}
        </div>
        <div className="absolute translate-y-[200%] skew-y-2 transition duration-500 group-hover:translate-y-0 group-hover:skew-y-0">
          {title}
        </div>
      </span>

      {rightIcon}
    </button>
    </div>
  );
}

export default Beffect;