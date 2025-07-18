
'use client'

import React, { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import Peer from 'simple-peer';

interface VideoCallProps {
  consultationId: string;
  userId: string;
  userType: 'doctor' | 'patient';
  onEndCall: () => void;
}

const VideoCall: React.FC<VideoCallProps> = ({ consultationId, userId, userType, onEndCall }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [peers, setPeers] = useState<{ [key: string]: Peer.Instance }>({});
  const userVideo = useRef<HTMLVideoElement>(null);
  const peersRef = useRef<{ [key: string]: Peer.Instance }>({});
  const otherUserVideo = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000');
    setSocket(newSocket);

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      setStream(stream);
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    });

    newSocket.on('connect', () => {
      newSocket.emit('join-consultation', {
        consultationId,
        userId,
        userType
      });
    });

    newSocket.on('user-joined', ({ userId: joinedUserId, socketId }: { userId: string; socketId: string }) => {
      if (socketId === newSocket.id) return;

      const peer = new Peer({
        initiator: userType === 'doctor',
        trickle: false,
        stream: stream || undefined,
      });

      peer.on('signal', (signal: any) => {
        newSocket.emit('signal', {
          target: socketId,
          signal,
        });
      });

      peer.on('stream', (remoteStream: MediaStream) => {
        if (otherUserVideo.current) {
          otherUserVideo.current.srcObject = remoteStream;
        }
      });

      peersRef.current[socketId] = peer;
      setPeers(peersRef.current);
      setIsCallActive(true);
    });

    newSocket.on('user-left', ({ socketId }: { socketId: string }) => {
      if (peersRef.current[socketId]) {
        peersRef.current[socketId].destroy();
        delete peersRef.current[socketId];
        setPeers(peersRef.current);
      }
      setIsCallActive(false);
    });

    newSocket.on('signal', ({ sender, signal }: { sender: string; signal: any }) => {
      const peer = peersRef.current[sender];
      if (peer) {
        peer.signal(signal);
      } else {
        const newPeer = new Peer({
          initiator: false,
          trickle: false,
          stream: stream || undefined,
        });

        newPeer.on('signal', (signal: any) => {
          newSocket.emit('signal', {
            target: sender,
            signal,
          });
        });

        newPeer.on('stream', (remoteStream: MediaStream) => {
          if (otherUserVideo.current) {
            otherUserVideo.current.srcObject = remoteStream;
          }
        });

        newPeer.signal(signal);
        peersRef.current[sender] = newPeer;
        setPeers(peersRef.current);
        setIsCallActive(true);
      }
    });

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      Object.values(peersRef.current).forEach(peer => peer.destroy());
      newSocket.emit('leave-consultation', { consultationId, userId, userType });
      newSocket.disconnect();
    };
  }, [consultationId, userId, userType]);

  const endCall = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    Object.values(peersRef.current).forEach(peer => peer.destroy());
    if (socket) {
      socket.emit('leave-consultation', { consultationId, userId, userType });
    }
    onEndCall();
  };

  return (
    <div className="video-call-container">
      <div className="video-grid">
        <video
          playsInline
          muted
          ref={userVideo}
          autoPlay
          className="user-video"
        />
        <video
          playsInline
          ref={otherUserVideo}
          autoPlay
          className="other-user-video"
        />
      </div>
      <div className="call-controls">
        <button onClick={endCall} className="end-call-button">
          End Call
        </button>
      </div>
      {!isCallActive && (
        <div className="waiting-message">
          {userType === 'doctor' ? 'Waiting for patient to join...' : 'Waiting for doctor to join...'}
        </div>
      )}
    </div>
  );
};

export default VideoCall;
