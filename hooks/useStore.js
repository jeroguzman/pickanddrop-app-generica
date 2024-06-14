import { create } from 'zustand';


const useStore = create(
    set => ({
        token1: '',
        id1: '',
        url1: '',
        notificacion: null,
        sound: null,
        state: false,
    })
);

export default useStore;