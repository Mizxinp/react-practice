import React, { useState, useEffect } from 'react'

const useLoader = (url) => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        setLoading(true)
        fetch(url)
            .then(data => setData(data))
            .finally(() => setLoading(false))
    }, [url])
    return [data, loading]
}

export default useLoader