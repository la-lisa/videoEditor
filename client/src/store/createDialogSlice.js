const createDialogSlice = (set, get) => ({
  isDialogShown: false,
  setIsDialogShown: (isShown) => set({ isDialogShown: isShown }),
  dialogContent: null,
  dialogState: { title: '', actionButton: null, cancelButton: null },
  openDialog: (content, state) => set({ isDialogShown: true, dialogContent: content, dialogState: state }),
  closeDialog: () => set({ isDialogShown: false, dialogContent: null }),
});

export default createDialogSlice;
