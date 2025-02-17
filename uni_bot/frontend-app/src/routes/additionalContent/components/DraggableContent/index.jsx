import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';

import { DriveFolderUploadIcon } from '@assets/icons';


function DraggableContent({ acceptedFiles, handleUpdateContentData }) {
  const onDrop = useCallback((files) => {
    handleUpdateContentData(false, files);
  }, [handleUpdateContentData]);

  const {
    getRootProps,
    getInputProps,
  } = useDropzone({
    accept: acceptedFiles,
    onDrop,
  });

  return (
    <>
      <Typography variant="h4" className="AdditionalContent--heading">
        It looks like you don&apos;t have any additional content yet. Do you want to download a file?
      </Typography>
      <div
        className="AdditionalContentDropzone"
        role="button"
        aria-label="Drag and drop files here or click to browse"
        aria-describedby="dropzoneDescription"
        {...getRootProps()}
      >
        <DriveFolderUploadIcon />
        <input {...getInputProps()} />
        <p className="AdditionalContentDropzone-heading">
          Drag &amp; Drop or browse
        </p>
        <p className="AdditionalContentDropzone-note">
          Supports: .pdf, .docx, .md, .txt, .html
        </p>
      </div>
    </>
  );
}

DraggableContent.propTypes = {
  acceptedFiles: PropTypes.objectOf(
    PropTypes.arrayOf(PropTypes.string),
  ).isRequired,
  handleUpdateContentData: PropTypes.func.isRequired,
};

export default DraggableContent;
