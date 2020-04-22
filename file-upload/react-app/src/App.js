import React, { useState } from 'react';
import './App.css';
import fetch from 'isomorphic-fetch';

const FILE_UPLOAD_MUTATION = `
  mutation ($name: String!, $type: String!, $base64str: String!) {
    fileUpload(name: $name, type: $type, base64str: $base64str) {
      file_path
    }
  }
`;

function App() {
  const [file, setFile] = useState(null);
  const [base64Str, setBase64Str] = useState(null);
  const [filepath, setFilePath] = useState(null);
  const fileUpload = (file) => {
    // make fetch api call to upload file
    const fileName = file.name;
    const fileType = file.type;
    const variables = { name: fileName, type: fileType, base64str: base64Str };
    const url = 'http://localhost:8080/v1/graphql';
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        query: FILE_UPLOAD_MUTATION,
        variables: variables
      })
    };
    fetch(url, options)
      .then(res => res.json())
      .then(res => {
        if (res.errors) {
          alert("Something went wrong");
        } else {
          setFilePath(res.data.fileUpload.file_path)
        }
      });
  }

  const onChange = (e) => {
    setFile(e.target.files[0])
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsBinaryString(e.target.files[0]);
    }
    reader.onload = function () {
      const base64str = btoa(reader.result);
      setBase64Str(base64str);
    };
    reader.onerror = function () {
      console.log('Unable to parse file');
    };
  }
  const onFormSubmit = (e) => {
    e.preventDefault() // Stop form submit
    fileUpload(file);
  }
  return (
    <div className="App">
      <form onSubmit={onFormSubmit}>
        <h1>File Upload</h1>
        <input type="file" onChange={onChange} />
        <button type="submit">Upload</button>
      </form>
      <div>{filepath ? <a href={`http://localhost:3000${filepath}`}>Open file</a> : null}</div>
    </div>
  );
}

export default App;
