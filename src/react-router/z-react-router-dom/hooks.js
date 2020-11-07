import { useContext } from 'react'
import { RouterContext } from './RouterContext'

export function useLocation() {
    return useContext(RouterContext).location
}

export function useHistory() {
    return useContext(RouterContext).history
}

export function useParams() {
    const match = useContext(RouterContext).match
    return match.params || {}
}

export function useRouteMatch() {
    return useContext(RouterContext).match
  }