'use client';

import{ useRef ,  useLayoutEffect ,useCallback , useEffect } from 'react'
import { useGesture } from '@use-gesture/react'
import { animated, useSpring, useSprings } from '@react-spring/web'
import { Github, Linkedin, Mail } from 'lucide-react'

interface FabsSubProps {
  links:string;
  avatars:string,
}

interface FabsProps {
   items:FabsSubProps[]
}

export const Fabs = ({ items }:FabsProps) => {
  const buttonRef = useRef<HTMLDivElement>(null!)
  const avatarRefs = useRef<HTMLDivElement[]>([])
  const avatarRefInitialPositions = useRef<number[]>([])
  const containerRef = useRef<HTMLDivElement>(null!)

  const isVisible = useRef(false)

  const [{ x, y, opacity }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    opacity: 0,
  }), [])

  const [avatarSprings, avatarApi] = useSprings(items?.length, i => ({
    y: 0,
  }), [])

  useLayoutEffect(() => {
    if (avatarRefInitialPositions.current.length === 0) {
      const { y: buttonY } = buttonRef.current.getBoundingClientRect()
      avatarRefInitialPositions.current = avatarRefs.current.map(
        node => buttonY - node.getBoundingClientRect().y
      )
    }

    avatarApi.start(i => ({
      y: avatarRefInitialPositions.current[i],
      immediate: true,
    }))
  }, [avatarApi])

  const getBounds = useCallback(() => {
    const { height, width } = containerRef.current.getBoundingClientRect()
    return {
      top: -height / 2,
      left: -width / 2,
      right: window.innerWidth - width / 2,
      bottom: window.innerHeight - height / 2,
    }
  }, [])
  

  const backgroundTimeoutRef = useRef<ReturnType<typeof setTimeout>>()
  const avatarTimeoutRef = useRef<ReturnType<typeof setTimeout>>()

  // Limpa os timeouts ao desmontar o componente
  useEffect(() => {
    return () => {
      if (backgroundTimeoutRef.current) clearTimeout(backgroundTimeoutRef.current)
      if (avatarTimeoutRef.current) clearTimeout(avatarTimeoutRef.current)
    }
  }, [])

  const bindGestures = useGesture(
    {
      onDrag: ({ down, offset: [ox, oy], velocity: [vx, vy], direction: [dx, dy] }) => {
        api.start({
          x: ox,
          y: oy,
          immediate: down,
          onChange: ({ value }) => {
            const bounds = getBounds()
            if (
              !(
                value.x >= bounds.left &&
                value.x <= bounds.right &&
                value.y >= bounds.top &&
                value.y <= bounds.bottom
              )
            ) {
              api.set({
                x: value.x < bounds.left
                  ? bounds.left
                  : value.x > bounds.right
                  ? bounds.right
                  : value.x,
                y: value.y < bounds.top
                  ? bounds.top
                  : value.y > bounds.bottom
                  ? bounds.bottom
                  : value.y,
              })
            }
          },
          config: key => ({
            velocity: key === 'x' ? vx * dx : vy * dy,
            decay: true,
          }),
        })
      },
      onHover: ({ hovering }) => {
        if (hovering) {
          if (backgroundTimeoutRef.current) clearTimeout(backgroundTimeoutRef.current)
          if (avatarTimeoutRef.current) clearTimeout(avatarTimeoutRef.current)

          isVisible.current = true
          api.start({ opacity: 1 })
          avatarApi.start({ y: 0 })
        } else {
          backgroundTimeoutRef.current = setTimeout(() => {
            api.start({ opacity: 0 })
          }, 1000)

          avatarTimeoutRef.current = setTimeout(() => {
            avatarApi.start(i => ({
              y: avatarRefInitialPositions.current[i],
              onRest: () => {
                isVisible.current = false
              },
            }))
          }, 1000)
        }
      },
    },
    {
      drag: {
        from: () => [x.get(), y.get()],
        bounds: getBounds,
        rubberband: true,
      },
    }
  )

  const { onPointerEnter, onPointerLeave, onPointerDown, ...restGestures } = bindGestures()

  const handlePointerDown = (isBackground: boolean) => (e: PointerEvent<HTMLElement>) => {
    if (isBackground && !isVisible.current) return
    if (onPointerDown) onPointerDown(e)
  }

  return (
    <animated.div
      ref={containerRef}
      onPointerLeave={onPointerLeave}
      onPointerDown={handlePointerDown(true)}
      {...restGestures}
      style={{
        x,
        y,
        backgroundColor: opacity.to(o => `rgba(0,0,0,${0.2 * o})`),
      }}
      className="fixed bottom-[10%] left-[90%] p-3 flex flex-col gap-2 backdrop-blur-[8px] items-center touch-none z-[4000]"
    >
      {/* Botão de agarrar */}
      <animated.button
        style={{ opacity }}
        className="h-[17px]  bg-[#cccccc33] border-0  w-[calc(100%-16px)]"
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-white transform rotate-90"
        >
          <path
            d="M5.5 4.625C6.12132 4.625 6.625 4.12132 6.625 3.5C6.625 2.87868 6.12132 2.375 5.5 2.375C4.87868 2.375 4.375 2.87868 4.375 3.5C4.375 4.12132 4.87868 4.625 5.5 4.625ZM9.5 4.625C10.1213 4.625 10.625 4.12132 10.625 3.5C10.625 2.87868 10.1213 2.375 9.5 2.375C8.87868 2.375 8.375 2.87868 8.375 3.5C8.375 4.12132 8.87868 4.625 9.5 4.625ZM10.625 7.5C10.625 8.12132 10.1213 8.625 9.5 8.625C8.87868 8.625 8.375 8.12132 8.375 7.5C8.375 6.87868 8.87868 6.375 9.5 6.375C10.1213 6.375 10.625 6.87868 10.625 7.5ZM5.5 8.625C6.12132 8.625 6.625 8.12132 6.625 7.5C6.625 6.87868 6.12132 6.375 5.5 6.375C4.87868 6.375 4.375 6.87868 4.375 7.5C4.375 8.12132 4.87868 8.625 5.5 8.625ZM10.625 11.5C10.625 12.1213 10.1213 12.625 9.5 12.625C8.87868 12.625 8.375 12.1213 8.375 11.5C8.375 10.8787 8.87868 10.375 9.5 10.375C10.1213 10.375 10.625 10.8787 10.625 11.5ZM5.5 12.625C6.12132 12.625 6.625 12.1213 6.625 11.5C6.625 10.8787 6.12132 10.375 5.5 10.375C4.87868 10.375 4.375 10.8787 4.375 11.5C4.375 12.1213 4.87868 12.625 5.5 12.625Z"
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
          />
        </svg>
      </animated.button>
      {avatarSprings.map((springs, index) => (
        <animated.div
          key={`avatar-${index}`}
          ref={(el) => {
            if (el) avatarRefs.current[index] = el;
          }}
          style={{ ...springs }}
          className="w-[56px] h-[56px] mx-1"
        >
          <div className="flex w-full h-full justify-center items-center">
            <a href={items[index].link} target="_blank" rel="noopener noreferrer">
              {items[index].avatar === 'Linkedin' ? (
                <Linkedin className="h-7 w-7 text-white" />
              ) : items[index].avatar === 'Github' ? (
                <Github className="h-7 w-7 text-white" />
              ) : items[index].avatar === 'Mail' ? (
                <Mail className="h-7 w-7 text-white" />
              ) : items[index].avatar === 'whatsApp' ? ( 
                <svg width="40" height="40" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
                  <path fill="white" d="M128 48c-44.1 0-80 35.9-80 80 0 14.1 3.7 27.9 10.8 40l-11.6 42.5 43.6-11.4c11.7 6.4 24.9 9.9 37.2 9.9 44.1 0 80-35.9 80-80s-35.9-80-80-80zm40.8 112.6c-2.1 5.9-12.3 11.5-17 12.2-4.4.6-9.8.9-15.9-1-3.7-1.2-8.5-2.8-14.8-5.5-26-11.2-42.9-37.2-44.2-39.1-1.3-1.8-10.6-14.1-10.6-26.9s6.5-19.1 8.9-21.7c2.4-2.6 5.3-3.3 7.1-3.3 1.8 0 3.6.1 5.1.1 1.6 0 3.9-.6 6.1 4.7 2.1 5.2 7.1 17.9 7.7 19.2.6 1.3 1 2.8.2 4.6-.8 1.8-1.2 2.9-2.3 4.5-1.1 1.6-2.4 3.5-3.4 4.7-1.1 1.2-2.2 2.5-1 4.9 1.3 2.4 5.8 9.5 12.4 15.4 8.5 7.6 15.6 10 18.1 11.2 2.4 1.2 3.8 1 5.2-.6 1.4-1.6 6-7.1 7.6-9.6 1.6-2.4 3.2-2 5.4-1.2 2.2.8 13.8 6.5 16.2 7.7 2.4 1.2 4 1.8 4.6 2.8.5 1 .5 5.9-1.6 11.8z"/>
                </svg>
              ) :
              null}
            </a>
          </div>
        </animated.div>
      ))}

      {/* Botão flutuante */}
      <animated.div
        ref={buttonRef}
        onPointerEnter={onPointerEnter}
        onPointerDown={handlePointerDown(false)}
        {...restGestures}
        style={{
          boxShadow: opacity.to(o => `0px 3px 8px 2px rgba(0,0,0,${0.4 * (1 - o)})`),
        }}
        className="w-[56px] h-[56px] rounded-full relative bg-clip-[content-box] z-0 touch-none focus-visible:ring-2 focus-visible:ring-[#569aff99]"
      >
      <span className="rounded-full flex items-center justify-center w-full h-full bg-[#fafafa]">
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#1a1a1a" viewBox="0 0 256 256">
          <rect width="256" height="256" fill="none"></rect>
          <path d="M128,24A104,104,0,0,0,36.8,178l-8.5,29.9a16.1,16.1,0,0,0,4,15.8,15.8,15.8,0,0,0,15.7,4l30-8.5A104,104,0,1,0,128,24Zm32,128H96a8,8,0,0,1,0-16h64a8,8,0,0,1,0,16Zm0-32H96a8,8,0,0,1,0-16h64a8,8,0,0,1,0,16Z"></path>
        </svg>
      </span>
      </animated.div>
    </animated.div>
  )
}
