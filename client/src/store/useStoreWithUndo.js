import create from 'zustand';
import { createUndoEditorSlice } from './createEditorSlice';

const useStoreWithUndo = create((set, get, api) => ({
  ...createUndoEditorSlice(set, get, api),
}));

export default useStoreWithUndo;
