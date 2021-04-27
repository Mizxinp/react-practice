/* eslint-disable no-underscore-dangle */
/* eslint-disable no-new */
import React from 'react'
import cx from 'classnames'
// import { Toast } from 'elephant-ui'
import { Modal } from 'antd'
import * as QRCode from 'easyqrcodejs'
// import './QrCode.css'

function isDzjUrl(url) {
    return /\/\/(dzj-test|dzj-prod-1|dzj-shared)/.test(url)
}

/**
 * 裁剪成圆形图片
 * @param {String} imgSrc 图片url
 */
function clipImg(imgSrc) {
    if (!imgSrc) {
        return null
    }

    const image = new Image()
    if (!isDzjUrl(imgSrc)) {
        image.setAttribute('crossOrigin', 'Anonymous')
    }
    return new Promise((resolve, reject) => {
        image.onload = () => {
            let width = image.naturalWidth
            let height = image.naturalWidth
            if (image.naturalWidth > image.naturalHeight) {
                width = image.naturalHeight
                height = image.naturalHeight
            }
            const _canv = document.createElement('canvas')
            _canv.fillStyle = 'rgba(255, 255, 255, 0)'
            _canv.width = width
            _canv.height = height
            const _contex = _canv.getContext('2d')
            const cli = {
                x: width / 2,
                y: height / 2,
                r: width / 2,
            }
            _contex.clearRect(0, 0, width, height)
            _contex.save()
            _contex.beginPath()
            _contex.lineWidth = width / 10
            _contex.strokeStyle = 'white'
            _contex.arc(cli.x, cli.y, cli.r, 0, Math.PI * 2, false)
            _contex.stroke()
            _contex.clip()
            _contex.drawImage(image, 0, 0)
            _contex.restore()
            try {
                resolve(_canv.toDataURL())
            } catch (error) {
                reject(error)
            }
        }
        image.onerror = (err) => {
            reject(err)
        }
        image.src = imgSrc
    })
}
export default class QrCode extends React.PureComponent {
    state = {
        hideImg: false,
    }
    componentDidMount() {
        this.genQRCode()
    }

    componentDidUpdate(prevProps) {
        if (this.props.logo && prevProps.logo !== this.props.logo) {
            this.genQRCode()
        }
    }

    componentWillUnmount() {
        this.qrcodeMaker = null
    }

    genQRCode = () => {
        const maker = this.qrcodeMaker

        if (maker) {
            maker.then((qrcodeMaker) => {
                qrcodeMaker && qrcodeMaker.clear()
                this.qrcodeMaker = this.generateQRCode(this.qrcodeEl)
            })
        } else {
            this.qrcodeMaker = this.generateQRCode(this.qrcodeEl)
        }
    }

    generateQRCode = (qrcodeCon, large) => {
        const {
            text, size = 180, correctLevel = 'L', logo, logoSize = 60,
        } = this.props

        function baseOptions() {
            return {
                text,
                width: Math.min(large ? size * 2 : size, 320),
                height: Math.min(large ? size * 2 : size, 320),
                // colorDark: '#000000',
                colorDark: 'green',
                colorLight: '#ffffff',
                width: 100,
                height: 100,
                correctLevel: QRCode.CorrectLevel[correctLevel],
            }
        }
        function logoOptions(logoUrl) {
            return {
                logo: logoUrl,
                logoWidth: large ? logoSize * 2 : logoSize,
                logoHeight: large ? logoSize * 2 : logoSize,
                logoBackgroundTransparent: true,
            }
        }
        function generateQRCode(logoUrl) {
            return new QRCode(qrcodeCon, {
                ...(baseOptions()),
                ...(logoUrl ? logoOptions(logoUrl) : {}),
            })
        }
        return new Promise((resolve) => {
            if (logo) {
                if (qrcodeCon && qrcodeCon.children.length === 0) {
                    clipImg(logo)
                        .then((logoUrl) => {
                            resolve(generateQRCode(logoUrl))
                        })
                        .catch((err) => {
                            console.error(err)
                            this.setState({
                                hideImg: true,
                            })
                            resolve(generateQRCode(logo))
                        })
                }
            } else {
                resolve(generateQRCode())
            }
        })
    }

    handleImgClick = () => {
        const { size } = this.props
        Modal.info({
            // className: styles.modal,
            centered: true,
            icon: null,
            content: <div
                // className={cx(styles.canvas, {
                //     [styles.hideImg]: true,
                // })}
                ref={(ref) => {
                    this.generateQRCode(ref, true)
                }}
                style={{
                    height: `${size * 2}px`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
            />,
            okText: null,
            maskClosable: true,
        })
    }

    render() {
        const {
            className, text, size, style,
        } = this.props
        if (!text) {
            return null
        }

        const { hideImg } = this.state

        return (
            <div className={cx(className, 'qr-code-cmp')} style={style}>
                <div
                    // className={cx(styles.canvasContainer, {
                    //     [styles.hideImg]: hideImg,
                    // })}
                    ref={(ref) => {
                        this.qrcodeEl = ref
                    }}
                    onClick={this.handleImgClick}
                    style={{
                        height: size, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                />
            </div>
        )
    }
}
