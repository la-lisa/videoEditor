import create from 'zustand';
import createEditorSlice from './createEditorSlice';
import createVideoSlice from "./createVideoSlice";

const useStore = create((set, get) => ({
  ...createEditorSlice(set, get),
  ...createVideoSlice(set, get),
}));

export default useStore;