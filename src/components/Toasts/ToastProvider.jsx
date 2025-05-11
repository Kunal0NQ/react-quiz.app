import {Toaster} from 'sonner';

const ToastProvider = ({children}) => 
{
    return (
        <>
            {children}
            <Toaster position="top-right" richColors />
        </>
    )
}

export default ToastProvider;