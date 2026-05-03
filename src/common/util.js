import {Bounce, toast} from "react-toastify";

export const showToast = (message, type = 'error') => {
    if (type === 'info') {
        toast.info(message, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
        });
        return;
    }
    else if (type === 'success') {
        toast.success(message, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
        });
        return;
    }
    toast.error(message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
    });
}

export const fireBaseDate = (firebaseTimestamp) => {
    if (firebaseTimestamp) {
        const totalMilliseconds = (firebaseTimestamp._seconds * 1000) + (firebaseTimestamp._nanoseconds / 1000000);
        const date = new Date(totalMilliseconds);
        return date.toLocaleDateString();
    }
}