import LoadingOverlay from 'react-loading-overlay';

export default function Loader() {
    return (
        <LoadingOverlay
            active={true}
            spinner
            text='Cargando...'
            className="loader"
        />
    )
};
