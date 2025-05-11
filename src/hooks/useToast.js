import {toast} from 'sonner';

const useToast = () => {

    const showSuccessToast = (message)=> { toast.success(message)};

    const showErrorToast = (message) => {toast.error(message)};

    const showCustomToast = (component) => {toast.error(component)};

    return { showSuccessToast, showErrorToast, showCustomToast}
}

export default useToast;