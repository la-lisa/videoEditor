import create from 'zustand';
import createVideoSlice from './createVideoSlice';
import createDialogSlice from './createDialogSlice';

const useStore = create((set, get) => ({
  ...createVideoSlice(set, get),
  ...createDialogSlice(set, get),
}));

export default useStore;
