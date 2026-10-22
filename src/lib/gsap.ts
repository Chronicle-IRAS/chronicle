import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
ScrollTrigger.config({ ignoreMobileResize: true })

export { gsap, ScrollTrigger }
