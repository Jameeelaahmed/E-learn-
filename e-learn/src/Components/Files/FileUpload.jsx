// FileUpload.js
import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import FilesList from "./FilesList";
import classes from "./FileUpload.module.css";
import UpButton from "../Button/UpButton";
import { useLocation, useParams } from "react-router-dom";

export default function FileUpload({ collectFiles, singleFile, fileTypes }) {
    const { t } = useTranslation();
    const { assignmentId, groupId } = useParams();
    const location = useLocation();
    const path = location.pathname;
    const [selectedFiles, setSelectedFiles] = useState([]);
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        const files = [...event.target.files];
        if (singleFile && files.length > 1) {
            alert("You can only upload one file.");
            return;
        }
        if (fileTypes && files.some(file => !fileTypes.includes(file.type))) {
            alert(`Please upload only ${fileTypes.join(", ")} files.`);
            return;
        }
        setSelectedFiles(singleFile ? [files[0]] : files);
    };

    const handleButtonClick = (e) => {
        e.preventDefault();
        fileInputRef.current.click();
    };

    const handleDelete = () => {
        setSelectedFiles([]);
    };

    useEffect(() => {
        collectFiles(selectedFiles);
    }, [selectedFiles]);

    function getRole() {
        return localStorage.getItem('role');
    }

    const role = getRole();

    return (
        <>
            {(role === "Staff" || role === "Admin") && (
                <>
                    <div className={`${classes.upload_card} ${classes.wid}`}>
                        <UpButton classwid="wid" onClick={handleButtonClick}>{t("upload")}</UpButton>
                        <input
                            ref={fileInputRef}
                            id="fileInput"
                            type="file"
                            onChange={handleFileChange}
                            className={classes.fileInput}
                            multiple={!singleFile}
                            accept={fileTypes && fileTypes.join(',')}
                        />
                    </div>
                    <FilesList files={selectedFiles} onDelete={handleDelete} />
                </>
            )}
            {role === "Student" && path.includes(`assignments/${assignmentId}`) && (
                <div className={classes.wid}>
                    <FilesList files={selectedFiles} onDelete={handleDelete} />
                    <div className={classes.upload_click}>
                        <div className={`${classes.space}`}>
                            <UpButton classwid="wid" onClick={handleButtonClick}>{t("upload")}</UpButton>
                            <input
                                ref={fileInputRef}
                                id="fileInput"
                                type="file"
                                onChange={handleFileChange}
                                className={classes.fileInput}
                                multiple={!singleFile}
                                accept={fileTypes && fileTypes.join(',')}
                            />
                        </div>
                        <button className={classes.submit}>{t("submit")}</button>
                    </div>
                </div>
            )}
        </>
    );
};
