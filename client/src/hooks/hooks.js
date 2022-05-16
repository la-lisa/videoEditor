import { useCallback, useEffect, useRef, useState } from 'react';
import VideoProgressDialog from '../components/ui/dialogs/VideoProgressDialog';
import useStore from '../store/useStore';
import { CANVAS_FORMATS, DIALOG_CANCEL_BUTTON_TITLE, DIALOG_SAVE_BUTTON_TITLE, VIDEO_FIT } from '../utils/utils';
import axios from 'axios';
import io from 'socket.io-client';
import VideoProcessingFinishedDialog from '../components/ui/dialogs/VideoProcessingFinishedDialog';

// https://usehooks.com/useEventListener/
export function useEventListener(eventName, handler, element = window) {
  // Create a ref that stores handler
  const savedHandler = useRef();
  // Update ref.current value if handler changes.
  // This allows our effect below to always get latest handler ...
  // ... without us needing to pass it in effect deps array ...
  // ... and potentially cause effect to re-run every render.
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);
  useEffect(
    () => {
      // Make sure element supports addEventListener
      // On
      const isSupported = element && element.addEventListener;
      if (!isSupported) return;
      // Create event listener that calls handler function stored in ref
      const eventListener = (event) => savedHandler.current(event);
      // Add event listener
      element.addEventListener(eventName, eventListener);
      // Remove event listener on cleanup
      return () => {
        element.removeEventListener(eventName, eventListener);
      };
    },
    [eventName, element] // Re-run if eventName or element changes
  );
}

export function useDimensionChange(handler) {
  const [node, setNode] = useState();
  const ref = useCallback((node) => {
    setNode(node);
  }, []);

  useEffect(() => {
    if (node) {
      const resizeObserver = new ResizeObserver(([resizeObserverEntry]) => handler(resizeObserverEntry.contentRect));
      resizeObserver.observe(node);
      return () => resizeObserver.unobserve(node);
    }
  }, [node]);

  return ref;
}

export function useWriteFile() {
  const video = useStore((state) => state.video);
  const videoFit = useStore((state) => state.videoFit);
  const canvasFormat = useStore((state) => state.canvasFormat);
  const videoBgColor = useStore((state) => state.videoBgColor);
  const resultVideoUrl = useStore((state) => state.resultVideoUrl);
  const setResultVideoUrl = useStore((state) => state.setResultVideoUrl);
  const setResultThumbUrl = useStore((state) => state.setResultThumbUrl);
  const setResultVideoProgress = useStore((state) => state.setResultVideoProgress);
  const openDialog = useStore((state) => state.openDialog);
  const setDialog = useStore((state) => state.setDialog);
  const closeDialog = useStore((state) => state.closeDialog);
  const startTime = useStore((state) => state.startTime);
  const endTime = useStore((state) => state.endTime);
  const muteAudio = useStore((state) => state.muteAudio);
  const audioVolume = useStore((state) => state.audioVolume);
  const brightness = useStore((state) => state.brightness);
  const contrast = useStore((state) => state.contrast);
  const blur = useStore((state) => state.blur);
  const hue = useStore((state) => state.hue);
  const saturation = useStore((state) => state.saturation);
  const invert = useStore((state) => state.invert);
  const flipHorizontal = useStore((state) => state.flipHorizontal);
  const flipVertical = useStore((state) => state.flipVertical);

  const handleVideoProgressDialogCancel = () => {
    // const socket = io('http://localhost:3001');
    // socket.emit("killProcess");
    axios.post('/killffmpeg').catch((e) => {
      console.error('An error occurred: ', e);
    });
    closeDialog();
  };

  const shiftValuesBrightness = (value) => {
    if (value === 100) {
      return 0;
    }
    if (value > 100) {
      return value / 500;
    }
    if (value < 100) {
      return value / 100 - 1;
    }
  };

  const shiftValuesContrast = (value) => {
    if (value === 100) {
      return 1;
    }
    if (value > 100) {
      return (999 * (value - 100)) / 400 + 1;
    }
    if (value < 100) {
      return (1001 * value) / 100 - 1000;
    }
  };

  const shiftValuesSaturation = (value) => {
    if (value === 100) {
      return 1;
    }
    if (value > 100) {
      return (2 * (value - 100)) / 400 + 1;
    }
    if (value < 100) {
      return value / 100;
    }
  };

  useEffect(() => {
    const load = async () => {
      const socket = io('http://localhost:3001');
      socket.on('uploadProgress', (progress) => {
        setResultVideoProgress(progress);
      });
    };
    load();
  }, []);

  useEffect(() => {
    if (!resultVideoUrl) return;

    const serverVideoHref = `http://localhost:3001/${resultVideoUrl}`;

    setDialog(() => <VideoProcessingFinishedDialog />, {
      title: 'Rendering completed!',
      actionButton: { title: DIALOG_SAVE_BUTTON_TITLE, href: serverVideoHref, target: '_blank', download: true },
      cancelButton: { title: DIALOG_CANCEL_BUTTON_TITLE, onClick: handleVideoProgressDialogCancel },
    });
  }, [resultVideoUrl]);

  return async () => {
    openDialog(() => <VideoProgressDialog />, {
      title: 'Rendering...',
      cancelButton: { title: DIALOG_CANCEL_BUTTON_TITLE, onClick: handleVideoProgressDialogCancel },
    });

    const vflip = flipVertical
      ? {
          filter: 'vflip',
        }
      : {
          filter: 'curves',
        };

    const hflip = flipHorizontal
      ? {
          filter: 'hflip',
        }
      : {
          filter: 'curves',
        };

    const doInvert = invert
      ? {
          filter: 'negate',
        }
      : {
          filter: 'curves',
        };

    const adjustmentOptions = [
      {
        filter: 'eq',
        options: {
          brightness: `${shiftValuesBrightness(brightness)}`,
          contrast: `${shiftValuesContrast(contrast)}`,
          saturation: `${shiftValuesSaturation(saturation)}`,
        },
      },
      {
        filter: 'hue',
        options: {
          h: `${hue}`,
        },
      },
      {
        filter: 'gblur',
        options: {
          sigma: `${blur}`,
        },
      },
      doInvert,
      vflip,
      hflip,
    ];

    const vfOptions =
      videoFit === VIDEO_FIT._COVER
        ? {
            filter: 'crop',
            options: {
              w: `ih*${CANVAS_FORMATS[canvasFormat].title}`,
              h: 'ih',
            },
          }
        : [
            {
              filter: 'pad',
              options: {
                w: `max(iw\\,ih*(${CANVAS_FORMATS[canvasFormat].title}))`,
                h: `ow/(${CANVAS_FORMATS[canvasFormat].title})`,
                x: '(ow-iw)/2',
                y: '(oh-ih)/2',
                color: `${videoBgColor}`,
              },
            },
            {
              filter: 'setsar',
              options: '1',
            },
          ];

    let start = startTime.split(':');
    let end = endTime.split(':');
    let secondsStart = +start[0] * 60 * 60 + +start[1] * 60 + +start[2];
    let secondsEnd = +end[0] * 60 * 60 + +end[1] * 60 + +end[2];

    const audioOptions = muteAudio
      ? { filter: 'volume', options: '0.0' }
      : { filter: 'volume', options: `${audioVolume / 100}` };

    const formData = new FormData();
    formData.append('file', video);
    formData.append('trimTime', JSON.stringify([secondsStart, secondsEnd]));
    formData.append('vfOptions', JSON.stringify(vfOptions));
    formData.append('afOptions', JSON.stringify(audioOptions));
    formData.append('adjustOptions', JSON.stringify(adjustmentOptions));
    axios
      .post('/encode', formData)
      .then((res) => {
        setResultVideoUrl(res.data.newVideoUrl);
        setResultThumbUrl(res.data.newThumbUrl);
      })
      .catch((e) => {
        console.error('An error occurred: ', e);
      });
  };
}
