import React, { useState } from 'react'

const LikeButton = () => {
    const [ like, setLike ] = useState(0)
    return (
        <button onClick={() => {setLike(like + 1)}}>
            {like} 👍
        </button>
    )
}

export default LikeButton