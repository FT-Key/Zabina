import React from 'react'

const SVGHDFilter = () => {
  return (
    <>
      <svg>
        <filter id="sharpen">
          <feConvolveMatrix
            order="3"
            kernelMatrix="0 -1  0 -1  5 -1 0 -1  0"
            divisor="1"
            bias="0" />
        </filter>
      </svg>
    </>
  )
}

export default SVGHDFilter