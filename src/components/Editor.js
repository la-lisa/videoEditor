import { useEffect, useState } from "react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { Button, CircularProgress, Container, Stack } from "@mui/material";

const ffmpeg = createFFmpeg({ log: true });

export default function Editor() {
  const [ffmpegReady, setFfmpegReady] = useState(false);
  const [video, setVideo] = useState(null);

  useEffect(() => {
    const load = async () => {
      await ffmpeg.load();
      setFfmpegReady(true);
    }
    load();
  }, []);

  const writeFile = async () => {
    await ffmpeg.FS('writeFile', 'temp.mp4', await fetchFile(video));
  }

  return (
    <Stack spacing={2}>
      { ffmpegReady ? (
          <Container maxWidth="md">
            <Stack spacing={1}>
              { video ? (
                  <>
                    <video controls src={ URL.createObjectURL(video) } />
                    <Button variant="contained" onClick={ writeFile }>Write File to Memory</Button>
                  </>
                ) : (
                  <>
                    <label htmlFor="upload-video">Upload Video</label>
                    <input id="upload-video" aria-describedby="Video Upload Field" type="file" accept=" video/*" onChange={(e) => { setVideo(e.target.files?.item(0)) }} />
                  </>
                )
              }
            </Stack>
          </Container>
        ) : (
          <CircularProgress />
        )
      }
    </Stack>
  );
}