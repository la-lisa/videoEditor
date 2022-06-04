import create from 'zustand';
import createEditorSlice from './createEditorSlice';

const useStoreWithUndo = create((set, get) => ({
  ...createEditorSlice(set, get),
}));

export default useStoreWithUndo;
