import { useEffect } from 'react';
import { BROADCAST_EVENTS } from '../../../shared/actions';

interface UseBroadcastChannelProps {
  onLocationSelected: (id: number) => void;
}

export const useBroadcastChannel = ({ onLocationSelected }: UseBroadcastChannelProps) => {
  useEffect(() => {
    const channel = new BroadcastChannel(BROADCAST_EVENTS.LOCATION_SELECTED);

    channel.onmessage = (event) => {
      const { id } = event.data;
      if (id) {
        console.log('React received location selection:', id);
        onLocationSelected(id);
      }
    };

    return () => {
      channel.close();
    };
  }, [onLocationSelected]);
};
