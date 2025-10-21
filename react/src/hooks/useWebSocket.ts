import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { wsUrl } from '../../../shared/config'
import { WS_EVENTS } from '../../../shared/actions'
import type { Location } from '../../../shared/interfaces'

interface UseWebSocketProps {
  onLocationDeleted: (id: number) => void
  onLocationsCreated: (locations: Location[]) => void
  onLocationSelected: (id: number) => void
}

export const useWebSocket = ({ onLocationDeleted, onLocationsCreated, onLocationSelected }: UseWebSocketProps) => {
  const socketRef = useRef<ReturnType<typeof io> | null>(null)
  const callbacksRef = useRef({ onLocationDeleted, onLocationsCreated, onLocationSelected })

  callbacksRef.current = { onLocationDeleted, onLocationsCreated, onLocationSelected }

  useEffect(() => {
    socketRef.current = io(wsUrl)

    socketRef.current.on('connect', () => {
      console.log('React WebSocket connected')
    })

    socketRef.current.on('connect_error', (error) => {
      console.error('React WebSocket connection error:', error)
    })

    socketRef.current.on('disconnect', () => {
      console.log('React WebSocket disconnected')
    })

    socketRef.current.on(WS_EVENTS.LOCATION_DELETED, (data: { id: number }) => {
      console.log('React', WS_EVENTS.LOCATION_DELETED)
      callbacksRef.current.onLocationDeleted(data.id)
    })

    socketRef.current.on(WS_EVENTS.LOCATIONS_CREATED, (data: Location[]) => {
      console.log('React', WS_EVENTS.LOCATIONS_CREATED)
      callbacksRef.current.onLocationsCreated(data)
    })

    socketRef.current.on(WS_EVENTS.LOCATION_SELECTED, (data: { id: number }) => {
      console.log('React', WS_EVENTS.LOCATION_SELECTED)
      callbacksRef.current.onLocationSelected(data.id)
    })

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [])

  return socketRef.current
}
