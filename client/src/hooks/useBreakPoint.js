import { useEffect, useState } from "react"

const useBreakPoint = (bp) => {

    const [breakpoint, setBreakpoint] = useState(window.innerWidth)
    const resize = () => {
        setBreakpoint(window.innerWidth)
    }

    useEffect(() => {
        window.addEventListener('resize', resize)

        return () => {
            window.removeEventListener('resize', resize)
        }
    }, [])
    
    return parseInt(bp) >= parseInt(breakpoint)
}

export default useBreakPoint;