import { useEffect, useRef, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'

interface UseWebSocketOptions {
  url: string
  onConnect?: () => void
  onDisconnect?: () => void
  onDocumentUpdate?: (data: any) => void
  onError?: (error: any) => void
}

export function useWebSocket({
  url,
  onConnect,
  onDisconnect,
  onDocumentUpdate,
  onError
}: UseWebSocketOptions) {
  const socketRef = useRef<Socket | null>(null)

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return

    socketRef.current = io(url, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    socketRef.current.on('connect', () => {
      console.log('WebSocket connected')
      onConnect?.()
    })

    socketRef.current.on('disconnect', () => {
      console.log('WebSocket disconnected')
      onDisconnect?.()
    })

    socketRef.current.on('document-update', (data: any) => {
      onDocumentUpdate?.(data)
    })

    socketRef.current.on('error', (error: any) => {
      console.error('WebSocket error:', error)
      onError?.(error)
    })
  }, [url, onConnect, onDisconnect, onDocumentUpdate, onError])

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
    }
  }, [])

  const joinDocument = useCallback((documentId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('join-document', documentId)
    }
  }, [])

  const leaveDocument = useCallback((documentId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('leave-document', documentId)
    }
  }, [])

  const sendUpdate = useCallback((documentId: string, data: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('document-change', { docId: documentId, ...data })
    }
  }, [])

  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [disconnect])

  return {
    socket: socketRef.current,
    connect,
    disconnect,
    joinDocument,
    leaveDocument,
    sendUpdate,
    isConnected: socketRef.current?.connected || false
  }
}