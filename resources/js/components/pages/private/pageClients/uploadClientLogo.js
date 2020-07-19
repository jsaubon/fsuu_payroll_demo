import React, { useState } from "react";
import Text from "antd/lib/typography/Text";
import { Upload } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

const UploadClientLogo = ({ setClientInformation }) => {
    const [imageUrl, setImageUrl] = useState();
    const [loadingUpload, setLoadingUpload] = useState(false);
    const dummyRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
    };
    function beforeUpload(file) {
        const isJpgOrPng =
            file.type === "image/jpeg" || file.type === "image/png";
        if (!isJpgOrPng) {
            message.error("You can only upload JPG/PNG file!");
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error("Image must smaller than 2MB!");
        }
        return isJpgOrPng && isLt2M;
    }

    const uploadButton = (
        <div>
            {loadingUpload ? <LoadingOutlined /> : <PlusOutlined />}
            <div className="ant-upload-text">Upload</div>
        </div>
    );

    function getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener("load", () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    const handleChange = info => {
        if (info.file.status === "uploading") {
            setLoadingUpload(true);
            return;
        }
        if (info.file.status === "done") {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrl => {
                setImageUrl(imageUrl);
                setLoadingUpload(false);
                setClientInformation({
                    ...clientInformation,
                    photo: imageUrl
                });
            });
        }
    };

    return (
        <>
            <Text>Client Logo</Text>

            <Upload
                name="photo"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                customRequest={dummyRequest}
                beforeUpload={beforeUpload}
                onChange={e => handleChange(e)}
            >
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt="avatar"
                        style={{ width: "100%" }}
                    />
                ) : (
                    uploadButton
                )}
            </Upload>
        </>
    );
};

export default UploadClientLogo;
