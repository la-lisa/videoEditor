import { useCallback, useEffect, useRef, useState } from 'react';
import VideoProgressDialog from '../components/ui/dialogs/VideoProgressDialog';
import useStore from '../store/useStore';
import {
  CANVAS_FORMATS,
  DIALOG_BACK_TO_EDITOR_BUTTON_TITLE,
  DIALOG_CANCEL_BUTTON_TITLE,
  DIALOG_DOWNLOAD_BUTTON_TITLE,
  VIDEO_FIT,
} from '../utils/utils';
import axios from 'axios';
import io from 'socket.io-client';
import VideoProcessingFinishedDialog from '../components/ui/dialogs/VideoProcessingFinishedDialog';
import useStoreWithUndo from '../store/useStoreWithUndo';
import {
  getXPos,
  getYPos,
  shiftValuesBrightnessDark,
  shiftValuesBrightnessLight,
  shiftValuesContrast,
  shiftValuesSaturation,
} from '../utils/utils';

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

export function useUploadVideo() {
  const video = useStore((state) => state.video);
  const setThumbUrls = useStore((state) => state.setThumbUrls);
  const setThumbWidth = useStore((state) => state.setThumbWidth);
  const setFilename = useStore((state) => state.setFilename);

  return () => {
    const formData = new FormData();
    formData.append('file', video);
    axios
      .post('/api/ffmpeg/upload', formData)
      .then((res) => {
        setFilename(res.data.filename);
        setThumbUrls(res.data.thumbs.thumbUrls);
        setThumbWidth(res.data.thumbs.thumbWidth);
      })
      .catch((e) => {
        console.error('An error occurred: ', e);
      });
  };
}

export function useRenderVideo() {
  const filename = useStore((state) => state.filename);
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
  const startTime = useStore((state) => state.startTime);
  const endTime = useStore((state) => state.endTime);
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

  const handleVideoProgressDialogCancel = () => {
    axios
      .post('/api/ffmpeg/killffmpeg')
      .then(() =>
        axios.delete('/api/deleteConverted', {
          data: {
            filename: filename,
          },
        })
      )
      .catch((e) => {
        console.error('An error occurred while trying to kill ffmpeg process and deleting converted file(s):', e);
      })
      .then(() => {
        setResultVideoUrl(null);
        setResultVideoProgress(null);
      });
    closeDialog();
  };

  const handleVideoProcessDialogNoDownload = () => {
    axios
      .delete('/api/deleteConverted', {
        data: {
          filename: filename,
        },
      })
      .then(() => {
        setResultVideoUrl(null);
        setResultVideoProgress(null);
      })
      .catch((e) => {
        console.error('An error occurred:', e);
      });
    closeDialog();
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
              x: getXPos(videoAlign, videoFit),
              y: getYPos(videoAlign, videoFit),
            },
          }
        : [
            {
              filter: 'pad',
              options: {
                w: `max(iw\\,ih*(${CANVAS_FORMATS[canvasFormat].title}))`,
                h: `ow/(${CANVAS_FORMATS[canvasFormat].title})`,
                x: getXPos(videoAlign, videoFit),
                y: getYPos(videoAlign, videoFit),
                color: videoBgColor,
              },
            },
            {
              filter: 'setsar',
              options: '1',
            },
          ];

    const audioOptions = muteAudio
      ? { filter: 'volume', options: '0.0' }
      : { filter: 'volume', options: `${audioVolume / 100}` };

    axios
      .post('/api/ffmpeg/encode', {
        filename,
        trimTime: [startTime, endTime],
        vfOptions,
        afOptions: audioOptions,
        adjustOptions: adjustmentOptions,
      })
      .then((res) => {
        setResultVideoUrl(res.data.newVideoUrl);
        setResultThumbUrl(res.data.newThumbUrl);
      })
      .catch((e) => {
        console.error('An error occurred:', e);
      });
  };
}
