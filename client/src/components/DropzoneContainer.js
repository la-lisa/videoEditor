import { useEffect, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import PropTypes from "prop-types";
import { UploadFile } from "@mui/icons-material";
import { Typography, useTheme } from "@mui/material";

export default function DropzoneContainer({ setVideo }) {
  const theme = useTheme();

  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject
  } = useDropzone({
    accept: 'video/*'
  });

  useEffect(() => {
    acceptedFiles && setVideo(acceptedFiles[0]);
  }, [acceptedFiles, setVideo]);

  const { baseStyle, focusedStyle, acceptStyle, rejectStyle } = useMemo(() => {
    const baseStyle = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      flex: 1,
      padding: theme.spacing(3),
      borderWidth: theme.spacing(0.25),
      borderRadius: theme.spacing(2),
      borderColor: theme.palette.primary.light,
      borderStyle: 'dashed',
      backgroundColor: theme.palette.background,
      color: theme.palette.text,
      outline: 'none',
      transitionProperty: 'border',
      transitionDuration: `0.${theme.transitions.duration.short}s`,
      transitionTimingFunction: theme.transitions.easing.easeInOut,
      cursor: 'pointer'
    };
    const focusedStyle = {
      borderColor: theme.palette.primary.dark
    };
    const acceptStyle = {
      borderColor: theme.palette.success.main
    };
    const rejectStyle = {
      borderColor: theme.palette.error.dark
    };

    return { baseStyle, focusedStyle, acceptStyle, rejectStyle };
  }, [theme]);

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isFocused ? focusedStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [baseStyle, isFocused, focusedStyle, isDragAccept, acceptStyle, isDragReject, rejectStyle]);

  return (
    <section className="dropzoneContainer">
      <div {...getRootProps({ className: 'dropzone', style })}>
        <input {...getInputProps({ id: "upload-video", "aria-describedby": "Video Upload Field" })} />
        <UploadFile fontSize="large"/>
        <Typography sx={{ fontWeight: 'bold' }} mt={4}>Upload Video</Typography>
        <Typography mt={2} mb={1}>Drag your file here or click to browse files</Typography>
      </div>
    </section>
  );
}

DropzoneContainer.propTypes = {
  setVideo: PropTypes.func,
}