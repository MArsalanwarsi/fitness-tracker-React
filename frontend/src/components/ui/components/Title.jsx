import React from 'react'

const Title = (props) => {
  return (
    <div>
      <h1 className={`text-[50px] text-center font-urbanist font-semibold ${props.className}`}>{props.data.title}</h1>
    </div>
  )
}

export default Title
