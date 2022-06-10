export const confirm = (
  onConfirm: Function,
  onCancel: Function,
  message: string = ''
) => {
  if (window.confirm(message)) {
    onConfirm();
  } else {
    onCancel();
  }
};
