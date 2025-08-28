import Link from 'next/link';
import React from 'react'

const Effect = ({ id, title, leftIcon, containerClass, rightIcon, link, textClass }) => {
  return (
    <Link 
     target='_blank'
     href={`${link}`}>
    <button
      id={id}
      className={
        `group relative z-10 w-fit cursor-pointer overflow-hidden
        ${containerClass}`}
    >
      {leftIcon}

      <span className={`relative inline-flex overflow-hidden ${textClass}`}>
      <div className="translate-y-0 skew-y-0 transition duration-500 group-hover:translate-y-[-160%] group-hover:skew-y-12">
          {title}
        </div>
        <div className="absolute translate-y-[164%] skew-y-12 transition duration-500 group-hover:translate-y-0 group-hover:skew-y-0">
          {title}
        </div>
      </span>

      {rightIcon}
    </button>
    </Link>
  );
}

export default Effect