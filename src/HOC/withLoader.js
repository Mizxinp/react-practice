import React from 'react'

const withLoader = (WrapperComponent, url) => {
    return class LoaderComponent extends React.Component {
        state = {
            loading: false,
            data: {}
        }
        componentDidMount() {
            this.setState({ loading: true })
            fetch(url)
                .then(data => this.setState({ data }))
                .finally(() => this.setState({ loading: false }))
        }

        render() {
            return <WrapperComponent {...this.props} {...this.state} />
        }
    }
}

export default withLoader