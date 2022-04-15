import create from 'zustand';
import createEditorSlice from './createEditorSlice';
import createVideoSlice from "./createVideoSlice";
import createDialogSlice from "./createDialogSlice";

const useStore = create((set, get) => ({
  ...createEditorSlice(set, get),
  ...createVideoSlice(set, get),
  ...createDialogSlice(set, get),
}));

export default useStore;