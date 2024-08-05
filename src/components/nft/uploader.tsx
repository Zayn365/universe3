import Image from 'next/image';
import React, { useMemo } from 'react';

const Uploader = ({ uploadedImage }: { uploadedImage: File }) => {
    const image = URL.createObjectURL(uploadedImage);
    return (
        <div className="relative w-full h-full">
            <Image
                src={image}
                alt="Uploaded Image"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
            />
        </div>
    );
};

export default React.memo(Uploader);
