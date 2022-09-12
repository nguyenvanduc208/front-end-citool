import { toast } from 'react-toastify';


export const errorNoti = (message) => {
    toast.error(message, {
    position: "top-center",
    closeOnClick: false,
  })
}

export const successNoti = (message) => {
  toast.success(message, {
  position: "top-center",
  closeOnClick: false,
})
}