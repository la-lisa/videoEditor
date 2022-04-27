import useStore from '../../../store/useStore';
import { Container } from '@mui/material';

export default function VideoProcessingFinishedDialog() {
  const resultThumbUrl = useStore((state) => state.resultThumbUrl);

  return (
    <Container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
      {resultThumbUrl && <img src={resultThumbUrl} alt="Thumbnail of processed video" />}
    </Container>
  );
}
