import Swal from 'sweetalert2';

const successAlert = (model, action) => {
  Swal.fire({
    title: 'Success!',
    text: `${model} has been successfully ${action}.`,
    icon: 'success',
    showConfirmButton: false,
    timer: 2000
  });
}

const deleteConfirm = () => {
  return new Promise((resolve, reject) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Deleted data cannot be recovered!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Yes!'
    }).then((result) => {
      resolve(result);
    }).catch((error) => {
      reject(error);
    });
  });
};

export {
  successAlert,
  deleteConfirm
}