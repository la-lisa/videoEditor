import {useEffect, useRef} from "react";
import VideoProgressDialog from "../components/ui/dialogs/VideoProgressDialog";
import useStore from "../store/useStore";
import {DIALOG_CANCEL_BUTTON_TITLE, VIDEO_FIT} from "../utils/utils";
import axios from "axios";

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

export function useWriteFile() {
  const video = useStore(state => state.video);
  const videoFit = useStore(state => state.videoFit);
  const trimTime = useStore(state => state.trimTime);
  const canvasFormat = useStore(state => state.canvasFormat);
  const videoBgColor = useStore(state => state.videoBgColor);
  const setResultVideoURL = useStore(state => state.setResultVideoURL);
  const openDialog = useStore(state => state.openDialog);
  const closeDialog = useStore(state => state.closeDialog);

  const handleVideoProgressDialogCancel = () => {
    // TODO figure out how to cancel running task
    closeDialog();
  }

  return async () => {
    openDialog(() => <VideoProgressDialog/>, {
      title: 'Rendering...',
      cancelButton: { title: DIALOG_CANCEL_BUTTON_TITLE, onClick: handleVideoProgressDialogCancel },
    });

    const vfOptions = videoFit === VIDEO_FIT._COVER
      ? { filter: 'crop', options: `ih*${canvasFormat}:ih` }
      : {
        filter: 'pad',
        options: `width=max(iw\\,ih*(${canvasFormat})):height=ow/(${canvasFormat}):x=(ow-iw)/2:y=(oh-ih)/2:color=${videoBgColor},setsar=1`
      }

    const formData = new FormData();
    formData.append("file", video);
    formData.append("trimTime", trimTime);
    formData.append("vfOptions", JSON.stringify(vfOptions));

    axios.post('/encode', formData)
      .then((res) => {
        setResultVideoURL(res.data.newVideoUrl);
        closeDialog();
      })
      .catch((e) => {
        console.error('An error occurred: ', e);
      })
  };
}