import { useCallback, useEffect, useRef, useState } from 'react';
import VideoProgressDialog from '../components/ui/dialogs/VideoProgressDialog';
import useStore from '../store/useStore';
import {
  CANVAS_FORMATS,
  DIALOG_CANCEL_BUTTON_TITLE,
  DIALOG_DOWNLOAD_BUTTON_TITLE,
  VIDEO_FIT,
  VIDEO_ALIGN,
  DIALOG_BACK_TO_EDITOR_BUTTON_TITLE,
} from '../utils/utils';
import axios from 'axios';
import io from 'socket.io-client';
import VideoProcessingFinishedDialog from '../components/ui/dialogs/VideoProcessingFinishedDialog';
import useStoreWithUndo from '../store/useStoreWithUndo';

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
  const resultVideoUrl = useStore((state) => state.resultVideoUrl);
  const setResultVideoUrl = useStore((state) => state.setResultVideoUrl);
  const setResultThumbUrl = useStore((state) => state.setResultThumbUrl);
  const setResultVideoProgress = useStore((state) => state.setResultVideoProgress);
  const openDialog = useStore((state) => state.openDialog);
  const setDialog = useStore((state) => state.setDialog);
  const closeDialog = useStore((state) => state.closeDialog);
  const videoFit = useStoreWithUndo((state) => state.videoFit);
  const canvasFormat = useStoreWithUndo((state) => state.canvasFormat);
  const videoBgColor = useStoreWithUndo((state) => state.videoBgColor);
  const startTime = useStoreWithUndo((state) => state.startTime);
  const endTime = useStoreWithUndo((state) => state.endTime);
  const muteAudio = useStoreWithUndo((state) => state.muteAudio);
  const audioVolume = useStoreWithUndo((state) => state.audioVolume);
  const brightness = useStoreWithUndo((state) => state.brightness);
  const contrast = useStoreWithUndo((state) => state.contrast);
  const blur = useStoreWithUndo((state) => state.blur);
  const hue = useStoreWithUndo((state) => state.hue);
  const saturation = useStoreWithUndo((state) => state.saturation);
  const invert = useStoreWithUndo((state) => state.invert);
  const flipHorizontal = useStoreWithUndo((state) => state.flipHorizontal);
  const flipVertical = useStoreWithUndo((state) => state.flipVertical);
  const videoAlign = useStoreWithUndo((state) => state.videoAlign);
  const panShot = useStoreWithUndo((state) => state.panShot);
  const zoom = useStoreWithUndo((state) => state.zoom);
  const outputFormat = useStoreWithUndo((state) => state.outputFormat);
  const panDirection = useStoreWithUndo((state) => state.panDirection);
  const [filename, setFilename] = useState('');

  const handleVideoProgressDialogCancel = () => {
    axios.post('/api/ffmpeg/killffmpeg').catch((e) => {
      console.error('An error occurred: ', e);
    });
    closeDialog();
  };

  const handleVideoProcessDialogNoDownload = () => {
    axios
      .delete('/api/deleteConverted', {
        data: {
          filename: filename,
          format: outputFormat,
        },
      })
      .catch((e) => {
        console.error('An error occurred', e);
      });
    closeDialog();
  };

  const shiftValuesBrightnessLight = (value) => {
    if (value <= 100) {
      return 1;
    }
    if (value > 100) {
      return 1.01 - (value - 100) / 200;
    }
  };

  const shiftValuesBrightnessDark = (value) => {
    if (value >= 100) {
      return 1;
    }
    if (value < 100) {
      return value / 100;
    }
  };

  const shiftValuesContrast = (value) => {
    if (value === 100) {
      return 1;
    }
    if (value > 100) {
      return value / 100;
    }
    if (value < 100) {
      return value / 100;
    }
  };

  const shiftValuesSaturation = (value) => {
    if (value === 100) {
      return 1;
    }
    if (value > 100) {
      return (2 * (value - 100)) / 200 + 1;
    }
    if (value < 100) {
      return value / 100;
    }
  };

  const getYPos = () => {
    if (videoAlign === VIDEO_ALIGN._CENTER || videoAlign === VIDEO_ALIGN._LEFT || videoAlign === VIDEO_ALIGN._RIGHT) {
      return videoFit === VIDEO_FIT._COVER ? 'ih/2' : '(oh-ih)/2';
    } else if (videoAlign === VIDEO_ALIGN._BOTTOM) {
      return videoFit === VIDEO_FIT._COVER ? 'ih' : '(oh-ih)';
    } else {
      return '0';
    }
  };

  const getXPos = () => {
    if (videoAlign === VIDEO_ALIGN._CENTER || videoAlign === VIDEO_ALIGN._TOP || videoAlign === VIDEO_ALIGN._BOTTOM) {
      return videoFit === VIDEO_FIT._COVER ? 'iw/2' : '(ow-iw)/2';
    } else if (videoAlign === VIDEO_ALIGN._RIGHT) {
      return videoFit === VIDEO_FIT._COVER ? 'iw' : '(ow-iw)';
    } else {
      return '0';
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
      actionButton: { title: DIALOG_DOWNLOAD_BUTTON_TITLE, href: serverVideoHref, target: '_blank', download: true },
      cancelButton: { title: DIALOG_BACK_TO_EDITOR_BUTTON_TITLE, onClick: handleVideoProcessDialogNoDownload },
    });
  }, [resultVideoUrl]);

  return async () => {
    openDialog(() => <VideoProgressDialog />, {
      title: 'Rendering...',
      cancelButton: { title: DIALOG_CANCEL_BUTTON_TITLE, onClick: handleVideoProgressDialogCancel },
    });

    const adjustmentOptions = [
      {
        filter: 'eq',
        options: {
          contrast: shiftValuesContrast(contrast),
        },
      },
      {
        filter: 'eq',
        options: {
          saturation: shiftValuesSaturation(saturation),
        },
      },
      {
        filter: 'colorlevels',
        options: {
          rimax: shiftValuesBrightnessLight(brightness),
          gimax: shiftValuesBrightnessLight(brightness),
          bimax: shiftValuesBrightnessLight(brightness),
          romax: shiftValuesBrightnessDark(brightness),
          gomax: shiftValuesBrightnessDark(brightness),
          bomax: shiftValuesBrightnessDark(brightness),
        },
      },
      {
        filter: 'hue',
        options: {
          h: hue,
        },
      },
      ...(invert ? [{ filter: 'negate' }] : []),
      {
        filter: 'gblur',
        options: {
          sigma: blur,
        },
      },
      ...(flipVertical ? [{ filter: 'vflip' }] : []),
      ...(flipHorizontal ? [{ filter: 'hflip' }] : []),
    ];

    const vfOptions =
      videoFit === VIDEO_FIT._COVER
        ? {
            filter: 'crop',
            options: {
              w: `ih*${CANVAS_FORMATS[canvasFormat].title}`,
              h: 'ih',
              x: getXPos(),
              y: getYPos(),
            },
          }
        : [
            {
              filter: 'pad',
              options: {
                w: `max(iw\\,ih*(${CANVAS_FORMATS[canvasFormat].title}))`,
                h: `ow/(${CANVAS_FORMATS[canvasFormat].title})`,
                x: getXPos(),
                y: getYPos(),
                color: videoBgColor,
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

    const panOptions = panShot ? { filter: 'zoomPan', options: '' } : {};

    const formData = new FormData();
    formData.append('file', video);
    formData.append('trimTime', JSON.stringify([secondsStart, secondsEnd]));
    formData.append('vfOptions', JSON.stringify(vfOptions));
    formData.append('afOptions', JSON.stringify(audioOptions));
    formData.append('adjustOptions', JSON.stringify(adjustmentOptions));
    formData.append('panOptions', JSON.stringify(panOptions));
    formData.append('outputFormat', outputFormat);
    axios
      .post('/api/ffmpeg/encode', formData)
      .then((res) => {
        setFilename(res.data.fileName);
        setResultVideoUrl(res.data.newVideoUrl);
        setResultThumbUrl(res.data.newThumbUrl);
      })
      .catch((e) => {
        console.error('An error occurred: ', e);
      });
  };
}
