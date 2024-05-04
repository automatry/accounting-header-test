import React from 'react';

function Header({ onFileUpload }) {
  return (
    <header>
        <h4>Select files to upload dummy data (with cost codes)</h4>
        <br></br>
      <input type="file" multiple onChange={onFileUpload} />
    </header>
  );
}

export default Header;