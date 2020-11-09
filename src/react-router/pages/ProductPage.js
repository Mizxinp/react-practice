import React, { useState } from 'react';
// import { Prompt } from 'react-router-dom'
import { Prompt } from '../z-react-router-dom'

const ProductPage = () => {
    const [confirm, setConfirm] = useState(true)
    return (
        <div>
            商品
            <Prompt
            when={confirm}
            message={location => {
                return "是否离开";
            }}
            />
        </div>
    );
};

export default ProductPage;