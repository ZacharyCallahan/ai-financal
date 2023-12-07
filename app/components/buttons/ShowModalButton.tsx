'use client'
import { useState, useEffect } from "react";
type Props = {
    label: string;
    Component: React.FC<any>;
    props: { [key: string]: any}
    className?: string;
};

type ModalState = boolean;
const ShowModalButton = ({ label, Component, props, className } : Props) => {
    const [showModal, setShowModal] = useState<ModalState>(false);

    useEffect(() => {
        if (showModal) {
            // Disable scrolling when modal is open
            document.body.style.overflow = 'hidden';
        } else {
            // Enable scrolling when modal is closed
            document.body.style.overflow = 'unset';
        }

        // Cleanup function to reset overflow when component unmounts
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showModal]);

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    return (
        <div className={className}>
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
                    <div className="relative p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
                        <Component {...props} toggleModal={toggleModal} />
                        <button
                            className="mt-3 bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            onClick={toggleModal}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
                onClick={toggleModal}
            >
                {label}
            </button>
        </div>
    );
}

export default ShowModalButton;
