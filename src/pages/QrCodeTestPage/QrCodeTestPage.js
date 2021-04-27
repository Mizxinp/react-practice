import React from 'react'
import QrCode from '../../components/QrCode'

function QrcodeTestPage(props) {
    return (
        // <div>jjjj</div>
        <QrCode
            text="xxx"
            size={210}
        // correctLevel="M"
        />
    )
}

export default QrcodeTestPage