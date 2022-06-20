import create from 'zustand';
import createVideoSlice from './createVideoSlice';
import createDialogSlice from './createDialogSlice';
import { createEditorSlice } from './createEditorSlice';

const useStore = create((set, get) => ({
  ...createVideoSlice(set, get),
  ...createEditorSlice(set, get),
  ...createDialogSlice(set, get),
}));

export default useStore;
